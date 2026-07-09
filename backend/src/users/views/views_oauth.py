import logging
from urllib.error import URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen

from django.conf import settings
from django.core.files.base import ContentFile
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import AuthenticationFailed, ValidationError
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from social_core.exceptions import AuthException
from social_django.utils import load_backend, load_strategy

from src.config.settings.oauth_settings import (
    REGISTERED_OAUTH_BACKEND_MAP,
    REGISTERED_OAUTH_PROVIDER_NAMES,
)
from src.lib.django.views_mixin import ViewSetHelperMixin
from src.users.auth import _jwt_response, _mfa_required_response, response_tokens
from src.users.models import User
from src.users.serializers import OAuthCodeExchangeSerializer

logger = logging.getLogger("app")


def _validate_redirect_uri(provider: str, redirect_uri: str) -> None:
    if not redirect_uri:
        return

    allowed = tuple(getattr(settings, "OAUTH_ALLOWED_REDIRECT_URIS", ()))
    if allowed and redirect_uri not in allowed:
        raise ValidationError(
            {
                "error": "invalid_redirect_uri",
                "provider": provider,
                "details": "The redirect_uri is not allowed for this environment.",
            }
        )

    parsed = urlparse(redirect_uri)
    if not parsed.scheme or not parsed.netloc:
        raise ValidationError(
            {
                "error": "invalid_redirect_uri",
                "provider": provider,
                "details": "The redirect_uri must be an absolute URL.",
            }
        )


def _extract_picture_url(extra_data: dict) -> str | None:
    """Recursively search OAuth response data for a picture/avatar URL."""
    if not isinstance(extra_data, dict):
        return None

    # Common keys providers use for profile pictures.
    picture_keys = (
        "picture",
        "avatar_url",
        "profile_image_url",
        "profile_image_url_https",
        "image",
        "photo",
        "avatar",
        "profile_picture",
        "thumbnail",
    )

    for key, value in extra_data.items():
        if isinstance(value, str) and value.startswith("http"):
            if key in picture_keys:
                return value
        if isinstance(value, dict):
            nested = _extract_picture_url(value)
            if nested:
                return nested
        if isinstance(value, list):
            for item in value:
                nested = _extract_picture_url(item)
                if nested:
                    return nested
    return None


def _download_profile_picture(user: User, backend) -> None:
    """Download the OAuth avatar and save it to the user's profile_picture."""
    try:
        from social_django.models import UserSocialAuth
    except ImportError:
        logger.warning("social_django is not installed; skipping OAuth avatar download")
        return

    social = UserSocialAuth.objects.filter(user=user).first()
    extra_data = social.extra_data or {} if social else {}
    picture_url = _extract_picture_url(extra_data)

    # Fallback: re-fetch fresh profile data from the provider using the token.
    if not picture_url and social and hasattr(backend, "user_data"):
        access_token = extra_data.get("access_token") or extra_data.get("token")
        if access_token:
            try:
                fresh_data = backend.user_data(access_token)
                picture_url = _extract_picture_url(fresh_data)
            except Exception as exc:
                logger.warning(
                    "Could not refresh OAuth profile data for user=%s: %s", user.pk, exc
                )

    if not picture_url:
        logger.info(
            "No picture URL found for user=%s provider=%s",
            user.pk,
            getattr(social, "provider", backend.name if backend else "unknown"),
        )
        return

    # Always store the URL so the frontend can fall back to it.
    user.picture_url = picture_url

    try:
        req = Request(
            picture_url,
            headers={"User-Agent": "Mozilla/5.0 (compatible; Sub/1.0)"},
        )
        with urlopen(req, timeout=10) as response:
            content_type = response.headers.get("Content-Type", "")
            if not content_type.startswith("image/"):
                logger.warning(
                    "OAuth picture URL returned non-image content-type=%s for user=%s",
                    content_type,
                    user.pk,
                )
                user.save(update_fields=["picture_url"])
                return
            data = response.read()
            if not data:
                user.save(update_fields=["picture_url"])
                return

        ext = "jpg"
        if "png" in content_type:
            ext = "png"
        elif "gif" in content_type:
            ext = "gif"
        elif "webp" in content_type:
            ext = "webp"

        filename = f"{user.pk}_oauth_avatar.{ext}"
        user.profile_picture.save(filename, ContentFile(data), save=False)
        user.save(update_fields=["profile_picture", "picture_url"])
        logger.info("Saved OAuth profile picture for user=%s", user.pk)
    except URLError as exc:
        logger.warning(
            "Could not download OAuth profile picture for user=%s: %s", user.pk, exc
        )
        user.save(update_fields=["picture_url"])
    except Exception as exc:
        logger.exception(
            "Unexpected error downloading OAuth profile picture for user=%s", user.pk
        )
        user.save(update_fields=["picture_url"])


class OAuthViewSet(ViewSetHelperMixin, viewsets.GenericViewSet):
    """Provider-based OAuth login endpoint for code exchange flows."""

    serializers = {
        # "default": OAuthCodeExchangeSerializer,
        "login_or_register": OAuthCodeExchangeSerializer,
    }

    permissions = {
        "default": [AllowAny],
    }

    @action(
        detail=False,
        methods=["post"],
        url_path=r"(?P<provider>[^/.]+)/login-or-register",
    )
    def login_or_register(self, request, provider=None, *args, **kwargs):
        provider = (provider or "").strip().lower()
        provider_config = REGISTERED_OAUTH_BACKEND_MAP.get(provider)

        if not provider_config:
            raise ValidationError(
                {
                    "error": "unsupported oauth provider",
                    "allowed_providers": list(REGISTERED_OAUTH_PROVIDER_NAMES),
                }
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        payload = serializer.validated_data
        from pprint import pprint

        print("*" * 100)
        pprint(payload)
        print("*" * 100)

        redirect_uri = payload.get("redirect_uri") or ""
        _validate_redirect_uri(provider=provider, redirect_uri=redirect_uri)
        strategy = load_strategy(request=request)
        backend = load_backend(
            strategy=strategy,
            name=provider_config["backend_name"],
            redirect_uri=redirect_uri,
        )

        oauth_request_data = {
            "code": payload["code"],
            "state": payload.get("state", ""),
            "redirect_uri": redirect_uri,
            "code_verifier": payload.get("code_verifier", ""),
        }
        oauth_request_data = {k: v for k, v in oauth_request_data.items() if v}

        # social-auth's auth_complete() reads request_data() from strategy.
        strategy.request_data = lambda merge=True: oauth_request_data  # type: ignore[assignment]

        # IMPORTANT:
        # load_backend() snapshots request data into backend.data at init time,
        # which misses JSON payload fields from DRF requests unless we sync it.
        backend.data = oauth_request_data

        # This endpoint is frontend-initiated OAuth code exchange. CSRF/state
        # validation happens on the frontend, so we disable social-auth's
        # session-bound state validation for this backend call.
        backend.STATE_PARAMETER = False
        backend.REDIRECT_STATE = False

        try:
            user = backend.auth_complete()
        except AuthException as exc:
            logger.warning(
                "OAuth auth_complete failed for provider=%s: %s", provider, exc
            )
            raise AuthenticationFailed(
                {
                    "error": "oauth_exchange_failed",
                    "provider": provider,
                    "details": str(exc),
                }
            )
        except Exception as exc:
            logger.exception("Unexpected OAuth failure for provider=%s", provider)
            raise AuthenticationFailed(
                {
                    "error": "oauth_exchange_failed",
                    "provider": provider,
                    "details": "unexpected provider error",
                }
            ) from exc

        if not user:
            raise AuthenticationFailed(
                {"error": "oauth_authentication_failed", "provider": provider}
            )

        if not user.is_active:
            raise AuthenticationFailed({"error": "inactive_user", "provider": provider})

        if not getattr(user, "email", ""):
            raise ValidationError(
                {
                    "error": "email_required",
                    "provider": provider,
                    "details": "Provider did not return an email. Ensure provider app is configured for email access.",
                }
            )

        user.username = user.email.split("@")[0]
        user.advance_onboarding(
            from_step=User.OnboardingStatus.NEEDS_BASIC_INFORMATION,
            to_commit=False,
        )
        user.save(update_fields=["onboarding_status", "username"])

        # Try to download the avatar the provider exposes (Google/GitHub/Twitter).
        # This runs best-effort and never blocks login on failure.
        _download_profile_picture(user, backend)

        return response_tokens(user, request=request)

    @action(detail=False, methods=["get"], url_path=r"(?P<provider>[^/.]+)/callback")
    def oauth_callback(self, request, provider=None):
        """
        OAuth callback endpoint that providers (e.g. Google) redirect to after authorization.

        Accepts OAuth query parameters (code, state, etc.) via GET, completes the
        authentication flow, and returns a JWT response.

        GET /api/v1/oauth/{provider}/callback/?code=...&state=...
        """

        raise AuthenticationFailed(
            "Deprecated endpoint - use POST /api/v1/oauth/{provider}/login-or-register/ instead"
        )

        provider = (provider or "").strip().lower()
        provider_config = REGISTERED_OAUTH_BACKEND_MAP.get(provider)

        if not provider_config:
            logger.warning(
                "OAuth callback received for unsupported provider=%s from IP=%s",
                provider,
                request.META.get("REMOTE_ADDR", "unknown"),
            )
            raise ValidationError(
                {
                    "error": "unsupported oauth provider",
                    "allowed_providers": list(REGISTERED_OAUTH_PROVIDER_NAMES),
                }
            )

        # Check for OAuth error responses from the provider (e.g. user denied access)
        oauth_error = request.query_params.get("error", "").strip()
        if oauth_error:
            error_description = request.query_params.get(
                "error_description", ""
            ).strip()
            logger.warning(
                "OAuth provider=%s returned error=%s description=%s",
                provider,
                oauth_error,
                error_description,
            )
            raise AuthenticationFailed(
                {
                    "error": "oauth_provider_error",
                    "provider": provider,
                    "details": error_description or oauth_error,
                }
            )

        # Extract and sanitize OAuth query parameters
        raw_code = request.query_params.get("code", "").strip()
        raw_state = request.query_params.get("state", "").strip()
        raw_redirect_uri = request.query_params.get("redirect_uri", "").strip()
        raw_code_verifier = request.query_params.get("code_verifier", "").strip()

        if not raw_code:
            logger.warning(
                "OAuth callback for provider=%s missing authorization code from IP=%s",
                provider,
                request.META.get("REMOTE_ADDR", "unknown"),
            )
            raise ValidationError(
                {
                    "error": "missing_authorization_code",
                    "provider": provider,
                    "details": "The authorization code is required but was not provided by the OAuth provider.",
                }
            )

        # Validate code format: authorization codes should be reasonable length
        # and contain only safe characters
        max_code_length = 4096
        if len(raw_code) > max_code_length:
            logger.warning(
                "OAuth callback for provider=%s received oversized code (length=%d) from IP=%s",
                provider,
                len(raw_code),
                request.META.get("REMOTE_ADDR", "unknown"),
            )
            raise ValidationError(
                {
                    "error": "invalid_authorization_code",
                    "provider": provider,
                    "details": "The authorization code exceeds the maximum allowed length.",
                }
            )

        if raw_state and len(raw_state) > 2048:
            logger.warning(
                "OAuth callback for provider=%s received oversized state (length=%d)",
                provider,
                len(raw_state),
            )
            raise ValidationError(
                {
                    "error": "invalid_state_parameter",
                    "provider": provider,
                    "details": "The state parameter exceeds the maximum allowed length.",
                }
            )

        if raw_redirect_uri and len(raw_redirect_uri) > 2048:
            logger.warning(
                "OAuth callback for provider=%s received oversized redirect_uri (length=%d)",
                provider,
                len(raw_redirect_uri),
            )
            raise ValidationError(
                {
                    "error": "invalid_redirect_uri",
                    "provider": provider,
                    "details": "The redirect_uri parameter exceeds the maximum allowed length.",
                }
            )

        logger.info(
            "OAuth callback initiated for provider=%s",
            provider,
        )

        strategy = load_strategy(request=request)
        backend = load_backend(
            strategy=strategy,
            name=provider_config["backend_name"],
            redirect_uri=raw_redirect_uri,
        )

        backend.STATE_PARAMETER = False
        backend.REDIRECT_STATE = False

        # Build the OAuth request data dict, filtering out empty values
        oauth_request_data = {
            "code": raw_code,
            "state": raw_state,
            "redirect_uri": raw_redirect_uri,
            "code_verifier": raw_code_verifier,
        }
        oauth_request_data = {k: v for k, v in oauth_request_data.items() if v}

        # social-auth's auth_complete() reads request_data() from strategy.
        strategy.request_data = lambda merge=True: oauth_request_data  # type: ignore[assignment]

        try:
            user = backend.auth_complete()
        except AuthException as exc:
            logger.warning(
                "OAuth callback auth_complete failed for provider=%s: %s",
                provider,
                exc,
            )
            raise AuthenticationFailed(
                {
                    "error": "oauth_exchange_failed",
                    "provider": provider,
                    "details": str(exc),
                }
            )
        except Exception as exc:
            logger.exception(
                "Unexpected OAuth callback failure for provider=%s",
                provider,
            )
            raise AuthenticationFailed(
                {
                    "error": "oauth_exchange_failed",
                    "provider": provider,
                    "details": "unexpected provider error",
                }
            ) from exc

        if not user:
            logger.warning(
                "OAuth callback for provider=%s returned no user",
                provider,
            )
            raise AuthenticationFailed(
                {"error": "oauth_authentication_failed", "provider": provider}
            )

        if not user.is_active:
            logger.warning(
                "OAuth callback for provider=%s matched inactive user_id=%s",
                provider,
                user.pk,
            )
            raise AuthenticationFailed({"error": "inactive_user", "provider": provider})

        if not getattr(user, "email", ""):
            logger.warning(
                "OAuth callback for provider=%s returned user_id=%s without email",
                provider,
                user.pk,
            )
            raise ValidationError(
                {
                    "error": "email_required",
                    "provider": provider,
                    "details": "Provider did not return an email. Ensure provider app is configured for email access.",
                }
            )

        logger.info(
            "OAuth callback successful for provider=%s user_id=%s",
            provider,
            user.pk,
        )

        return _oauth_success_response(user)

    @action(detail=False, methods=["get"])
    def get_providers(self, request):
        return Response({"providers": list(REGISTERED_OAUTH_PROVIDER_NAMES)})
