from __future__ import annotations

from dataclasses import dataclass
from typing import Any
from urllib.parse import urlencode

import requests

DEFAULT_BASE_URL = "https://api.nomba.com"


class NombaError(Exception):
    """Base error for Nomba client failures."""


class NombaConfigurationError(NombaError):
    """Raised when the client is missing required configuration."""


class NombaResponseError(NombaError):
    """Raised when Nomba returns a non-success HTTP response."""

    def __init__(
        self, message: str, *, status_code: int | None = None, payload: Any = None
    ):
        super().__init__(message)
        self.status_code = status_code
        self.payload = payload


@dataclass(slots=True)
class TokenPair:
    access_token: str
    refresh_token: str | None = None
    business_id: str | None = None
    expires_at: str | None = None


class NombaClient:
    """
    Pure HTTP client for the Nomba API.
    No Django imports, no domain models, no business logic.
    """

    def __init__(
        self,
        *,
        client_id: str | None = None,
        client_secret: str | None = None,
        account_id: str | None = None,
        access_token: str | None = None,
        refresh_token: str | None = None,
        base_url: str = DEFAULT_BASE_URL,
        timeout: float = 30.0,
        session: requests.Session | None = None,
        auto_auth: bool = True,
    ) -> None:
        self.client_id = client_id
        self.client_secret = client_secret
        self.account_id = account_id
        self.access_token = access_token
        self.refresh_token = refresh_token
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout
        self.session = session or requests.Session()
        self.auto_auth = auto_auth

    def close(self) -> None:
        self.session.close()

    def __enter__(self) -> "NombaClient":
        return self

    def __exit__(self, exc_type, exc, tb) -> None:
        self.close()

    def obtain_access_token(self, *, account_id: str | None = None) -> TokenPair:
        payload = {
            "grant_type": "client_credentials",
            "client_id": self._required("client_id", self.client_id),
            "client_secret": self._required("client_secret", self.client_secret),
        }
        response = self._request(
            "POST",
            "/v1/auth/token/issue",
            json=payload,
            account_id=account_id,
            include_bearer=False,
            include_account_header=True,
        )
        token = self._extract_token_pair(response)
        self._store_token_pair(token)
        return token

    def refresh_access_token(self, *, account_id: str | None = None) -> TokenPair:
        payload = {
            "grant_type": "refresh_token",
            "refresh_token": self._required("refresh_token", self.refresh_token),
        }
        response = self._request(
            "POST",
            "/v1/auth/token/refresh",
            json=payload,
            account_id=account_id,
            include_bearer=True,
            include_account_header=True,
            allow_retry=False,
        )
        token = self._extract_token_pair(response)
        self._store_token_pair(token)
        return token

    def revoke_access_token(self, *, access_token: str | None = None) -> dict[str, Any]:
        payload = {
            "clientId": self._required("client_id", self.client_id),
            "access_token": self._required(
                "access_token", access_token or self.access_token
            ),
        }
        response = self._request(
            "POST",
            "/v1/auth/token/revoke",
            json=payload,
            include_bearer=False,
            include_account_header=False,
            allow_retry=False,
        )
        return response

    def submit_customer_card_details(
        self, payload: dict[str, Any], *, account_id: str | None = None
    ) -> dict[str, Any]:
        return self._request(
            "POST",
            "/v1/checkout/checkout-card-detail",
            json=payload,
            account_id=account_id,
        )

    def submit_customer_card_otp(
        self, payload: dict[str, Any], *, account_id: str | None = None
    ) -> dict[str, Any]:
        return self._request(
            "POST",
            "/v1/checkout/checkout-card-otp",
            json=payload,
            account_id=account_id,
        )

    def get_user_saved_cards(
        self, order_reference: str, *, otp: str, account_id: str | None = None
    ) -> dict[str, Any]:
        return self._request(
            "GET",
            f"/v1/checkout/user-card/{order_reference}",
            params={"otp": otp},
            account_id=account_id,
        )

    def request_otp_before_saving_card(
        self, payload: dict[str, Any], *, account_id: str | None = None
    ) -> dict[str, Any]:
        return self._request(
            "POST",
            "/v1/checkout/user-card/auth",
            json=payload,
            account_id=account_id,
        )

    def fetch_checkout_transaction_details(
        self,
        payload: dict[str, Any],
        *,
        account_id: str | None = None,
    ) -> dict[str, Any]:
        return self._request(
            "POST",
            "/v1/checkout/confirm-transaction-receipt",
            json=payload,
            account_id=account_id,
        )

    def cancel_checkout_transaction(
        self, payload: dict[str, Any], *, account_id: str | None = None
    ) -> dict[str, Any]:
        return self._request(
            "POST",
            "/v1/checkout/transaction/cancel",
            json=payload,
            account_id=account_id,
        )

    def create_checkout_order(
        self,
        payload: dict[str, Any],
        *,
        account_id: str | None = None,
    ) -> dict[str, Any]:
        """Create a hosted checkout order and return {checkoutLink, orderReference}."""
        return self._request(
            "POST",
            "/v1/checkout/order",
            json=payload,
            account_id=account_id,
        )

    def cancel_checkout_order(
        self,
        order_reference: str,
        *,
        account_id: str | None = None,
    ) -> dict[str, Any]:
        """Cancel a pending checkout order by order reference."""
        return self._request(
            "POST",
            "/v1/checkout/order/cancel",
            json={"orderReference": order_reference},
            account_id=account_id,
        )

    def refund_checkout_order(
        self,
        payload: dict[str, Any],
        *,
        account_id: str | None = None,
    ) -> dict[str, Any]:
        """Refund a completed checkout transaction (production only)."""
        return self._request(
            "POST",
            "/v1/checkout/refund",
            json=payload,
            account_id=account_id,
        )

    def charge_tokenized_card(
        self,
        payload: dict[str, Any],
        *,
        account_id: str | None = None,
    ) -> dict[str, Any]:
        """Charge a previously tokenized card using its tokenKey."""
        return self._request(
            "POST",
            "/v1/checkout/tokenized-card-payment",
            json=payload,
            account_id=account_id,
        )

    def verify_transaction(
        self,
        *,
        order_reference: str | None = None,
        transaction_ref: str | None = None,
        account_id: str | None = None,
    ) -> dict[str, Any]:
        """Verify a checkout transaction by orderReference or transactionRef."""
        params: dict[str, Any] = {}
        if order_reference:
            params["orderReference"] = order_reference
        if transaction_ref:
            params["transactionRef"] = transaction_ref
        return self._request(
            "GET",
            "/v1/transactions/accounts/single",
            params=params or None,
            account_id=account_id,
        )

    def fetch_checkout_transaction(
        self,
        *,
        id_type: str,
        id: str,
        account_id: str | None = None,
    ) -> dict[str, Any]:
        """Fetch full checkout transaction details (production only)."""
        return self._request(
            "GET",
            "/v1/checkout/transaction",
            params={"idType": id_type, "id": id},
            account_id=account_id,
        )

    def fetch_checkout_flash_account_number(
        self,
        order_reference: str,
        *,
        account_id: str | None = None,
    ) -> dict[str, Any]:
        return self._request(
            "GET",
            f"/v1/checkout/get-checkout-kta/{order_reference}",
            account_id=account_id,
        )

    def get_order_details(
        self, order_reference: str, *, account_id: str | None = None
    ) -> dict[str, Any]:
        return self._request(
            "GET",
            f"/v1/checkout/order/{order_reference}",
            account_id=account_id,
        )

    def create_direct_debit(
        self, payload: dict[str, Any], *, account_id: str | None = None
    ) -> dict[str, Any]:
        return self._request(
            "POST",
            "/v1/direct-debits",
            json=payload,
            account_id=account_id,
        )

    def debit_mandate(
        self, payload: dict[str, Any], *, account_id: str | None = None
    ) -> dict[str, Any]:
        return self._request(
            "POST",
            "/v1/direct-debits/debit-mandate",
            json=payload,
            account_id=account_id,
        )

    def check_direct_debit_status(
        self,
        mandate_id: str,
        *,
        account_id: str | None = None,
    ) -> dict[str, Any]:
        return self._request(
            "GET",
            "/v1/direct-debits/status",
            params={"mandateId": mandate_id},
            account_id=account_id,
        )

    def list_direct_debit_mandates(
        self,
        *,
        page: int = 0,
        page_size: int = 20,
        account_id: str | None = None,
        **filters: Any,
    ) -> dict[str, Any]:
        params: dict[str, Any] = {"page": page, "pageSize": page_size, **filters}
        return self._request(
            "GET",
            "/v1/direct-debits/mandates",
            params=params,
            account_id=account_id,
        )

    def update_direct_debit_status(
        self,
        payload: dict[str, Any],
        *,
        account_id: str | None = None,
    ) -> dict[str, Any]:
        return self._request(
            "PUT",
            "/v1/direct-debits/update-status",
            json=payload,
            account_id=account_id,
        )

    def perform_bank_account_lookup(
        self,
        payload: dict[str, Any],
        *,
        account_id: str | None = None,
    ) -> dict[str, Any]:
        return self._request(
            "POST",
            "/v1/transfers/bank/lookup",
            json=payload,
            account_id=account_id,
        )

    def fetch_bank_codes(self, *, account_id: str | None = None) -> dict[str, Any]:
        return self._request(
            "GET",
            "/v1/transfers/banks",
            account_id=account_id,
        )

    def transfer_to_bank(
        self,
        payload: dict[str, Any],
        *,
        sub_account_id: str | None = None,
        account_id: str | None = None,
    ) -> dict[str, Any]:
        path = "/v2/transfers/bank"
        if sub_account_id:
            path = f"{path}/{sub_account_id}"
        return self._request(
            "POST",
            path,
            json=payload,
            account_id=account_id,
        )

    def transfer_between_accounts(
        self,
        payload: dict[str, Any],
        *,
        sub_account_id: str | None = None,
        account_id: str | None = None,
    ) -> dict[str, Any]:
        return self.perform_wallet_transfer_from_parent(
            payload,
            sub_account_id=sub_account_id,
            account_id=account_id,
        )

    def perform_wallet_transfer_from_parent(
        self,
        payload: dict[str, Any],
        *,
        sub_account_id: str | None = None,
        account_id: str | None = None,
    ) -> dict[str, Any]:
        path = "/v2/transfers/wallet"
        if sub_account_id:
            path = f"{path}/{sub_account_id}"
        return self._request(
            "POST",
            path,
            json=payload,
            account_id=account_id,
        )

    def perform_wallet_transfer_from_sub_account(
        self,
        sub_account_id: str,
        payload: dict[str, Any],
        *,
        account_id: str | None = None,
    ) -> dict[str, Any]:
        return self._request(
            "POST",
            f"/v2/transfers/wallet/{sub_account_id}",
            json=payload,
            account_id=account_id,
        )

    def fetch_parent_account_balance(
        self, *, account_id: str | None = None
    ) -> dict[str, Any]:
        return self._request(
            "GET",
            "/v1/accounts/balance",
            account_id=account_id,
        )

    def fetch_parent_account_details(
        self, *, account_id: str | None = None
    ) -> dict[str, Any]:
        return self._request(
            "GET",
            "/v1/accounts/parent",
            account_id=account_id,
        )

    def fetch_sub_account_balance(
        self,
        sub_account_id: str,
        *,
        account_id: str | None = None,
    ) -> dict[str, Any]:
        return self._request(
            "GET",
            f"/v1/accounts/{sub_account_id}/balance",
            account_id=account_id,
        )

    def fetch_sub_account_details(
        self,
        *,
        sub_account_id: str | None = None,
        account_id: str | None = None,
        account_ref: str | None = None,
    ) -> dict[str, Any]:
        params: dict[str, Any] = {}
        if sub_account_id:
            params["accountId"] = sub_account_id
        if account_ref:
            params["accountRef"] = account_ref
        return self._request(
            "GET",
            "/v1/accounts/sub-account-details",
            params=params or None,
            account_id=account_id,
        )

    def _request(
        self,
        method: str,
        path: str,
        *,
        params: dict[str, Any] | None = None,
        json: dict[str, Any] | None = None,
        account_id: str | None = None,
        include_bearer: bool = True,
        include_account_header: bool = True,
        allow_retry: bool = True,
    ) -> dict[str, Any]:
        if include_bearer:
            self._ensure_access_token(account_id=account_id)

        response = self._send_request(
            method,
            path,
            params=params,
            json=json,
            account_id=account_id,
            include_bearer=include_bearer,
            include_account_header=include_account_header,
        )
        if response.status_code == 401 and allow_retry and include_bearer:
            self._refresh_or_reauthenticate(account_id=account_id)
            response = self._send_request(
                method,
                path,
                params=params,
                json=json,
                account_id=account_id,
                include_bearer=include_bearer,
                include_account_header=include_account_header,
            )

        payload = self._parse_response(response)
        if not response.ok:
            message = self._build_error_message(payload, response.status_code)
            raise NombaResponseError(
                message, status_code=response.status_code, payload=payload
            )
        return payload

    def _send_request(
        self,
        method: str,
        path: str,
        *,
        params: dict[str, Any] | None,
        json: dict[str, Any] | None,
        account_id: str | None,
        include_bearer: bool,
        include_account_header: bool,
    ) -> requests.Response:
        headers = self._build_headers(
            account_id=account_id,
            include_bearer=include_bearer,
            include_account_header=include_account_header,
        )
        url = self._build_url(path, params=params)
        return self.session.request(
            method=method,
            url=url,
            headers=headers,
            json=json,
            timeout=self.timeout,
        )

    def _build_url(self, path: str, *, params: dict[str, Any] | None = None) -> str:
        url = f"{self.base_url}/{path.lstrip('/')}"
        if params:
            filtered = [
                (key, value) for key, value in params.items() if value is not None
            ]
            if filtered:
                url = f"{url}?{urlencode(filtered, doseq=True)}"
        return url

    def _build_headers(
        self,
        *,
        account_id: str | None,
        include_bearer: bool,
        include_account_header: bool,
    ) -> dict[str, str]:
        headers: dict[str, str] = {"Accept": "application/json"}
        if include_bearer:
            token = self._ensure_access_token(account_id=account_id)
            headers["Authorization"] = f"Bearer {token}"
        if include_account_header:
            resolved_account_id = account_id or self.account_id
            if not resolved_account_id:
                raise NombaConfigurationError(
                    "account_id is required for this Nomba request."
                )
            headers["accountId"] = resolved_account_id
        return headers

    def _ensure_access_token(self, *, account_id: str | None = None) -> str:
        if self.access_token:
            return self.access_token
        if not self.auto_auth:
            raise NombaConfigurationError(
                "access_token is required when auto_auth is disabled."
            )
        if self.client_id and self.client_secret:
            self.obtain_access_token(account_id=account_id)
        else:
            raise NombaConfigurationError(
                "client_id and client_secret are required to obtain an access token."
            )
        if not self.access_token:
            raise NombaResponseError("Nomba did not return an access token.")
        return self.access_token

    def _refresh_or_reauthenticate(self, *, account_id: str | None = None) -> None:
        if self.access_token and self.refresh_token:
            self.refresh_access_token(account_id=account_id)
            return
        if self.client_id and self.client_secret:
            self.obtain_access_token(account_id=account_id)
            return
        raise NombaConfigurationError(
            "Unable to recover from a 401 response without refresh_token or client credentials."
        )

    def _extract_token_pair(self, response: dict[str, Any]) -> TokenPair:
        data = response.get("data") or {}
        access_token = data.get("access_token")
        if not access_token:
            raise NombaResponseError(
                "Nomba did not return an access token.", payload=response
            )
        return TokenPair(
            access_token=access_token,
            refresh_token=data.get("refresh_token"),
            business_id=data.get("businessId"),
            expires_at=data.get("expiresAt"),
        )

    def _store_token_pair(self, token: TokenPair) -> None:
        self.access_token = token.access_token
        self.refresh_token = token.refresh_token or self.refresh_token

    def _parse_response(self, response: requests.Response) -> dict[str, Any]:
        try:
            payload = response.json()
        except ValueError as exc:
            raise NombaResponseError(
                "Nomba returned a non-JSON response.",
                status_code=response.status_code,
            ) from exc
        if not isinstance(payload, dict):
            raise NombaResponseError(
                "Nomba returned an unexpected response payload.",
                status_code=response.status_code,
                payload=payload,
            )
        return payload

    @staticmethod
    def _build_error_message(payload: dict[str, Any] | Any, status_code: int) -> str:
        if isinstance(payload, dict):
            code = payload.get("code")
            description = payload.get("description") or payload.get("message")
            if code and description:
                return f"Nomba request failed with HTTP {status_code} ({code}): {description}"
            if description:
                return f"Nomba request failed with HTTP {status_code}: {description}"
            if code:
                return f"Nomba request failed with HTTP {status_code} ({code})"
        return f"Nomba request failed with HTTP {status_code}"

    @staticmethod
    def _required(name: str, value: str | None) -> str:
        if not value:
            raise NombaConfigurationError(f"{name} is required for this Nomba request.")
        return value
