/**
 * Sub Backend API Routes
 * Mirrors the actual Django backend URL structure at api/v1/.
 * All routes are prefixed with /api/v1.
 */

const API_VERSION = "/api/v1";

export const BackendRoutes = {
  // ── Auth (AuthRouterViewSet + SecurityViewSet) ─────────────
  auth: {
    login: `${API_VERSION}/auth/login/`,
    refresh: `${API_VERSION}/auth/login/refresh_token/`,
    register: `${API_VERSION}/auth/register/`,
    checkUsername: `${API_VERSION}/auth/check_username/`,
    joinWaitlist: `${API_VERSION}/auth/join_waitlist/`,
  },

  // ── Users (UserViewSet) ────────────────────────────────────
  users: {
    me: `${API_VERSION}/users/me/`,
    updateMe: `${API_VERSION}/users/update_me/`,
    deleteMe: `${API_VERSION}/users/delete_me/`,
  },

  // ── Security (SecurityViewSet) ─────────────────────────────
  security: {
    changePassword: `${API_VERSION}/security/password/`,
    sendForgotPasswordOtp: `${API_VERSION}/security/password/send_forgot_password_otp/`,
    resetForgotPassword: `${API_VERSION}/security/password/reset_forgot_password/`,
  },

  // ── Onboarding (AuthRouterViewSet actions) ─────────────────
  getOnboardingToken: `${API_VERSION}/auth/onboarding/get_onboarding_token/`,
  onboardingGetUserData: `${API_VERSION}/auth/onboarding/get_user_data/`,
  onboardingExchangeTokens: `${API_VERSION}/auth/onboarding/exchange_onboarding_tokens_for_login_tokens/`,
  onboardingSetUserBasicInfo: `${API_VERSION}/auth/onboarding/set_user_basic_info/`,
  onboardingSetPassword: `${API_VERSION}/auth/onboarding/set_password/`,
  onboardingSetUsername: `${API_VERSION}/auth/onboarding/set_username/`,
  onboardingSetProfilePicture: `${API_VERSION}/auth/onboarding/set_profile_picture/`,
  onboardingSendEmailOtp: `${API_VERSION}/auth/onboarding/email/send_email_verification_otp/`,
  onboardingCheckEmailOtp: `${API_VERSION}/auth/onboarding/email/check_email_verification_otp/`,

  // ── OAuth (OAuthViewSet) ───────────────────────────────────
  oauthGetProviders: `${API_VERSION}/oauth/get_providers/`,
  oauthAuthorizeCode: (provider: string) =>
    `${API_VERSION}/oauth/${provider}/login-or-register/`,
  oauthLoginOrRegister: (provider: string) =>
    `${API_VERSION}/oauth/${provider}/login-or-register/`,

  // ── Notifications (NotificationViewSet) ────────────────────
  notifications: `${API_VERSION}/notifications/`,
  notificationsUnreadCount: `${API_VERSION}/notifications/unread-count/`,
  notificationMarkRead: (id: string) =>
    `${API_VERSION}/notifications/${id}/read/`,
  notificationsMarkAllRead: `${API_VERSION}/notifications/mark-all-read/`,

  // ── Top-level aliases (used by service files) ──────────────
  checkUsername: `${API_VERSION}/auth/check_username/`,
  me: `${API_VERSION}/users/me/`,
} as const;

export default BackendRoutes;
