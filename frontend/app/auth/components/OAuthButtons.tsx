"use client";

import React, { useState } from "react";
import { OAuthProviders, type OAuthProviderType } from "@/lib/api/types/auth";
import OAuthService from "@/lib/api/services/OAuth.Service";
import {
  AppleIcon,
  GitHubIcon,
  GoogleIcon,
  TwitterIcon,
} from "./AuthComponents";
import { GhostButton } from "./AuthUI";

interface OAuthButtonsProps {
  mode: "login" | "register";
  onError?: (message: string) => void;
  onSuccess?: (data: { provider: OAuthProviderType; mode: OAuthButtonsProps["mode"] }) => void;
}

interface ProviderConfig {
  key: OAuthProviderType;
  label: string;
  icon: React.ReactNode;
  primary?: boolean;
}

const PROVIDERS: ProviderConfig[] = [
  {
    key: OAuthProviders.GOOGLE,
    label: "Continue with Google",
    icon: <GoogleIcon />,
    primary: true,
  },
  {
    key: OAuthProviders.GITHUB,
    label: "GitHub",
    icon: <GitHubIcon />,
  },
  {
    key: OAuthProviders.APPLE,
    label: "Apple",
    icon: <AppleIcon />,
  },
  {
    key: OAuthProviders.TWITTER,
    label: "Twitter",
    icon: <TwitterIcon />,
  },
];

export default function OAuthButtons({ mode, onError, onSuccess }: OAuthButtonsProps) {
  const [loadingProvider, setLoadingProvider] = useState<OAuthProviderType | null>(null);

  const startOAuth = (provider: OAuthProviderType) => {
    setLoadingProvider(provider);

    const redirectUri = OAuthService.getRedirectUri(provider, window.location.origin);
    const authUrl = OAuthService.getOAuthUrl(provider, redirectUri);

    if (!authUrl) {
      setLoadingProvider(null);
      onError?.(`OAuth for ${provider} is not configured yet.`);
      return;
    }

    // Store which provider we're using so we know on return
    sessionStorage.setItem("oauth_provider", provider);
    onSuccess?.({ provider, mode });

    // Redirect to Google/GitHub/etc.
    window.location.assign(authUrl);
  };

  const google = PROVIDERS.find((provider) => provider.key === OAuthProviders.GOOGLE);
  const secondaryProviders = PROVIDERS.filter(
    (provider) =>
      provider.key !== OAuthProviders.GOOGLE && OAuthService.isProviderConfigured(provider.key)
  );

  return (
    <div className="space-y-3">
      {google && (
        <GhostButton
          label={loadingProvider === google.key ? "Connecting..." : `${mode === "login" ? "Sign in" : "Sign up"} with Google`}
          icon={google.icon}
          onClick={() => startOAuth(google.key)}
          disabled={!OAuthService.isProviderConfigured(google.key) || loadingProvider !== null}
        />
      )}

      {secondaryProviders.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {secondaryProviders.map((provider) => (
            <button
              key={provider.key}
              type="button"
              onClick={() => startOAuth(provider.key)}
              disabled={loadingProvider !== null}
              className="flex h-11 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-all duration-300 hover:bg-gray-50 hover:text-gray-800 hover:shadow-sm active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={`${mode === "login" ? "Sign in" : "Sign up"} with ${provider.label}`}
              title={provider.label}
            >
              {provider.icon}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
