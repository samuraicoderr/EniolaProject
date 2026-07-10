import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import AuthScene from "./components/AuthScene";
import { LogoMark } from "./components/AuthUI";
import AuthRedirectClient from "./AuthRedirectClient";
import "./auth.css";

export const metadata: Metadata = {
  title: "Vocab Adventure - Sign In",
  description:
    "Sign in or create your Vocab Adventure account to start learning Yoruba!",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-layout relative flex min-h-screen w-full items-center justify-center overflow-hidden p-4">
      <AuthScene />

      <main className="relative z-10 flex w-full flex-col items-center justify-center py-8">
        <Link
          href="/"
          className="mb-6 block w-fit no-underline transition-transform hover:scale-105 active:scale-95"
          aria-label="Go to Vocab Adventure home"
        >
          <LogoMark />
        </Link>

        <Suspense fallback={null}>
          <AuthRedirectClient />
        </Suspense>

        {children}
      </main>
    </div>
  );
}
