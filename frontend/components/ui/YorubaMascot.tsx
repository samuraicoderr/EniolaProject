"use client";

import { motion } from "motion/react";

interface YorubaMascotProps {
  className?: string;
  state?: "idle" | "speaking" | "happy" | "thinking";
  size?: number;
}

export function YorubaMascot({ className = "", state = "idle", size = 180 }: YorubaMascotProps) {
  // Define animations based on states
  const capVariants = {
    idle: { rotate: 0 },
    speaking: { rotate: [0, -2, 2, -1, 1, 0], transition: { repeat: Infinity, duration: 1.5 } },
    happy: { y: [0, -6, 0], transition: { repeat: Infinity, duration: 0.8 } },
    thinking: { rotate: -3 },
  };

  const bodyVariants = {
    idle: { y: 0 },
    speaking: { y: [0, -1, 1, 0], transition: { repeat: Infinity, duration: 1.5 } },
    happy: { scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 0.8 } },
    thinking: { y: 0 },
  };

  const mouthVariants = {
    idle: { scaleY: 1, d: "M63 94 Q80 102 97 94" },
    speaking: {
      scaleY: [1, 0.4, 1.2, 0.6, 1],
      d: "M63 94 Q80 112 97 94",
      transition: { repeat: Infinity, duration: 0.6 },
    },
    happy: { scaleY: 1.3, d: "M63 94 Q80 115 97 94" },
    thinking: { d: "M68 96 Q80 96 92 96" },
  };

  const eyesVariants = {
    idle: { scaleY: 1 },
    happy: { scaleY: [1, 0.1, 1], transition: { repeat: Infinity, duration: 2 } },
    speaking: { scaleY: [1, 0.1, 1], transition: { repeat: Infinity, duration: 2.5 } },
    thinking: { y: -2, x: -1 },
  };

  return (
    <motion.div
      className={`relative select-none flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      animate={state}
      variants={bodyVariants}
    >
      <svg
        viewBox="0 0 160 180"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shadow */}
        <ellipse cx="80" cy="170" rx="60" ry="8" fill="#000000" opacity="0.12" />

        {/* Arms / Shoulders */}
        <path
          d="M18 140 Q4 158 8 170 L38 160 Q42 150 28 143Z"
          fill="#FFFBF0"
          stroke="#1B3A8C"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M142 140 Q156 158 152 170 L122 160 Q118 150 132 143Z"
          fill="#FFFBF0"
          stroke="#1B3A8C"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Neck / Collar */}
        <rect x="71" y="108" width="18" height="16" rx="5" fill="#C17B4A" />

        {/* Traditional beads (Necklace) */}
        <circle cx="68" cy="120" r="5" fill="#E2A030" />
        <circle cx="74" cy="124" r="5" fill="#B5451B" />
        <circle cx="80" cy="126" r="5" fill="#E2A030" />
        <circle cx="86" cy="124" r="5" fill="#B5451B" />
        <circle cx="92" cy="120" r="5" fill="#E2A030" />

        {/* Face */}
        <circle cx="80" cy="75" r="46" fill="#C17B4A" stroke="#2C1810" strokeWidth="1.5" />

        {/* Traditional Cap (Fila) */}
        <motion.g variants={capVariants}>
          <path
            d="M40 37 Q80 12 120 37 L120 44 Q80 34 40 44 Z"
            fill="#1B3A8C"
            stroke="#2C1810"
            strokeWidth="1.5"
          />
          {/* Cap Base */}
          <rect x="40" y="27" width="80" height="14" rx="7" fill="#1B3A8C" />
          {/* Gold Stripe Pattern */}
          <rect x="42" y="31" width="76" height="5" rx="2.5" fill="#D4A017" />
          <circle cx="80" cy="22" r="5" fill="#D4A017" />
        </motion.g>

        {/* Eyes */}
        <g>
          {/* Left Eye */}
          <circle cx="63" cy="73" r="10" fill="white" />
          <motion.circle
            cx="65"
            cy="74"
            r="6"
            fill="#2C1810"
            variants={eyesVariants}
          />
          <circle cx="67" cy="71" r="2.5" fill="white" />

          {/* Right Eye */}
          <circle cx="97" cy="73" r="10" fill="white" />
          <motion.circle
            cx="99"
            cy="74"
            r="6"
            fill="#2C1810"
            variants={eyesVariants}
          />
          <circle cx="101" cy="71" r="2.5" fill="white" />
        </g>

        {/* Nose */}
        <ellipse cx="80" cy="85" rx="4.5" ry="3.2" fill="#A0622A" />

        {/* Cheeks */}
        <circle cx="50" cy="83" r="8" fill="#E07A5A" opacity="0.35" />
        <circle cx="110" cy="83" r="8" fill="#E07A5A" opacity="0.35" />

        {/* Smile (Mouth) */}
        <motion.path
          variants={mouthVariants}
          stroke="#2C1810"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
}
