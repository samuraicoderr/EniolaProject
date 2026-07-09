"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface AuthInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  autoComplete?: string;
  rightElement?: React.ReactNode;
  required?: boolean;
}

export default function AuthInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  disabled,
  autoComplete,
  rightElement,
  required,
  className,
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";
  const inputType = isPasswordField && showPassword ? "text" : type;

  return (
    <div className="w-full space-y-1.5">
      <label htmlFor={id} className="block text-[13px] font-normal text-primary">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </label>

      <div className="relative">
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`h-11 w-full rounded-none border-0 border-b bg-transparent px-0 text-[16px] text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:ring-0 disabled:cursor-not-allowed disabled:text-gray-400 ${
            error ? "border-rose-400 focus:border-rose-500" : "border-gray-300 focus:border-primary"
          } ${isPasswordField || rightElement ? "pr-10" : ""} ${className || ""}`}
          disabled={disabled}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? `${id}-error` : undefined}
        />

        {isPasswordField && !disabled && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-primary transition-colors hover:text-[primary-bold]"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}

        {rightElement && !isPasswordField && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>

      {error && (
        <p id={`${id}-error`} className="text-xs text-rose-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
