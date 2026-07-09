"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/api/auth/authContext";
import { Routes, FrontendRoutes } from "@/lib/api/FrontendRoutes";
import { getSafeNextPath } from "@/lib/api/auth/redirect";

export default function AuthRedirectClient() {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (auth.isLoading) return;

    // Don't redirect for onboarding flows
    if (pathname?.startsWith("/auth/onboarding")) return;

    if (auth.isAuthenticated) {
      const next = searchParams?.get("next") || undefined;
      const to = getSafeNextPath(next, FrontendRoutes.home);
      router.replace(to);
    }
  }, [auth.isAuthenticated, auth.isLoading, pathname, router, searchParams]);

  return null;
}
