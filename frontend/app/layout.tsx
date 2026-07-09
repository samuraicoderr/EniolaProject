import type { Metadata } from "next";
import { AuthProviderClient } from "@/lib/api/auth/AuthProviderClient";
import "./globals.css";
import { fontVariables } from "./fontstuff";

export const metadata: Metadata = {
  title: "Toddler Vocab Adventure - Learn Yoruba!",
  description: "Learn Yoruba through interactive games, video lessons, and chat with Eniola, the Yoruba Coach!",
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
        <NextTopLoader color="#E2A030" showSpinner={false} height={3} />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProviderClient>
            {children}
          </AuthProviderClient>
        </ThemeProvider>
      </body>
    </html>
  );
}
