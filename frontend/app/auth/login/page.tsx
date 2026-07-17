"use client";

import Link from "next/link";
import React, { Suspense, useState } from "react";
import { motion } from "motion/react";
import AuthDivider from "../components/AuthDivider";
import OAuthButtons from "../components/OAuthButtons";
import {
  AuthCard,
  AuthHeading,
  AuthSubheading,
  InlineAlert,
  InputField,
  PasswordToggle,
  PrimaryButton,
  containerVariants,
  itemVariants,
} from "../components/AuthUI";
import { useAuth } from "@/lib/api/auth/authContext";
import { Routes } from "@/lib/api/FrontendRoutes";
import { interpretServerError } from "@/lib/utils";
import { AuthService } from "@/lib/api/services/AuthService";
import { useLoginSuccess } from "../hooks/useLoginSuccess";
import { OAuthLoginResponse } from "@/lib/api/types/auth";
import { consumeAuthRedirectMessage } from "@/lib/api/auth/redirect";

interface FormErrors {
  email?: string;
  password?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginPageContent() {
  const { isLoading, clearError, error } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formMessage, setFormMessage] = useState<string | null>(() =>
    consumeAuthRedirectMessage(),
  );
  const [loginResponse, setLoginResponse] = useState<OAuthLoginResponse | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isBusy = isSubmitting || isLoading;

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!EMAIL_RE.test(email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  useLoginSuccess(loginResponse);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormMessage(null);
    clearError();

    if (!validate()) return;

    try {
      setIsSubmitting(true);
      const response = await AuthService.login({
        email: email.trim(),
        password,
      });
      setLoginResponse(response);
    } catch (err) {
      console.error("Login error:", err);
      const serverErrors = interpretServerError(err);
      const fallback = error?.message || "Unable to sign in. Please try again.";
      setFormMessage(serverErrors[0] || fallback);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-5"
      >
        <motion.div variants={itemVariants} className="space-y-2">
          <AuthHeading>Welcome back! 🎉</AuthHeading>
          <AuthSubheading>
            Sign in to continue your Yoruba learning adventure.
          </AuthSubheading>
        </motion.div>

        {formMessage && <InlineAlert message={formMessage} />}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            autoComplete="email"
            error={formErrors.email}
            disabled={isBusy}
          />

          <InputField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            error={formErrors.password}
            disabled={isBusy}
            rightElement={
              <PasswordToggle
                shown={showPassword}
                onToggle={() => setShowPassword((prev) => !prev)}
                disabled={isBusy}
              />
            }
          />

          <div className="flex justify-end">
            <Link
              className="text-xs font-semibold text-[#1B3A8C] underline-offset-4 transition-colors hover:text-[#122870] hover:underline"
              href={Routes.auth.forgotPassword}
              style={{
                fontFamily: "var(--font-fredoka), system-ui, sans-serif",
              }}
            >
              Forgot password?
            </Link>
          </div>

          <PrimaryButton
            label="Sign in"
            loading={isBusy}
            disabled={isBusy}
            type="submit"
          />
        </form>

        {/* <AuthDivider text="or" />
        <OAuthButtons
          mode="login"
          onError={(message) => setFormMessage(message)}
        /> */}
        <motion.p
          variants={itemVariants}
          className="text-center text-sm font-medium text-[#5A4A2A]"
          style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
        >
          New here?{" "}
          <Link
            href={Routes.auth.register}
            className="font-bold text-[#1B3A8C] underline underline-offset-4 transition-colors hover:text-[#122870]"
          >
            Create Account
          </Link>
        </motion.p>
      </motion.div>
    </AuthCard>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={<div className="text-[#FFFBF0]">Loading sign in...</div>}
    >
      <LoginPageContent />
    </Suspense>
  );
}
