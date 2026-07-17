import logging

from django.conf import settings
from django.db import transaction
from django.db.models import Q
from django.http import HttpResponse

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.exceptions import (
    AuthenticationFailed,
    NotFound,
    PermissionDenied,
    ValidationError,
)
from rest_framework.parsers import FileUploadParser, FormParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.throttling import UserRateThrottle

from drf_spectacular.utils import extend_schema

from src.lib.django.errors import DeprecatedError
from src.common.serializers import EmptySerializer
from src.lib.django.views_mixin import ViewSetHelperMixin
from src.lib.utils.uuid7 import uuid7
from src.notifications.Notifier import NotifyUser
from src.users.models import User, RecoveryCode, WaitList
from src.users.permissions import IsVerifiedUser
from src.users.serializers import (
    AuthLoginSerializer,
    BarcodeStuffSerializer,
    MFAChallengeSerializer,
    MFAPushDeviceSerializer,
    MFATotpSetupSerializer,
    MFATotpVerifySerializer,
    MFAVerifySerializer,
    MFAWebAuthnSetupSerializer,
    MFAWebAuthnVerifySerializer,

    CheckUsernameSerializer,
    CreateUserSerializer,
    EmailOrPhoneSerializer,
    EmailVerificationSerializer,
    GetOboardingTokenSerializer,
    Onboarding,
    PhoneVerificationSerializer,
    PasswordResetSerializer,
    ResetForgottenPasswordSerializer,
    ResetPasswordAndSendEmailSerializer,
    ResetRecoveryCodesSerializer,
    TFA_OtpSerializer,
    TFA_Serializer,
    UpdateUserSerializer,
    UserSerializer,
    WaitListSerializer,
)
from src.users.password import PasswordValidator
from src.users.auth import _jwt_response, _mfa_required_response, _onboarding_required_response
from src.users.auth import response_tokens

from src.users.mfa_services import (
    begin_challenge,
    get_available_methods,
    get_session_from_token,
    register_push_device,
    setup_totp,
    setup_webauthn,
    verify_challenge,
    verify_totp_setup,
)
from src.users.services import OtpType, UserService
from src.users.utils import (
    WaitlistSpreadSheet,
    generate_qrcode,
    generate_signed_token,
    verify_signed_token,
)





logger = logging.getLogger("app")


RESERVED_KEYWORDS = [
    # users can't have these usernames
    "new",
]

# ─────────────────────────────────────────────
# THROTTLES
# ─────────────────────────────────────────────

class OtpRateThrottle(UserRateThrottle):
    rate = "3/min"


class NormalThrottle(UserRateThrottle):
    rate = "50/min"

# ─────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────

def _get_client_ip(request) -> str | None:
    """Extract the real client IP, respecting reverse-proxy headers."""
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        return x_forwarded_for.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")


def _resolve_user_from_onboarding_token(token: str) -> User:
    """
    Verify an onboarding token and return the corresponding User.
    Raises ValidationError or NotFound on failure.
    """
    user_id = User.verify_onboarding_token(
        token, max_age=User.ONBOARDING_TOKEN_MAX_AGE
    )
    if not user_id:
        raise ValidationError({"error": "invalid or expired onboarding token"})
    user = User.objects.filter(id=user_id).first()
    if user is None:
        raise NotFound({"error": "user not found"})
    return user


# ─────────────────────────────────────────────
# AUTH VIEWSET
# ─────────────────────────────────────────────

class AuthRouterViewSet(ViewSetHelperMixin, viewsets.GenericViewSet):
    """
    Handles registration, onboarding, OTP flows, password management,
    2FA setup, and recovery code management.
    """

    serializers = {
        "default": UserSerializer,          # was CreateUserSerializer — wrong
        "login": AuthLoginSerializer,
        "register": CreateUserSerializer,
        "update_me": UpdateUserSerializer,


        "password_reset": PasswordResetSerializer,
        "forgot_password": ResetPasswordAndSendEmailSerializer,
        "send_forgot_password_otp": EmailOrPhoneSerializer,
        "reset_forgot_password": ResetForgottenPasswordSerializer,
        "send_email_verification_otp": EmailVerificationSerializer,
        "check_email_verification_otp": EmailVerificationSerializer,
        "send_phone_verification_otp": PhoneVerificationSerializer,
        "check_phone_verification_otp": PhoneVerificationSerializer,
        "send_2fa_otp": TFA_Serializer,
        "check_2fa_otp": TFA_OtpSerializer,
        "reset_recovery_codes": ResetRecoveryCodesSerializer,
        "request_qr_code": BarcodeStuffSerializer,
        "health": EmptySerializer,
        "mfa_challenge": MFAChallengeSerializer,
        "mfa_verify": MFAVerifySerializer,
        "mfa_setup_totp": MFATotpSetupSerializer,
        "mfa_verify_totp": MFATotpVerifySerializer,
        "mfa_setup_webauthn": MFAWebAuthnSetupSerializer,
        "mfa_verify_webauthn": MFAWebAuthnVerifySerializer,
        "mfa_register_push_device": MFAPushDeviceSerializer,
        "get_onboarding_token": GetOboardingTokenSerializer,
        "exchange_onboarding_tokens_for_login_tokens": Onboarding.UseOnboardingTokenSerializer,
        "set_user_basic_info": Onboarding.ChangeBasicInfoSerializer,
        "set_password": Onboarding.ChangePasswordSerializer,
        "set_username": Onboarding.ChangeUserNameSerializer,
        "set_profile_picture": Onboarding.ChangeProfilePictureSerializer,
        "get_onboarding_user_data": Onboarding.UseOnboardingTokenSerializer,
        "join_waitlist": WaitListSerializer,      # was missing
        "check_username": Onboarding.CheckUserNameSerializer,
        "qr_image_for_2fa": EmptySerializer,      # GET with no body
    }

    permissions = {
        "default": [IsVerifiedUser],
        "login": (AllowAny,),
        "mfa_challenge": (AllowAny,),
        "mfa_verify": (AllowAny,),
        "mfa_setup_totp": (IsAuthenticated,),
        "mfa_verify_totp": (IsAuthenticated,),
        "mfa_setup_webauthn": (IsAuthenticated,),
        "mfa_verify_webauthn": (AllowAny,),
        "mfa_register_push_device": (IsAuthenticated,),
        "qr_image_for_2fa": (AllowAny,),
        "forgot_password": (AllowAny,),
        "register": (AllowAny,),
        "send_email_verification_otp": (AllowAny,),
        "check_email_verification_otp": (AllowAny,),
        "send_phone_verification_otp": (AllowAny,),
        "check_phone_verification_otp": (AllowAny,),
        "send_2fa_otp": (AllowAny,),
        "check_2fa_otp": (IsAuthenticated,),
        "health": (AllowAny,),
        "join_waitlist": (AllowAny,),

        "send_forgot_password_otp": (AllowAny,),
        "reset_forgot_password": (AllowAny,),
        "get_onboarding_token": (AllowAny,),
        "exchange_onboarding_tokens_for_login_tokens": (AllowAny,),
        "set_username": (AllowAny,),
        "set_user_basic_info": (AllowAny,),
        "set_profile_picture": (AllowAny,),
        "check_username": (AllowAny,),
        "set_password": (AllowAny,),
        "get_onboarding_user_data": (AllowAny,),
    }

    # ── Waitlist ──────────────────────────────

# trottle this endponit
    @action(detail=False, methods=["post"], throttle_classes=[NormalThrottle])
    def check_username(self, request):
        """Check if a username is available during onboarding. Returns availability status for the requested username."""
        serializer = self.get_serializer_class()(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = _resolve_user_from_onboarding_token(
            serializer.validated_data["onboarding_token"]
        )
        username = serializer.validated_data["username"].strip()
        if not username:
            return Response({"error": "username cannot be blank"}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.exclude(pk=user.pk).filter(username=username).exists() or username.lower() in RESERVED_KEYWORDS:
            return Response({"available": False, "username": username}, status=status.HTTP_200_OK)
        return Response({"available": True, "username": username}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["post"], url_path="join_waitlist")
    def join_waitlist(self, request):
        """Add an email to the waitlist. Sends confirmation email and appends to spreadsheet."""
        serializer = WaitListSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]

        if WaitList.objects.filter(email=email).exists():
            return Response(
                {"message": "already_joined"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        WaitList.objects.create(
            email=email,
            ip_address=_get_client_ip(request),
        )

        try:
            WaitlistSpreadSheet.append_to_waitlist(email)
        except Exception:
            logger.exception("Failed to append %s to waitlist spreadsheet", email)

        try:
            NotifyUser.send_waitlist_confirmation(email=email)
        except Exception:
            logger.exception("Failed to send waitlist confirmation email to %s", email)

        return Response({"message": "success"}, status=status.HTTP_201_CREATED)

    # ── MFA Core ─────────────────────────────

    @action(detail=False, methods=["post"], url_path="login")
    def login(self, request):
        """Authenticate user with email and password. Returns JWT tokens if credentials are valid. Triggers MFA flow if enabled."""
        serializer = self.get_serializer_class()(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"].strip().lower()
        password = serializer.validated_data["password"]
        user = User.objects.filter(email__iexact=email).first()
        if not user or not user.check_password(password):
            raise AuthenticationFailed("No active account found with the given credentials")

        return response_tokens(user, request=request)
    
    @action(detail=False, methods=["post"])
    def register(self, request):
        """Register a new user account with email and password. Validates password strength and starts onboarding flow."""
        serializer = CreateUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated = serializer.validated_data
        raw_password = validated["password"]

        if User.objects.filter(email=validated["email"]).exists():
            return Response(
                {"error": "a user with this email already exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        pv = PasswordValidator(raw_password)
        if not pv.run_check():
            return Response(
                {"password": pv.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            user = User(
                **validated,
                username=f"user_{uuid7().hex}",
                is_email_verified=False,
                is_phone_number_verified=False,
            )
            user.is_email_verified = True
            user.set_password(raw_password)
            user.save()
            # Advance from NEEDS_BASIC_INFORMATION → NEEDS_EMAIL_VERIFICATION
            user.advance_onboarding(
                from_step=User.OnboardingStatus.NEEDS_BASIC_INFORMATION
            )

        try:
            NotifyUser(user).send_welcome_to_user()
        except Exception:
            logger.exception("Failed to send welcome email to user %s", user.id)

        return Response(
            CreateUserSerializer(user).data,
            status=status.HTTP_201_CREATED,
        )

    @action(
        detail=False,
        methods=["post"],
        throttle_classes=[OtpRateThrottle],
        url_path="mfa/challenge",
    )
    def mfa_challenge(self, request):
        """Initiate MFA challenge after login. Returns challenge data for the selected MFA method (TOTP, push, or WebAuthn)."""
        serializer = self.get_serializer_class()(data=request.data)
        serializer.is_valid(raise_exception=True)

        session = get_session_from_token(
            token=serializer.validated_data["mfa_session_token"],
            request=request,
        )
        payload = begin_challenge(session=session, method=serializer.validated_data["selected_method"])
        return Response(payload, status=status.HTTP_200_OK)

    @action(
        detail=False,
        methods=["post"],
        throttle_classes=[OtpRateThrottle],
        url_path="mfa/verify",
    )
    def mfa_verify(self, request):
        """Verify MFA challenge response. Returns JWT tokens on successful verification."""
        serializer = self.get_serializer_class()(data=request.data)
        serializer.is_valid(raise_exception=True)

        session = get_session_from_token(
            token=serializer.validated_data["mfa_session_token"],
            request=request,
        )

        selected_method = serializer.validated_data["selected_method"]
        payload = {
            "otp": serializer.validated_data.get("otp"),
            "approval_code": serializer.validated_data.get("approval_code"),
            "challenge": serializer.validated_data.get("challenge"),
            "assertion": serializer.validated_data.get("assertion"),
        }

        is_valid = verify_challenge(session=session, method=selected_method, payload=payload)
        if not is_valid:
            raise AuthenticationFailed("Invalid MFA response", code="invalid_mfa_response")

        return _jwt_response(session.user)

    @action(detail=False, methods=["get"], url_path="mfa/methods")
    def mfa_methods(self, request):
        """List available MFA methods for the authenticated user (TOTP, push, WebAuthn)."""
        methods = get_available_methods(request.user)
        return Response({"available_methods": methods}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["post"], url_path="mfa/setup/totp")
    def mfa_setup_totp(self, request):
        """Begin TOTP (authenticator app) setup. Returns provisioning URI for QR code scanning. Requires password confirmation."""
        serializer = self.get_serializer_class()(data=request.data)
        serializer.is_valid(raise_exception=True)

        if not request.user.check_password(serializer.validated_data["password"]):
            raise ValidationError({"error": "wrong password"})

        payload = setup_totp(request.user)
        return Response(payload, status=status.HTTP_200_OK)

    @action(detail=False, methods=["post"], url_path="mfa/verify/totp")
    def mfa_verify_totp(self, request):
        """Verify TOTP code to complete authenticator app setup. Enables MFA on success."""
        serializer = self.get_serializer_class()(data=request.data)
        serializer.is_valid(raise_exception=True)

        is_valid = verify_totp_setup(request.user, serializer.validated_data["otp"])
        if not is_valid:
            raise ValidationError({"otp": "invalid otp"})

        return Response({"message": "totp verified", "mfa_is_enabled": request.user.mfa_is_enabled}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["post"], url_path="mfa/setup/webauthn")
    def mfa_setup_webauthn(self, request):
        """Register a WebAuthn (hardware key/biometric) credential for MFA."""
        serializer = self.get_serializer_class()(data=request.data)
        serializer.is_valid(raise_exception=True)

        method = setup_webauthn(
            request.user,
            credential_id=serializer.validated_data["credential_id"],
            public_key=serializer.validated_data["public_key"],
            sign_count=serializer.validated_data.get("sign_count", 0),
        )
        request.user.mfa_is_enabled = True
        request.user.save(update_fields=["mfa_is_enabled"])
        return Response({"message": "webauthn configured", "method_id": str(method.id)}, status=status.HTTP_200_OK)

    @action(
        detail=False,
        methods=["post"],
        throttle_classes=[OtpRateThrottle],
        url_path="mfa/verify/webauthn",
    )
    def mfa_verify_webauthn(self, request):
        """Verify WebAuthn assertion during MFA challenge. Returns JWT tokens on success."""
        serializer = self.get_serializer_class()(data=request.data)
        serializer.is_valid(raise_exception=True)

        session = get_session_from_token(
            token=serializer.validated_data["mfa_session_token"],
            request=request,
        )
        is_valid = verify_challenge(
            session=session,
            method="webauthn",
            payload={
                "challenge": serializer.validated_data["challenge"],
                "assertion": serializer.validated_data["assertion"],
            },
        )
        if not is_valid:
            raise AuthenticationFailed("Invalid WebAuthn assertion")

        return _jwt_response(session.user)

    @action(detail=False, methods=["post"], url_path="mfa/push/register-device")
    def mfa_register_push_device(self, request):
        """Register a device for push notification MFA challenges. Used for approve/deny login prompts."""
        serializer = self.get_serializer_class()(data=request.data)
        serializer.is_valid(raise_exception=True)

        device = register_push_device(
            user=request.user,
            token=serializer.validated_data["token"],
            platform=serializer.validated_data["platform"],
        )
        return Response(
            {
                "message": "push device registered",
                "device_id": str(device.id),
                "is_active": device.is_active,
            },
            status=status.HTTP_201_CREATED,
        )

    # ── MFA Auth App QR code ───────────────────────────

    @action(detail=False, methods=["get"], url_path="mfa/authapp/qr-image/(?P<token>.*)")
    def authapp_qrimage(self, request, token):
        """Render QR code PNG for TOTP setup. Use the signed token from request_authapp_qr_code endpoint."""
        user_id = verify_signed_token(token, max_age=300)
        if not user_id:
            raise NotFound({"error": "QR code expired or invalid"})
        user = User.objects.filter(id=user_id).first()
        if not user:
            raise NotFound({"error": "user not found"})

        buffer = generate_qrcode(user.get_authenticator_uri()).getvalue()
        return HttpResponse(buffer, content_type="image/png")

    @action(detail=False, methods=["post"], url_path="mfa/authapp/request_qr_code")
    def request_authapp_qr_code(self, request):
        """Get signed QR code URL and otpauth URI for TOTP setup. Requires password confirmation. Use qrcode_uri to render QR on frontend."""
        serializer = self.get_serializer_class()(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        if not user.check_password(serializer.validated_data["password"]):
            raise ValidationError({"error": "wrong password"})

        # Token for the image-serving endpoint only — not a TFA/onboarding token.
        token = generate_signed_token(str(user.id))
        image_url = request.build_absolute_uri(
            reverse("auth-authapp-qrimage", kwargs={"token": token})
        )

        return Response(
            {
                "image_url": image_url,
                "qrcode_uri": user.get_authenticator_uri(),
            },
            status=status.HTTP_200_OK,
        )

    # ── Onboarding ────────────────────────────

    @action(detail=False, methods=["post"], url_path="onboarding/get_onboarding_token")
    def get_onboarding_token(self, request):
        """Get onboarding token to continue incomplete onboarding flow. Requires email and password. Token is short-lived."""
        serializer = self.get_serializer_class()(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        user = User.objects.filter(email__iexact=email).first()
        if user is None:
            raise NotFound({"error": "user with this email does not exist"})
        if not user.check_password(password):
            raise ValidationError({"error": "invalid password"})
        if user.is_onboarding_completed():
            raise ValidationError({"error": "onboarding_already_completed"})

        return _onboarding_required_response(user)

    @action(detail=False, methods=["post"], url_path="onboarding/get_user_data")
    def get_onboarding_user_data(self, request):
        """Fetch user's current onboarding data and status. Use to pre-fill onboarding forms."""
        serializer = self.get_serializer_class()(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = _resolve_user_from_onboarding_token(
            serializer.validated_data["onboarding_token"]
        )

        if user.is_onboarding_completed():
            raise ValidationError({"error": "onboarding_already_completed"})

        return Response(
            CreateUserSerializer(user, context={"request": request}).data,
            status=status.HTTP_200_OK,
        )

    @action(detail=False, methods=["post"], url_path="onboarding/exchange_onboarding_tokens_for_login_tokens")
    def exchange_onboarding_tokens_for_login_tokens(self, request):
        """Exchange completed onboarding token for JWT auth tokens. Call this after finishing all onboarding steps."""
        # Since a user with completed onboarding process can't generate another onboarding token this is safish
        # but once we once we return the real deal we shouldn't do it again.
        serializer = self.get_serializer_class()(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = _resolve_user_from_onboarding_token(
            serializer.validated_data["onboarding_token"]
        )

        if not user.is_onboarding_completed():
            raise ValidationError({"error": "onboarding_already_completed"})

        return response_tokens(user, request=request, skip_mfa=True)

    @action(detail=False, methods=["post"], url_path="onboarding/set_user_basic_info")
    def set_user_basic_info(self, request):
        """Set basic user info during onboarding (name, password). Used for OAuth signups where provider didn't return full info."""
        serializer = self.get_serializer_class()(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = _resolve_user_from_onboarding_token(
            serializer.validated_data["onboarding_token"]
        )

        if user.is_onboarding_completed():
            raise ValidationError({"error": "onboarding_already_completed"})
        if user.is_future_step(User.OnboardingStatus.NEEDS_BASIC_INFORMATION):
            raise ValidationError({"error": "user has not yet reached the basic information step"})

        with transaction.atomic():
            user.first_name = serializer.validated_data["first_name"]
            user.last_name = serializer.validated_data["last_name"]
            password = serializer.validated_data.get("password")
            if password:
                user.set_password(password)
            user.advance_onboarding(
                from_step=User.OnboardingStatus.NEEDS_BASIC_INFORMATION,
                to_commit=False,
            )
            user.save()

        return Response(
            CreateUserSerializer(user, context={"request": request}).data,
            status=status.HTTP_200_OK,
        )

    @action(detail=False, methods=["post"], url_path="onboarding/set_password")
    def set_password(self, request):
        """Set password during onboarding. Use when user info is already known and only password is needed."""

        serializer = self.get_serializer_class()(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = _resolve_user_from_onboarding_token(
            serializer.validated_data["onboarding_token"]
        )

        if user.is_onboarding_completed():
            raise ValidationError({"error": "onboarding_already_completed"})
        if user.is_future_step(User.OnboardingStatus.NEEDS_PASSWORD):
            raise ValidationError({"error": "user has not yet reached the password step"})

        with transaction.atomic():
            password = serializer.validated_data["password"]
            if password:
                user.set_password(password)
                user.advance_onboarding(
                    from_step=User.OnboardingStatus.NEEDS_PASSWORD,
                    to_commit=False,
                )
                user.save()

        return Response(
            CreateUserSerializer(user, context={"request": request}).data,
            status=status.HTTP_200_OK,
        )
    
    @action(detail=False, methods=["post"], url_path="onboarding/set_username")
    def set_username(self, request):
        """Set username during onboarding. Validates uniqueness. Auto-generates if not provided."""
        serializer = self.get_serializer_class()(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = _resolve_user_from_onboarding_token(
            serializer.validated_data["onboarding_token"]
        )

        if user.is_onboarding_completed():
            raise ValidationError({"error": "onboarding_already_completed"})
        if user.is_future_step(User.OnboardingStatus.NEEDS_PROFILE_USERNAME):
            raise ValidationError({"error": "user has not yet reached the username step"})

        new_username = serializer.validated_data.get("new_username", None).strip() or None
        if not new_username:
            if user.username:
                new_username = user.username
            else:
                new_username = f"user_{uuid7().hex[:8]}"
        if User.objects.exclude(pk=user.pk).filter(username=new_username).exists():
            raise ValidationError({"error": "this username is already taken"})

        with transaction.atomic():
            if user.username != new_username:
                user.username = new_username
            user.advance_onboarding(from_step=User.OnboardingStatus.NEEDS_PROFILE_USERNAME, to_commit=False)
            user.save()

        return Response(
            CreateUserSerializer(user, context={"request": request}).data,
            status=status.HTTP_200_OK,
        )

    @extend_schema(
        request=Onboarding.ChangeProfilePictureSerializer,
        responses={200: CreateUserSerializer},
    )
    @action(
        detail=False,
        methods=["post"],
        url_path="onboarding/set_profile_picture",
        parser_classes=[MultiPartParser, FormParser, FileUploadParser],
    )
    def set_profile_picture(self, request):
        """Upload profile picture during onboarding. Accepts multipart form data."""
        serializer = self.get_serializer_class()(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = _resolve_user_from_onboarding_token(
            serializer.validated_data["onboarding_token"]
        )

        if user.is_onboarding_completed():
            raise ValidationError({"error": "onboarding_already_completed"})
        if user.is_future_step(User.OnboardingStatus.NEEDS_PROFILE_PICTURE):
            raise ValidationError({"error": "user has not yet reached the profile picture step"})

        with transaction.atomic():
            user.profile_picture = serializer.validated_data["profile_picture"]
            user.save(update_fields=["profile_picture"])
            user.advance_onboarding(from_step=User.OnboardingStatus.NEEDS_PROFILE_PICTURE, to_commit=False)
            user.save()

        return Response(
            CreateUserSerializer(user, context={"request": request}).data,
            status=status.HTTP_200_OK,
        )

    # ── Onboarding Email OTP ─────────────────────────────

    @action(
        detail=False,
        methods=["post"],
        throttle_classes=[OtpRateThrottle],
        url_path="onboarding/email/send_email_verification_otp",
    )
    def send_email_verification_otp(self, request):
        """Send OTP to user's email for verification. Required during onboarding. Rate limited."""
        serializer = EmailVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = User.objects.filter(email=serializer.validated_data["email"]).first()
        if user is None:
            raise NotFound({"error": "user with this email does not exist"})
        if user.is_email_verified:
            raise ValidationError({"error": "email is already verified"})
        if user.is_future_step(User.OnboardingStatus.NEEDS_EMAIL_VERIFICATION):
            raise ValidationError({"error": "user has not yet reached the email verification step"})

        UserService.send_user_otp(user, otp_type=OtpType.EMAIL_VERIFICATION)
        return Response({"message": "OTP sent to your email"}, status=status.HTTP_200_OK)

    @action(
        detail=False,
        methods=["post"],
        throttle_classes=[OtpRateThrottle],
        url_path="onboarding/email/check_email_verification_otp",
    )
    def check_email_verification_otp(self, request):
        """Verify email OTP. Marks email as verified and advances onboarding on success."""
        serializer = EmailVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        otp = serializer.validated_data.get("otp")
        if not otp:
            raise ValidationError({"error": "OTP is required"})

        user = User.objects.filter(email=serializer.validated_data["email"]).first()
        if user is None:
            raise NotFound({"error": "user with this email does not exist"})
        if user.is_email_verified:
            raise ValidationError({"error": "email is already verified"})
        if user.is_future_step(User.OnboardingStatus.NEEDS_EMAIL_VERIFICATION):
            raise ValidationError({"error": "user has not yet reached the email verification step"})

        # verify_otp raises ValidationError on failure — let it propagate.
        UserService.verify_user_otp(user, otp, otp_type=OtpType.EMAIL_VERIFICATION)

        # Reload to reflect state changes made inside verify_otp/set_otp.
        user.refresh_from_db()
        with transaction.atomic():
            user.advance_onboarding(from_step=User.OnboardingStatus.NEEDS_EMAIL_VERIFICATION, to_commit=False)
            user.save()

        return Response(
            {
                "message": "email verified",
                **_onboarding_required_response(user, include_token=False),
            },
            status=status.HTTP_200_OK,
        )

    # ── Onboarding Phone OTP ─────────────────────────────

    @action(
        detail=False,
        methods=["post"],
        throttle_classes=[OtpRateThrottle],
        url_path="onboarding/phone/send_phone_verification_otp",
    )
    def send_phone_verification_otp(self, request):
        """Send OTP to user's phone for verification. Required during onboarding. Rate limited."""
        serializer = PhoneVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        phone_number = serializer.validated_data["phone_number"]
        user = User.objects.filter(phone_number=phone_number).first()
        if user is None:
            raise NotFound({"error": "user with this phone number does not exist"})
        if user.is_phone_number_verified:
            raise ValidationError({"error": "phone number is already verified"})
        if user.is_future_step(User.OnboardingStatus.NEEDS_PHONE_VERIFICATION):
            raise ValidationError({"error": "user has not yet reached the phone verification step"})

        UserService.send_user_otp(user, otp_type=OtpType.PHONE_VERIFICATION)
        return Response({"message": "OTP sent to your phone number"}, status=status.HTTP_200_OK)

    @action(
        detail=False,
        methods=["post"],
        throttle_classes=[OtpRateThrottle],
        url_path="onboarding/phone/check_phone_verification_otp",
    )
    def check_phone_verification_otp(self, request):
        """Verify phone OTP. Marks phone as verified and advances onboarding on success."""
        serializer = PhoneVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        otp = serializer.validated_data.get("otp")
        if not otp:
            raise ValidationError({"error": "OTP is required"})

        phone_number = serializer.validated_data["phone_number"]
        user = User.objects.filter(phone_number=phone_number).first()
        if user is None:
            raise NotFound({"error": "user with this phone number does not exist"})
        if user.is_phone_number_verified:
            raise ValidationError({"error": "phone number is already verified"})
        if user.is_future_step(User.OnboardingStatus.NEEDS_PHONE_VERIFICATION):
            raise ValidationError({"error": "user has not yet reached the phone verification step"})

        UserService.verify_user_otp(user, otp, otp_type=OtpType.PHONE_VERIFICATION)

        user.refresh_from_db()
        with transaction.atomic():
            user.advance_onboarding(from_step=User.OnboardingStatus.NEEDS_PHONE_VERIFICATION, to_commit=False)
            user.save()

        return Response(
            {
                "message": "phone number verified",
                **(_onboarding_required_response(user, include_token=False).data),
            },
            status=status.HTTP_200_OK,
        )



class SecurityViewSet(ViewSetHelperMixin, viewsets.GenericViewSet):

    serializers = {
        "default": UserSerializer,          # was CreateUserSerializer — wrong
        "password_reset": PasswordResetSerializer,
        "send_forgot_password_otp": EmailOrPhoneSerializer,
        "reset_forgot_password": ResetForgottenPasswordSerializer,
        "reset_recovery_codes": ResetRecoveryCodesSerializer,
    }

    permissions = {
        "default": [IsVerifiedUser],
        "send_forgot_password_otp": (AllowAny,),
        "reset_forgot_password": (AllowAny,),
    }


    # ── Password ──────────────────────────────

    @action(detail=False, methods=["put"], url_path="password")
    def password_reset(self, request):
        """Change password for authenticated user. Requires current password for verification. Validates password strength."""
        serializer = self.get_serializer_class()(data=request.data)
        serializer.is_valid(raise_exception=True)

        new_password = serializer.validated_data["new_password"]
        confirm_new = serializer.validated_data["repeat_new_password"]
        old_password = serializer.validated_data["old_password"]

        if new_password != confirm_new:
            raise ValidationError({"error": "new password and confirmation do not match"})

        user = request.user
        if not user.check_password(old_password):
            raise ValidationError({"error": "invalid current password"})

        pv = PasswordValidator(new_password)
        if not pv.run_check():
            return Response({"password": pv.errors}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save(update_fields=["password"])
        return Response({"message": "password changed successfully"}, status=status.HTTP_200_OK)

    @action(
        detail=False,
        methods=["put"],
        throttle_classes=[OtpRateThrottle],
        url_path="password/send_forgot_password_otp",
    )
    def send_forgot_password_otp(self, request):
        """Send password reset OTP to email or phone. Always returns 200 for security (doesn't leak account existence)."""
        serializer = self.get_serializer_class()(data=request.data)
        serializer.is_valid(raise_exception=True)

        identifier = serializer.validated_data["email_or_phone_number"]
        value, preferred_channel = identifier["value"], identifier["type"]

        user = User.objects.filter(
            Q(email=value) | Q(phone_number=value)
        ).first()

        if user:
            try:
                UserService.send_user_otp(
                    user,
                    otp_type=OtpType.PASSWORD_RESET,
                    preferred_channel=preferred_channel,
                )
            except Exception:
                logger.exception("Failed to send password reset OTP for user %s", user.id)
        else:
            # Intentionally silent — do not reveal whether the account exists.
            logger.info("Password reset OTP requested for unknown identifier (not logged for privacy)")

        return Response({"message": "if an account exists, a reset code has been sent"}, status=status.HTTP_200_OK)

    @action(
        detail=False,
        methods=["put"],
        throttle_classes=[OtpRateThrottle],
        url_path="password/reset_forgot_password",
    )
    def reset_forgot_password(self, request):
        """Reset password using OTP sent to email or phone. Validates OTP and password strength."""
        serializer = self.get_serializer_class()(data=request.data)
        serializer.is_valid(raise_exception=True)

        value = serializer.validated_data["email_or_phone_number"]["value"]
        otp = serializer.validated_data["otp"]
        password = serializer.validated_data["password"]
        repeat_password = serializer.validated_data["repeat_password"]

        if password != repeat_password:
            raise ValidationError({
                "error": "password and confirmation do not match",
                "code": "password_mismatch",
            })

        pv = PasswordValidator(password)
        if not pv.run_check():
            return Response({"password": pv.errors}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            user = (
                User.objects.select_for_update()
                .filter(Q(email=value) | Q(phone_number=value))
                .first()
            )
            if not user:
                raise ValidationError({"error": "account not found"})

            # verify_otp raises ValidationError on failure — let it propagate.
            UserService.verify_user_otp(user, otp, otp_type=OtpType.PASSWORD_RESET)

            user.set_password(password)
            user.save(update_fields=["password"])

        return Response({"message": "password reset successfully"}, status=status.HTTP_200_OK)

    # ── Recovery codes ────────────────────────

    @action(detail=False, methods=["post"], url_path="2fa/reset_recovery_codes")
    def reset_recovery_codes(self, request):
        """Regenerate recovery codes for MFA backup. Requires password confirmation. Codes are only shown once - save them securely."""
        serializer = self.get_serializer_class()(data=request.data)
        serializer.is_valid(raise_exception=True)

        if not request.user.check_password(serializer.validated_data["password"]):
            raise ValidationError({"error": "invalid password"})

        code_list = UserService.reset_recovery_codes(request.user)
        return Response({"recovery_codes": code_list}, status=status.HTTP_201_CREATED)
