import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { HeroPanel, LogoMark } from "./components/AuthUI";
import AuthRedirectClient from "./AuthRedirectClient";

export const metadata: Metadata = {
  title: "Sub - Sign In",
  description: "Sign in or create your Sub account to manage your writing workflow.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-white">
      <HeroPanel />

      <main className="flex min-h-screen w-full flex-col items-center justify-center bg-white px-6 py-12 lg:w-[55%] xl:w-[58%]">
        <div className="w-full max-w-[400px]">
          <Suspense fallback={null}>
            <AuthRedirectClient />
          </Suspense>
          <Link
            href="/"
            className="mx-auto mb-12 block w-fit no-underline"
            aria-label="Go to Sub home"
          >
            <LogoMark />
          </Link>
          {children}
        </div>
      </main>
    </div>
  );
}
