/**
 * Frontend Route Definitions
 * Centralized route management for Yoruba Learning App
 */

export const FrontendRoutes = {
  home: "/",

  // Auth routes
  auth: {
    login: "/auth/login",
    mfa: "/auth/login/mfa",
    register: "/auth/register",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    oauthCallback: (provider: string) => `/auth/oauth/callback/${provider}`,
    onboarding: {
      root: "/auth/onboarding",
      basicInfo: "/auth/onboarding/basic-info",
      password: "/auth/onboarding/password",
      verifyEmail: "/auth/onboarding/verify-email",
      verifyPhone: "/auth/onboarding/phone-verification",
      username: "/auth/onboarding/username",
      profilePicture: "/auth/onboarding/profile-picture",
      complete: "/auth/onboarding/complete",
    },
  },
} as const;

export const Routes = FrontendRoutes;

export default FrontendRoutes;
