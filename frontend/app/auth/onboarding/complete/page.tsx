"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { InlineAlert, PrimaryButton } from "../../components/AuthUI";
import { useAuth } from "@/lib/api/auth/authContext";
import { Routes } from "@/lib/api/FrontendRoutes";
import {
  interpretServerError,
  isInvalidOrExpiredOnboardingTokenError,
} from "@/lib/utils";
import { storeAuthRedirectMessage } from "@/lib/api/auth/redirect";

export default function CompletePage() {
  const router = useRouter();
  const {
    onboardingToken,
    exchangeOnboardingTokenForAuth,
    setOnboardingToken,
  } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const completeOnboarding = async () => {
      if (!onboardingToken) {
        router.replace(Routes.auth.login);
        return;
      }

      try {
        await exchangeOnboardingTokenForAuth(onboardingToken);
        router.replace(Routes.home);
      } catch (err) {
        if (isInvalidOrExpiredOnboardingTokenError(err)) {
          setOnboardingToken(null);
          storeAuthRedirectMessage(
            "Your onboarding session expired. Please sign in again.",
          );
          router.replace(Routes.auth.login);
          return;
        }

        const details = interpretServerError(err);
        setError(
          details[0] ||
            "Failed to complete onboarding. Please try logging in manually.",
        );
        setLoading(false);
      }
    };

    completeOnboarding();
  }, [
    onboardingToken,
    exchangeOnboardingTokenForAuth,
    router,
    setOnboardingToken,
  ]);

  const goHome = () => {
    router.replace(Routes.home);
  };

  if (loading) {
    return (
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mx-auto mb-4 text-5xl"
        >
          ⭐
        </motion.div>
        <h2
          className="mb-2 text-2xl font-bold text-[#1B3A8C]"
          style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
        >
          Getting ready...
        </h2>
        <p className="mb-6 text-sm font-semibold text-[#5A4A2A]">
          Setting up your account
        </p>
        <PrimaryButton label="Loading..." disabled loading />
      </div>
    );
  }

  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#2DC653] text-4xl shadow-lg"
      >
        🎉
      </motion.div>
      <h2
        className="mb-2 text-2xl font-bold text-[#1B3A8C]"
        style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
      >
        Welcome to Vocab Adventure!
      </h2>
      <p className="mb-6 text-sm font-semibold text-[#5A4A2A]">
        Your account is ready. Let&apos;s start learning!
      </p>
      {error && <InlineAlert message={error} />}
      <PrimaryButton label="Get started" type="button" onClick={goHome} />
    </div>
  );
}
