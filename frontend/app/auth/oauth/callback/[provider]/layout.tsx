import { OAuthProviders } from "@/lib/api/types/auth";

export function generateStaticParams() {
  return Object.values(OAuthProviders).map((provider) => ({
    provider,
  }));
}

export default function OAuthCallbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
