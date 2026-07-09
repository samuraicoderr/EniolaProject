"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Variants } from "motion/react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import appConfig from "@/lib/appconfig";

const heroSlides = [
  {
    title: "Build Recurring Billing Infrastructure",
    body: "Launch subscription-based products faster with a complete billing engine for plans, pricing, recurring charges, invoices, and payment lifecycle management.",
  },
  {
    title: "Manage Subscriptions Effortlessly",
    body: "Create flexible billing plans, support monthly or annual cycles, handle upgrades, downgrades, proration, and keep every subscription state synchronized.",
  },
  {
    title: "Recover Failed Payments Automatically",
    body: "Reduce revenue loss with intelligent dunning workflows, automated retries, payment recovery strategies, and real-time billing status tracking.",
  },
  {
    title: "Developer-First Payment Infrastructure",
    body: "Integrate powerful subscription APIs, tokenized payments, webhooks, and scalable billing workflows without rebuilding complex payment systems from scratch.",
  },
];

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.08 },
  },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 360, damping: 30 },
  },
};

export function HeroPanel({ className = "" }: { className?: string }) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <aside
      className={`relative hidden min-h-screen w-[45%] flex-col justify-between overflow-hidden bg-primary lg:flex xl:w-[42%] ${className}`}
      aria-label="Sub product highlights"
    >
      <Image
        src={appConfig.backgrounds.bg}
        alt=""
        fill
        className="object-cover"
        priority
        sizes="(min-width: 1280px) 42vw, (min-width: 1024px) 45vw, 0vw"
      />
      <div className="absolute inset-0 bg-primary/50 mix-blend-multiply" />

      <div className="relative z-10 flex flex-1 items-center justify-center px-12">
        <div className="invisible relative h-[420px] w-[340px]" aria-hidden="true">
          <div className="absolute inset-0 rounded-3xl bg-white/10 backdrop-blur-sm" />
          <Image
            src={appConfig.backgrounds.bg1}
            alt=""
            fill
            className="rounded-3xl object-cover opacity-80"
            sizes="340px"
          />
        </div>
      </div>

      <div className="relative z-10 px-10 pb-14 xl:px-12 xl:pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <h2 className="mb-3 text-[28px] font-medium leading-tight text-white">
              {heroSlides[activeSlide].title}
            </h2>
            <p className="max-w-[360px] text-[15px] leading-relaxed text-white/90">
              {heroSlides[activeSlide].body}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex items-center gap-2">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              onClick={() => setActiveSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
                activeSlide === index ? "w-8 bg-white" : "w-2.5 bg-white/40"
              }`}
              aria-label={`Show slide ${index + 1}: ${slide.title}`}
              aria-current={activeSlide === index}
            />
          ))}
        </div>
      </div>
    </aside>
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
    <motion.div variants={itemVariants} className="w-full space-y-1.5">
      <label
        htmlFor={inputId}
        className="block text-[13px] font-normal text-primary"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          className={`h-11 w-full rounded-none border-0 border-b bg-transparent px-0 text-[16px] text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:ring-0 disabled:cursor-not-allowed disabled:text-gray-400 ${
            rightElement ? "pr-10" : ""
          } ${
            error
              ? "border-rose-400 focus:border-rose-500"
              : "border-gray-300 focus:border-primary"
          } ${className}`}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={errorId}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
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
            className="text-xs text-rose-600"
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
      className="text-primary transition-colors hover:text-[primary-bold] disabled:cursor-not-allowed disabled:opacity-60"
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
}: {
  label: string;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}) {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      variants={itemVariants}
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className="mt-4 flex h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#c5f045] text-[15px] font-bold text-slate-900 shadow-sm transition-all duration-300 hover:bg-[#b0d938] hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {loading ? (
        <>
          <Loader2 size={18} className="animate-spin" aria-hidden="true" />
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
      className={`flex h-[44px] w-full items-center justify-center gap-3 rounded-full border border-gray-200 bg-white text-[14px] font-medium text-gray-700 transition-all duration-300 hover:bg-gray-50 hover:shadow-sm active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
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
      ? "border-emerald-100 bg-emerald-50 text-emerald-700"
      : tone === "info"
        ? "border-slate-200 bg-slate-50 text-slate-700"
        : "border-rose-100 bg-rose-50 text-rose-700";

  return (
    <motion.div
      variants={itemVariants}
      className={`rounded-lg border px-3 py-2 text-sm ${toneClass}`}
      role={tone === "error" ? "alert" : "status"}
    >
      {message}
    </motion.div>
  );
}

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center gap-3 rounded-full px-5 py-2 transition-all duration-300 hover:gap-4 hover:bg-primary/10 ${className}`}
    >
      <Image
        src={appConfig.logos.hue}
        alt=""
        width={48}
        height={48}
        className="h-12 w-12 object-contain"
        priority
      />
      <span className="cook-font text-[42px] font-normal tracking-normal text-primary">
        {appConfig.appName}
      </span>
    </div>
  );
}
