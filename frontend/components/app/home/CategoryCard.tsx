"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ReactNode } from "react";

interface CategoryCardProps {
  href: string;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  icon: ReactNode;
  emoji: string;
  label: string;
  bg: string;
  shadow: string;
  testId?: string;
}

export function CategoryCard({
  href,
  position,
  icon,
  emoji,
  label,
  bg,
  shadow,
  testId,
}: CategoryCardProps) {
  // Gentle idle float delay derived from label length so cards feel organic
  const floatDelay = (label.length % 4) * 0.2;

  return (
    <Link href={href}>
      <motion.div
        className="absolute z-20 cursor-pointer"
        data-testid={testId}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          y: [0, -6, 0],
        }}
        whileHover={{ scale: 1.05, y: -8 }}
        whileTap={{ scale: 0.95 }}
        transition={{
          scale: { type: "spring", stiffness: 300, damping: 18 },
          opacity: { duration: 0.4 },
          y: {
            repeat: Infinity,
            duration: 3.5,
            ease: "easeInOut",
            delay: floatDelay,
          },
        }}
        style={{
          ...position,
          width: "clamp(150px, 17vw, 220px)",
        }}
      >
        <div className="w-full" style={{ aspectRatio: "140 / 165" }}>
          {icon}
        </div>
        <motion.div
          className="flex items-center justify-center gap-2 mx-auto px-4 py-2.5 rounded-full shadow-2xl"
          whileHover={{ y: -2 }}
          whileTap={{ y: 2 }}
          style={{
            background: bg,
            border: "3px solid #D4A017",
            boxShadow: `${shadow} 0px 6px 0px, rgba(0, 0, 0, 0.28) 0px 10px 24px`,
            width: "88%",
          }}
        >
          <span style={{ fontSize: "clamp(16px, 2.2vw, 22px)" }}>{emoji}</span>
          <span
            className="font-bold text-white"
            style={{
              fontSize: "clamp(14px, 1.9vw, 20px)",
              fontFamily: "var(--font-fredoka), system-ui, sans-serif",
            }}
          >
            {label}
          </span>
        </motion.div>
      </motion.div>
    </Link>
  );
}

export const AnimalIcon = () => (
  <svg
    viewBox="0 0 140 165"
    className="w-full h-full"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="55" y="92" width="30" height="63" rx="6" fill="#7A4F2A" />
    <rect x="60" y="97" width="7" height="50" rx="3" fill="#9A6A3A" />
    <ellipse cx="70" cy="78" rx="52" ry="40" fill="#1E8A34" />
    <ellipse cx="70" cy="62" rx="42" ry="32" fill="#28A840" />
    <ellipse cx="70" cy="48" rx="30" ry="24" fill="#44CC5A" />
    <rect x="18" y="70" width="8" height="28" rx="3" fill="#7A4F2A" />
    <circle cx="22" cy="68" r="16" fill="#FF8FAB" />
    <circle cx="14" cy="60" r="11" fill="#FFAEC8" />
    <circle cx="30" cy="60" r="11" fill="#FF8FAB" />
    <text x="8" y="52" fontSize="14" fill="#FFD700">
      ♪
    </text>
    <text x="28" y="44" fontSize="10" fill="#FF6BA8">
      ♫
    </text>
    <circle cx="84" cy="114" r="15" fill="#C8860A" />
    <circle cx="84" cy="111" r="12" fill="#F0B840" />
    <circle cx="80" cy="109" r="3.2" fill="#2A1800" />
    <circle cx="88" cy="109" r="3.2" fill="#2A1800" />
    <ellipse cx="84" cy="116" rx="5" ry="3.5" fill="#C07820" />
    <rect x="36" y="112" width="9" height="36" rx="4" fill="#C8860A" />
    <rect x="42" y="108" width="7" height="24" rx="3" fill="#D49820" />
    <ellipse cx="50" cy="106" rx="9" ry="6" fill="#E0A830" />
    <circle cx="52" cy="103" r="4.5" fill="#E0A830" />
    <circle cx="53" cy="101" r="1.8" fill="#2A1800" />
    <circle cx="37" cy="118" r="3" fill="#7A5000" />
    <circle cx="44" cy="126" r="3" fill="#7A5000" />
    <ellipse cx="70" cy="157" rx="56" ry="8" fill="#1A6820" opacity="0.35" />
  </svg>
);

export const NumbersIcon = () => (
  <svg
    viewBox="0 0 140 165"
    className="w-full h-full"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="22" y="72" width="96" height="84" rx="6" fill="#D48A20" />
    <rect x="26" y="76" width="88" height="78" rx="4" fill="#F0A830" />
    <polygon points="16,74 70,26 124,74" fill="#B53020" />
    <polygon points="20,74 70,30 120,74" fill="#D44030" />
    <rect x="58" y="14" width="24" height="18" rx="3" fill="#B53020" />
    <polygon points="54,14 70,0 86,14" fill="#8A2010" />
    <circle cx="70" cy="22" r="5" fill="#8B6010" />
    <circle
      cx="70"
      cy="52"
      r="13"
      fill="#FFFDE7"
      stroke="#D4A017"
      strokeWidth="2.5"
    />
    <line
      x1="70"
      y1="43"
      x2="70"
      y2="52"
      stroke="#1B3A8C"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="70"
      y1="52"
      x2="79"
      y2="52"
      stroke="#1B3A8C"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="70" cy="52" r="2" fill="#1B3A8C" />
    <line
      x1="116"
      y1="74"
      x2="116"
      y2="46"
      stroke="#4A2800"
      strokeWidth="2.5"
    />
    <polygon points="116,46 136,52 116,58" fill="#FFD700" />
    <rect
      x="28"
      y="84"
      width="30"
      height="24"
      rx="4"
      fill="#87CEEB"
      stroke="#FFFBF0"
      strokeWidth="2"
    />
    <text
      x="43"
      y="101"
      textAnchor="middle"
      fontSize="14"
      fontWeight="bold"
      fill="#1B3A8C"
      fontFamily="sans-serif"
    >
      12
    </text>
    <rect
      x="82"
      y="84"
      width="30"
      height="24"
      rx="4"
      fill="#87CEEB"
      stroke="#FFFBF0"
      strokeWidth="2"
    />
    <text
      x="97"
      y="101"
      textAnchor="middle"
      fontSize="14"
      fontWeight="bold"
      fill="#1B3A8C"
      fontFamily="sans-serif"
    >
      34
    </text>
    <rect x="54" y="112" width="32" height="44" rx="5" fill="#6B3010" />
    <rect x="57" y="115" width="12" height="38" rx="2" fill="#7E4A1A" />
    <rect x="71" y="115" width="12" height="38" rx="2" fill="#7E4A1A" />
    <circle cx="69" cy="136" r="3" fill="#D4A017" />
    <circle cx="74" cy="136" r="3" fill="#D4A017" />
    <rect x="48" y="152" width="44" height="6" rx="2" fill="#B8780A" />
    <ellipse cx="70" cy="158" rx="58" ry="7" fill="#1A6820" opacity="0.35" />
  </svg>
);

export const ObjectsIcon = () => (
  <svg
    viewBox="0 0 140 165"
    className="w-full h-full"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="20" y="82" width="100" height="74" rx="8" fill="#C8845A" />
    <rect x="24" y="86" width="92" height="68" rx="6" fill="#E09A70" />
    <polygon points="13,84 70,30 127,84" fill="#7A3C0C" />
    <polygon points="17,84 70,34 123,84" fill="#9A5020" />
    <rect x="88" y="34" width="18" height="30" rx="3" fill="#7A3C0C" />
    <rect x="86" y="32" width="22" height="6" rx="2" fill="#9A5020" />
    <circle cx="95" cy="24" r="7" fill="white" opacity="0.65" />
    <circle cx="100" cy="15" r="5.5" fill="white" opacity="0.45" />
    <circle cx="94" cy="8" r="4.5" fill="white" opacity="0.28" />
    <rect
      x="27"
      y="92"
      width="32"
      height="26"
      rx="4"
      fill="#B0DCF5"
      stroke="#FFFBF0"
      strokeWidth="2"
    />
    <text
      x="43"
      y="110"
      textAnchor="middle"
      fontSize="18"
      fontFamily="sans-serif"
    >
      🧸
    </text>
    <rect
      x="81"
      y="92"
      width="32"
      height="26"
      rx="4"
      fill="#B0DCF5"
      stroke="#FFFBF0"
      strokeWidth="2"
    />
    <text
      x="97"
      y="110"
      textAnchor="middle"
      fontSize="18"
      fontFamily="sans-serif"
    >
      🪑
    </text>
    <rect x="52" y="114" width="36" height="42" rx="5" fill="#5A2808" />
    <rect x="55" y="117" width="14" height="36" rx="2" fill="#6E3A12" />
    <rect x="71" y="117" width="14" height="36" rx="2" fill="#6E3A12" />
    <circle cx="69" cy="138" r="3.5" fill="#D4A017" />
    <circle cx="74" cy="138" r="3.5" fill="#D4A017" />
    <rect x="25" y="148" width="2.5" height="10" fill="#2A7A3B" />
    <circle cx="26" cy="147" r="6" fill="#FF5555" />
    <rect x="38" y="144" width="2.5" height="12" fill="#2A7A3B" />
    <circle cx="39" cy="143" r="7" fill="#FFD700" />
    <rect x="52" y="148" width="2.5" height="10" fill="#2A7A3B" />
    <circle cx="53" cy="147" r="5.5" fill="#FF8FAB" />
    <ellipse cx="70" cy="158" rx="62" ry="8" fill="#1A6820" opacity="0.35" />
  </svg>
);

export const ColorsIcon = () => (
  <svg
    viewBox="0 0 140 165"
    className="w-full h-full"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 78 Q12 148 70 148 L70 56 Q42 56 12 78Z"
      fill="#FFFDE7"
      stroke="#D4A017"
      strokeWidth="2.5"
    />
    <path
      d="M128 78 Q128 148 70 148 L70 56 Q98 56 128 78Z"
      fill="#FFFDE7"
      stroke="#D4A017"
      strokeWidth="2.5"
    />
    <rect x="67" y="56" width="6" height="92" rx="3" fill="#D4A017" />
    <path
      d="M9 79 Q9 62 70 56 Q131 62 131 79"
      fill="#7B1C7B"
      stroke="#5A0A5A"
      strokeWidth="2.5"
    />
    <path d="M12 79 Q12 64 70 58 Q128 64 128 79" fill="#9B2E9B" />
    <circle cx="33" cy="92" r="11" fill="#E74C3C" />
    <circle cx="52" cy="92" r="11" fill="#F39C12" />
    <circle cx="33" cy="118" r="11" fill="#2ECC71" />
    <circle cx="52" cy="118" r="11" fill="#3498DB" />
    <g transform="rotate(18,95,78)">
      <rect x="91" y="68" width="6" height="52" rx="2" fill="#8B5E3C" />
      <ellipse cx="94" cy="66" rx="9" ry="13" fill="#9B59B6" />
      <ellipse cx="94" cy="65" rx="7" ry="10" fill="#BE85D8" />
    </g>
    <circle cx="92" cy="108" r="9" fill="#E74C3C" opacity="0.7" />
    <circle cx="108" cy="118" r="8" fill="#3498DB" opacity="0.7" />
    <circle cx="98" cy="128" r="7" fill="#F39C12" opacity="0.7" />
    <circle cx="70" cy="48" r="8" fill="#FFD700" />
    <polygon points="70,44 80,48 70,52" fill="#FF8C00" />
    <circle cx="73.5" cy="46" r="2.2" fill="#2A1800" />
    <circle cx="112" cy="148" r="14" fill="#7A4F2A" />
    <circle cx="112" cy="145" r="11" fill="#C49A7A" />
    <circle cx="108" cy="143" r="3.2" fill="#2A1800" />
    <circle cx="116" cy="143" r="3.2" fill="#2A1800" />
    <ellipse cx="112" cy="150" rx="5.5" ry="3.8" fill="#B07050" />
    <ellipse cx="70" cy="158" rx="60" ry="8" fill="#1A6820" opacity="0.35" />
  </svg>
);
