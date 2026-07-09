"use client";

import React, { useMemo, useState } from "react";
import { useAuth } from "@/lib/api/auth/authContext"; // Changed from useRequiredAuth to be more flexible
import type { UserType } from "@/lib/api/types/auth";

const DEFAULT_PROFILE_PICTURE = "/default_user.webp";

type ImageSize = "original" | "thumbnail" | "medium_square_crop" | "small_square_crop";

type SmartAvatarProps = {
  url?: string;
  name?: string;
  user?: UserType; // Added this prop
  charsToUseFromName?: 1 | 2;
  useSignedInUser?: boolean;
  size?: number;
  className?: string;
  preferredImageSize?: ImageSize;
};

function resolveProfilePicture(
  profile_picture: UserType["profile_picture"],
  picture_url: string | null,
  preferredImageSize?: ImageSize
): string | null {
  if (!profile_picture && !picture_url) return null;

  if (typeof profile_picture === "string") {
    return profile_picture;
  }

  if (
    profile_picture &&
    typeof profile_picture === "object" &&
    "medium_square_crop" in profile_picture
  ) {
    if (preferredImageSize && preferredImageSize in profile_picture) {
      const preferred = profile_picture[preferredImageSize as keyof typeof profile_picture];
      if (preferred) return preferred;
    }

    return (
      profile_picture.medium_square_crop ||
      profile_picture.small_square_crop ||
      profile_picture.original ||
      null
    );
  }

  if (picture_url) return picture_url;
  return null;
}

export const SmartAvatar: React.FC<SmartAvatarProps> = ({
  url,
  name,
  user: providedUser,
  charsToUseFromName = 1,
  useSignedInUser = false,
  size = 40,
  className = "",
  preferredImageSize,
}) => {
  // Use useAuth instead of useRequiredAuth so this component doesn't 
  // force a redirect if we are just viewing another user's profile.
  const { user: signedInUser } = useAuth(); 
  const [imgError, setImgError] = useState(false);

  // Determine which user object to source data from
  const targetUser = useMemo(() => {
    if (providedUser) return providedUser;
    if (useSignedInUser) return signedInUser;
    return null;
  }, [providedUser, useSignedInUser, signedInUser]);

  const resolvedName = useMemo(() => {
    if (name) return name;
    if (targetUser) {
      return `${targetUser.first_name ?? ""} ${targetUser.last_name ?? ""}`.trim();
    }
    return "";
  }, [name, targetUser]);

  const initials = useMemo(() => {
    if (!resolvedName) return "";
    const parts = resolvedName.trim().split(/\s+/);
    if (charsToUseFromName === 1) {
      return parts[0]?.[0]?.toUpperCase() ?? "";
    }
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
  }, [resolvedName, charsToUseFromName]);

  const resolvedUrl = useMemo(() => {
    if (url) return url;
    if (targetUser) {
      return resolveProfilePicture(
        targetUser.profile_picture,
        targetUser.picture_url,
        preferredImageSize
      );
    }
    return null;
  }, [url, targetUser, preferredImageSize]);

  const finalImageSrc = resolvedUrl && !imgError ? resolvedUrl : DEFAULT_PROFILE_PICTURE;
  const showImage = !!resolvedUrl;

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden bg-gray-200 text-gray-700 font-medium select-none ${className}`}
      style={{ width: size, height: size }}
      aria-label={resolvedName || "User avatar"}
    >
      {showImage ? (
        <img
          src={finalImageSrc}
          alt={resolvedName || "User avatar"}
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span
          className="flex items-center justify-center w-full h-full"
          style={{ fontSize: size * 0.4 }}
        >
          {initials}
        </span>
      )}
    </div>
  );
};