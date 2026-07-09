from django.conf import settings
from django.http import HttpResponseBadRequest
from django.shortcuts import render
from django.urls import reverse
from django_rest_passwordreset.serializers import (
    EmailSerializer,
    PasswordTokenSerializer,
    ResetTokenSerializer,
)
from django_rest_passwordreset.views import (
    ResetPasswordConfirmViewSet,
    ResetPasswordRequestTokenViewSet,
    ResetPasswordValidateTokenViewSet,
)
from drf_spectacular.utils import extend_schema
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.routers import SimpleRouter

from src.lib.django.views_mixin import ViewSetHelperMixin


@extend_schema(tags=["auth"])
class MyResetPasswordRequestTokenViewSet(
    ViewSetHelperMixin, ResetPasswordRequestTokenViewSet
):
    """
    Handles POST /password/reset/

    🔹 What it does:
        - Accepts email
        - Generates reset token
        - Emits reset_password_token_created signal

    🔹 Where to customize:
        - Override `create()` to:
            • Add rate limiting
            • Add audit logging
            • Customize response payload
            • Block inactive users
    """

    serializers = {
        "default": EmailSerializer,
        "create": EmailSerializer,
    }
    permissions = {
        "default": [AllowAny],
    }

    def create(self, request, *args, **kwargs):
        # Example extension point:
        # email = request.data.get("email")
        # Add custom validation or logging here

        response = super().create(request, *args, **kwargs)

        # Modify response if needed
        # response.data["custom"] = "extra data"

        return response


@extend_schema(tags=["auth"])
class MyResetPasswordValidateTokenViewSet(
    ViewSetHelperMixin, ResetPasswordValidateTokenViewSet
):
    """
    Handles POST /password/reset/validate_token/

    🔹 What it does:
        - Checks if token exists
        - Checks if token expired
        - Returns validity response

    🔹 Where to customize:
        - Override `create()` to:
            • Add custom expiration logic
            • Add attempt tracking
            • Add logging
    """

    serializers = {
        "default": ResetTokenSerializer,
        "create": ResetTokenSerializer,
    }
    permissions = {
        "default": [AllowAny],
    }

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)


@extend_schema(tags=["auth"])
class MyResetPasswordConfirmViewSet(ViewSetHelperMixin, ResetPasswordConfirmViewSet):
    """
    Handles:

        POST /password/reset/confirm/
        GET  /password/reset/confirm/?token=xxx

    🔹 POST:
        - Accepts token + new password
        - Validates token
        - Updates password

    🔹 GET:
        - Renders password reset HTML page

    🔹 Where to customize:
        - Override `create()` for custom password validation
        - Override `update()` if needed
        - Override `get()` for frontend rendering behavior
    """

    serializers = {
        "default": PasswordTokenSerializer,
        "create": PasswordTokenSerializer,
        "update": PasswordTokenSerializer,
        "partial_update": PasswordTokenSerializer,
    }
    permissions = {
        "default": [AllowAny],
    }

    template_name = "users/auth/password_reset_confirm.html"  # sub/src/users/templates/users/auth/password_reset_confirm.html

    def create(self, request, *args, **kwargs):
        """
        Override this if you want:
            • Stronger password rules
            • Extra logging
            • Notify user after password change
            • Invalidate all sessions
        """
        return super().create(request, *args, **kwargs)

    @action(detail=False, methods=["get"], url_path="")
    def render_reset_page(self, request):
        """
        Custom GET handler for browser-based reset flow.

        This does NOT affect API behavior.
        """

        token = request.GET.get("token")
        if not token:
            return HttpResponseBadRequest("Missing token")

        extra_context = {
            "app": settings.APP_DEFAULT_CONTEXT,
            "company": settings.COMPANY_DEFAULT_CONTEXT,
            "social": settings.SOCIAL_DEFAULT_CONTEXT,
        }

        return render(
            request,
            self.template_name,
            {
                "token": token,
                # Router-based reverse (correct way)
                "api_endpoint": f"{reverse('password_reset:reset-password-confirm-list')}?token={token}",
                **extra_context,
            },
        )


password_reset_router = SimpleRouter()

password_reset_router.register(
    r"reset", MyResetPasswordRequestTokenViewSet, basename="reset-password-request"
)

password_reset_router.register(
    r"reset/validate_token",
    MyResetPasswordValidateTokenViewSet,
    basename="reset-password-validate",
)

password_reset_router.register(
    r"reset/confirm", MyResetPasswordConfirmViewSet, basename="reset-password-confirm"
)
