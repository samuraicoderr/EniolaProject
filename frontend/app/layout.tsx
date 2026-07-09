import type { Metadata } from "next";
import { AuthProviderClient } from "@/lib/api/auth/AuthProviderClient";
import "./globals.css";
import { fontVariables } from "./fontstuff";

export const metadata: Metadata = {
  title: "Sub - Subscription billing",
  description: "Sub is a subscription billing and management platform.",
};

import { ThemeProvider } from "next-themes";

import NextTopLoader from 'nextjs-toploader';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scrollbar-hide" suppressHydrationWarning>
      <body className={`scrollbar-hide ${fontVariables} antialiased`}>
        <NextTopLoader color="#c5f045" showSpinner={false} height={3} />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProviderClient>
            {children}
          </AuthProviderClient>
        </ThemeProvider>
      </body>
    </html>
  );
}
