"use client";

import React from "react";

interface StepMeta {
  route: string;
  statusKey: string;
  title: string;
  subtitle: string;
}

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  steps?: StepMeta[];
  onStepClick?: (stepIndex: number) => void;
}

export default function OnboardingProgress({
  currentStep,
  totalSteps,
  steps = [],
  onStepClick,
}: OnboardingProgressProps) {
  const safeTotal = Math.max(1, totalSteps);
  const safeStep = Math.min(Math.max(0, currentStep), safeTotal - 1);
  const progress = Math.round(((safeStep + 1) / safeTotal) * 100);

  return (
    <div className="w-full">
      <div
        className="flex items-center justify-between text-xs font-bold text-[#5A4A2A]"
        style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
      >
        <span>
          Step {safeStep + 1} of {safeTotal}
        </span>
        <span className="text-[#1B3A8C]">{progress}% complete</span>
      </div>

      <div
        className="mt-3 flex items-center gap-2"
        role="progressbar"
        aria-valuenow={safeStep + 1}
        aria-valuemin={1}
        aria-valuemax={safeTotal}
      >
        {Array.from({ length: safeTotal }, (_, i) => {
          const step = steps[i];
          const isCompleted = i < safeStep;
          const isActive = i === safeStep;
          const isClickable = Boolean(onStepClick && i <= safeStep);

          return (
            <button
              key={step?.statusKey || i}
              type="button"
              onClick={() => isClickable && onStepClick?.(i)}
              disabled={!isClickable}
              className={`h-3 flex-1 rounded-full border-2 border-[#D4A017] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3A8C]/30 ${
                isCompleted
                  ? "bg-[#2DC653]"
                  : isActive
                    ? "bg-[#1B3A8C]"
                    : "bg-[#FFF8E7]"
              } ${
                isClickable
                  ? "cursor-pointer hover:scale-105"
                  : "cursor-default opacity-70"
              }`}
              aria-label={step?.title || `Step ${i + 1}`}
              title={step?.title}
            />
          );
        })}
      </div>
    </div>
  );
}
