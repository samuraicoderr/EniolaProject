"use client";

import { motion } from "motion/react";
import Link from "next/link";

interface NavItem {
  href: string;
  label: string;
  emoji: string;
  bg: string;
  shadow: string;
}

const navItems: NavItem[] = [
  {
    href: "/videos",
    label: "Videos",
    emoji: "🎬",
    bg: "#C8860A",
    shadow: "#A06808",
  },
  {
    href: "/leaderboard",
    label: "Ranks",
    emoji: "🏆",
    bg: "#1B3A8C",
    shadow: "#0D1E56",
  },
  {
    href: "/progress",
    label: "Progress",
    emoji: "📊",
    bg: "#2A7A3B",
    shadow: "#1A5C28",
  },
];

export function HomeNav() {
  return (
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex gap-3">
      {navItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <motion.div
            className="font-bold text-white rounded-2xl shadow-lg cursor-pointer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95, y: 2 }}
            style={{
              background: item.bg,
              fontFamily: "var(--font-fredoka), system-ui, sans-serif",
              fontSize: "clamp(13px, 1.6vw, 18px)",
              padding: "clamp(8px, 1.2vh, 14px) clamp(14px, 2vw, 24px)",
              boxShadow: `${item.shadow} 0px 5px 0px, rgba(0, 0, 0, 0.2) 0px 8px 20px`,
            }}
          >
            {item.emoji} {item.label}
          </motion.div>
        </Link>
      ))}
    </div>
  );
}
