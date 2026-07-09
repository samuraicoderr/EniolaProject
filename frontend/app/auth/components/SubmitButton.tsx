"use client";

import React from "react";

interface SubmitButtonProps {
  label: string;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "outline";
}

export default function SubmitButton({
  label,
  loading,
  disabled,
  onClick,
  type = "submit",
  variant = "primary",
}: SubmitButtonProps) {
  const className =
    variant === "primary"
      ? "flex h-[48px] w-full items-center justify-center gap-2 rounded-full bg-primary text-[15px] font-medium text-white shadow-sm transition-all duration-300 hover:bg-[primary-bold] hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
      : variant === "secondary"
        ? "flex h-[48px] w-full items-center justify-center gap-2 rounded-full bg-gray-100 text-[15px] font-medium text-gray-700 transition-all duration-300 hover:bg-gray-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
        : "flex h-[48px] w-full items-center justify-center gap-2 rounded-full border border-gray-200 bg-white text-[15px] font-medium text-gray-700 transition-all duration-300 hover:bg-gray-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70";

  return (
    <button
      type={type}
      className={className}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && (
        <div
          className={`h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent ${variant === "primary" ? "text-white" : "text-primary"}`}
          aria-hidden="true"
        />
      )}
      {label}
    </button>
  );
}
