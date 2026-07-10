"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";
import OnboardingProgress from "../components/OnboardingProgress";
import AuthScene from "../components/AuthScene";
import { useRequiredAuth } from "@/lib/api/auth/authContext";
import { Routes } from "@/lib/api/FrontendRoutes";
import { OnboardingStatus } from "@/lib/api/types/auth";
import appConfig from "@/lib/appconfig";

type StepMeta = {
  route: string;
  statusKey: string;
  title: string;
  subtitle: string;
};

const STEP_METADATA: Record<string, StepMeta> = {
  needs_basic_information: {
    route: Routes.auth.onboarding.basicInfo,
    statusKey: "needs_basic_information",
    title: "Tell us about yourself",
    subtitle: "We just need a few basic details to get started.",
  },
  needs_password: {
    route: Routes.auth.onboarding.password,
    statusKey: "needs_password",
    title: "Create a password",
    subtitle: "Choose a secure password for your account.",
  },
  needs_email_verification: {
    route: Routes.auth.onboarding.verifyEmail,
    statusKey: "needs_email_verification",
    title: "Verify your email",
    subtitle: "Enter the 6-digit code we sent to your inbox.",
  },
  needs_phone_verification: {
    route: Routes.auth.onboarding.verifyPhone,
    statusKey: "needs_phone_verification",
    title: "Verify your phone",
    subtitle: "Enter the code we sent to your phone.",
  },
  needs_profile_username: {
    route: Routes.auth.onboarding.username,
    statusKey: "needs_profile_username",
    title: "Choose a username",
    subtitle: "This is how other people will find you.",
  },
  needs_profile_picture: {
    route: Routes.auth.onboarding.profilePicture,
    statusKey: "needs_profile_picture",
    title: "Add a profile picture",
    subtitle: "A photo helps your profile feel more personal.",
  },

  completed: {
    route: Routes.auth.onboarding.complete,
    statusKey: "completed",
    title: "You're all set",
    subtitle: `Welcome to ${appConfig.appName}.`,
  },
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { onboardingToken, user, partialUser, isLoading } = useRequiredAuth(
    Routes.auth.login,
    { allowOnboarding: true },
  );
  const hasRedirected = useRef(false);

  const stepConfig = useMemo(() => {
    const flow = partialUser?.onboarding_flow || [];
    const validSteps = flow.filter((status) => STEP_METADATA[status]);
    return validSteps.map((status) => STEP_METADATA[status]);
  }, [partialUser?.onboarding_flow]);

  const activeStepIndex = useMemo(() => {
    const routeIndex = stepConfig.findIndex((step) => step.route === pathname);
    if (routeIndex >= 0) return routeIndex;

    if (!partialUser?.onboarding_status) return 0;

    const index = stepConfig.findIndex(
      (step) => step.statusKey === partialUser.onboarding_status,
    );

    return index >= 0 ? index : 0;
  }, [partialUser, stepConfig, pathname]);

  const totalSteps = stepConfig.length;
  const activeStep = stepConfig[activeStepIndex];

  useEffect(() => {
    if (isLoading || hasRedirected.current) return;

    const hasIdentity = Boolean(
      onboardingToken ||
      partialUser?.onboarding_token ||
      partialUser?.email ||
      user?.email,
    );

    if (!hasIdentity) {
      hasRedirected.current = true;
      router.replace(Routes.auth.login);
      return;
    }

    if (user?.onboarding_status === OnboardingStatus.COMPLETED) {
      hasRedirected.current = true;
      router.replace(Routes.home);
      return;
    }

    const isValidStep = stepConfig.some((step) => step.route === pathname);

    if (!isValidStep && activeStep) {
      hasRedirected.current = true;
      router.replace(activeStep.route);
    }
  }, [
    isLoading,
    onboardingToken,
    partialUser,
    user,
    pathname,
    activeStep,
    stepConfig,
    router,
  ]);

  if (isLoading || !partialUser || !activeStep) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-center text-[#FFFBF0]">
          <p className="text-lg font-bold">Preparing your adventure...</p>
        </div>
      </div>
    );
  }

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex <= activeStepIndex) {
      const targetStep = stepConfig[stepIndex];
      if (targetStep) {
        router.replace(targetStep.route);
      }
    }
  };

  return (
    <div className="auth-layout relative flex min-h-screen w-full items-center justify-center overflow-hidden p-4">
      <AuthScene />

      <main className="relative z-10 flex w-full flex-col items-center justify-center py-8">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="relative w-full max-w-[520px] rounded-[2rem] border-[5px] border-[#D4A017] bg-[rgba(255,251,240,0.97)] p-6 shadow-[0_14px_0_#A06808,0_24px_48px_rgba(0,0,0,0.22)] sm:p-8"
          style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
        >
          <div className="absolute left-4 right-4 top-0 h-2 rounded-b-full bg-[repeating-linear-gradient(90deg,#1B3A8C_0px,#1B3A8C_10px,#D4A017_10px,#D4A017_20px)]" />

          <div className="pt-4" aria-live="polite">
            <OnboardingProgress
              currentStep={activeStepIndex}
              totalSteps={totalSteps}
              steps={stepConfig}
              onStepClick={handleStepClick}
            />

            <header className="mb-5 mt-5">
              <h1 className="text-2xl font-bold text-[#1B3A8C] sm:text-3xl">
                {activeStep.title}
              </h1>
              <p className="mt-1 text-sm font-semibold text-[#5A4A2A]">
                {activeStep.subtitle}
              </p>
            </header>

            <main>{children}</main>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
