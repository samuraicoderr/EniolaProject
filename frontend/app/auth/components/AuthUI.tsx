"use client";

import React from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Variants } from "motion/react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 320, damping: 22 },
  },
};

export function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="relative w-full max-w-[460px] rounded-[2rem] border-[5px] border-[#D4A017] bg-[rgba(255,251,240,0.97)] p-6 shadow-[0_14px_0_#A06808,0_24px_48px_rgba(0,0,0,0.22)] sm:p-8"
      style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
    >
      {/* Decorative top stripe */}
      <div className="absolute left-4 right-4 top-0 h-2 rounded-b-full bg-[repeating-linear-gradient(90deg,#1B3A8C_0px,#1B3A8C_10px,#D4A017_10px,#D4A017_20px)]" />
      <div className="pt-2">{children}</div>
    </motion.div>
  );
}

export function InputField({
  label,
  error,
  rightElement,
  className = "",
  id,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  rightElement?: React.ReactNode;
}) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <motion.div variants={itemVariants} className="w-full space-y-2">
      <label
        htmlFor={inputId}
        className="block text-sm font-semibold tracking-wide text-[#1B3A8C]"
        style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          className={`h-12 w-full rounded-2xl border-[3px] bg-white px-4 text-base text-[#1B2520] outline-none transition-all placeholder:text-[#A0A0A0] focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60 ${
            rightElement ? "pr-12" : ""
          } ${
            error
              ? "border-[#E63946] focus:border-[#E63946]"
              : "border-[#D4A017] focus:border-[#1B3A8C]"
          } ${className}`}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={errorId}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            id={errorId}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-xs font-medium text-[#E63946]"
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function PasswordToggle({
  shown,
  onToggle,
  disabled,
}: {
  shown: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="rounded-full p-1.5 text-[#1B3A8C] transition-all hover:bg-[#1B3A8C]/10 disabled:cursor-not-allowed disabled:opacity-50"
      aria-label={shown ? "Hide password" : "Show password"}
      disabled={disabled}
    >
      {shown ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );
}

export function PrimaryButton({
  label,
  loading,
  disabled,
  type = "button",
  onClick,
  className = "",
}: {
  label: string;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
}) {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      variants={itemVariants}
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      whileHover={isDisabled ? undefined : { y: -2, scale: 1.01 }}
      whileTap={isDisabled ? undefined : { y: 2, scale: 0.98 }}
      className={`mt-2 flex h-[52px] w-full items-center justify-center gap-2 rounded-full border-[3px] border-[#122870] bg-[#1B3A8C] text-base font-bold text-[#FFFBF0] shadow-[0_6px_0_#0D1E56,0_10px_20px_rgba(0,0,0,0.18)] transition-all disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
      style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
    >
      {loading ? (
        <>
          <Loader2 size={20} className="animate-spin" aria-hidden="true" />
          <span>Working...</span>
        </>
      ) : (
        <span>{label}</span>
      )}
    </motion.button>
  );
}

export function GhostButton({
  label,
  icon,
  onClick,
  disabled,
  type = "button",
  className = "",
}: {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
}) {
  return (
    <motion.button
      variants={itemVariants}
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { y: -1 }}
      whileTap={disabled ? undefined : { y: 1 }}
      className={`flex h-[48px] w-full items-center justify-center gap-3 rounded-full border-[3px] border-[#D4A017] bg-white text-sm font-semibold text-[#1B3A8C] shadow-[0_4px_0_#A06808,0_8px_16px_rgba(0,0,0,0.1)] transition-all disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  );
}

export function InlineAlert({
  tone = "error",
  message,
}: {
  tone?: "error" | "success" | "info";
  message: string;
}) {
  const toneClass =
    tone === "success"
      ? "border-[#2DC653] bg-[#E8FCEF] text-[#1A6820]"
      : tone === "info"
        ? "border-[#4361EE] bg-[#EDF1FF] text-[#1B3A8C]"
        : "border-[#E63946] bg-[#FFF0F0] text-[#B22A2A]";

  return (
    <motion.div
      variants={itemVariants}
      className={`rounded-2xl border-[3px] px-4 py-3 text-sm font-medium ${toneClass}`}
      role={tone === "error" ? "alert" : "status"}
      style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
    >
      {message}
    </motion.div>
  );
}

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center justify-center gap-2 rounded-full border-[3px] border-[#D4A017] bg-[#FFFBF0] px-5 py-2.5 shadow-[0_5px_0_#A06808] ${className}`}
      style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
    >
      <span className="text-2xl">🌍</span>
      <span className="text-xl font-bold text-[#1B3A8C]">Vocab Adventure</span>
    </div>
  );
}

export function AuthHeading({ children }: { children: React.ReactNode }) {
  return (
    <h1
      className="text-center text-2xl font-bold text-[#1B3A8C] sm:text-3xl"
      style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
    >
      {children}
    </h1>
  );
}

export function AuthSubheading({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-center text-sm font-medium text-[#5A4A2A]"
      style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
    >
      {children}
    </p>
  );
}
