"""
YarnGPT Python SDK
Production-grade API client for YarnGPT TTS API.
"""

from __future__ import annotations

import os
from typing import Optional, Dict, Any, Iterable
from pathlib import Path

import requests
from requests import Response, Session
from requests.exceptions import RequestException


__all__ = [
    "YarnGPTClient",
    "YarnGPTError",
    "AuthenticationError",
    "RateLimitError",
    "APIError",
    "ValidationError",
]


# =========================
# Exceptions
# =========================

class YarnGPTError(Exception):
    """Base exception for all YarnGPT errors."""


class AuthenticationError(YarnGPTError):
    """Raised when authentication fails."""


class RateLimitError(YarnGPTError):
    """Raised when rate limit is exceeded."""


class APIError(YarnGPTError):
    """Raised for non-success API responses."""


class ValidationError(YarnGPTError):
    """Raised for client-side validation errors."""


# =========================
# Client
# =========================

class YarnGPTClient:
    """
    Production-grade client for YarnGPT API.

    Example:
        client = YarnGPTClient(api_key="your_key")
        client.text_to_speech(
            text="Hello world",
            output_path="output.mp3"
        )
    """

    BASE_URL = "https://yarngpt.ai/api/v1"
    MAX_TEXT_LENGTH = 2000
    DEFAULT_TIMEOUT = 30
    DEFAULT_VOICE = "Idera"
    DEFAULT_RESPONSE_FORMAT = "mp3"
    SUPPORTED_FORMATS = {"mp3", "wav", "opus", "flac"}

    def __init__(
        self,
        api_key: Optional[str] = None,
        *,
        timeout: int = DEFAULT_TIMEOUT,
        base_url: Optional[str] = None,
        session: Optional[Session] = None,
    ) -> None:
        """
        Initialize YarnGPT client.

        Args:
            api_key: YarnGPT API key. If not provided, reads from YARNGPT_API_KEY env var.
            timeout: Request timeout in seconds.
            base_url: Optional custom base URL.
            session: Optional pre-configured requests.Session.
        """

        self.api_key = api_key or os.getenv("YARNGPT_API_KEY")
        if not self.api_key:
            raise ValidationError(
                "API key must be provided or set in YARNGPT_API_KEY environment variable."
            )

        self.timeout = timeout
        self.base_url = base_url or self.BASE_URL

        self._session = session or requests.Session()
        self._session.headers.update(
            {
                "Authorization": f"Bearer {self.api_key}",
                "User-Agent": "yarngpt-python-sdk/1.0",
                "Accept": "*/*",
            }
        )

    # =========================
    # Public API
    # =========================

    def text_to_speech(
        self,
        *,
        text: str,
        output_path: Optional[str | Path] = None,
        voice: Optional[str] = None,
        response_format: Optional[str] = None,
        chunk_size: int = 8192,
    ) -> bytes:
        """
        Convert text to speech.

        Args:
            text: Text to convert (max 2000 characters).
            output_path: Optional file path to save audio.
            voice: Voice name (default: Idera).
            response_format: mp3, wav, opus, flac (default: mp3).
            chunk_size: Streaming chunk size.

        Returns:
            Raw audio bytes (even if saved to file).

        Raises:
            ValidationError
            AuthenticationError
            RateLimitError
            APIError
        """

        self._validate_text(text)

        voice = voice or self.DEFAULT_VOICE
        response_format = response_format or self.DEFAULT_RESPONSE_FORMAT

        if response_format not in self.SUPPORTED_FORMATS:
            raise ValidationError(
                f"Invalid response_format '{response_format}'. "
                f"Supported formats: {', '.join(self.SUPPORTED_FORMATS)}"
            )

        endpoint = f"{self.base_url}/tts"

        payload: Dict[str, Any] = {
            "text": text,
            "voice": voice,
            "response_format": response_format,
        }

        try:
            response = self._session.post(
                endpoint,
                json=payload,
                stream=True,
                timeout=self.timeout,
            )
        except RequestException as exc:
            raise YarnGPTError(f"Network error: {exc}") from exc

        self._handle_response_errors(response)

        audio_data = self._stream_response(response, output_path, chunk_size)
        return audio_data

    def close(self) -> None:
        """Close underlying HTTP session."""
        self._session.close()

    # =========================
    # Internal Methods
    # =========================

    def _validate_text(self, text: str) -> None:
        if not text:
            raise ValidationError("Text cannot be empty.")

        if not isinstance(text, str):
            raise ValidationError("Text must be a string.")

        if len(text) > self.MAX_TEXT_LENGTH:
            raise ValidationError(
                f"Text exceeds maximum length of {self.MAX_TEXT_LENGTH} characters."
            )

    def _handle_response_errors(self, response: Response) -> None:
        if response.status_code == 401:
            raise AuthenticationError("Invalid or expired API key.")

        if response.status_code == 429:
            raise RateLimitError("Rate limit exceeded.")

        if not response.ok:
            try:
                error_payload = response.json()
            except Exception:
                error_payload = response.text

            raise APIError(
                f"API Error {response.status_code}: {error_payload}"
            )

    def _stream_response(
        self,
        response: Response,
        output_path: Optional[str | Path],
        chunk_size: int,
    ) -> bytes:
        buffer = bytearray()

        file_handle = None
        if output_path:
            output_path = Path(output_path)
            output_path.parent.mkdir(parents=True, exist_ok=True)
            file_handle = open(output_path, "wb")

        try:
            for chunk in response.iter_content(chunk_size=chunk_size):
                if chunk:
                    buffer.extend(chunk)
                    if file_handle:
                        file_handle.write(chunk)
        finally:
            if file_handle:
                file_handle.close()

        return bytes(buffer)