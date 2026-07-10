"use client";

import { motion } from "motion/react";
import Link from "next/link";

interface NavItem {
  href?: string;
  label: string;
  emoji: string;
  bg: string;
  shadow: string;
  onClick?: () => void;
}

interface HomeNavProps {
  isAdmin?: boolean;
  onLogout?: () => void;
}

function getNavItems(isAdmin: boolean, onLogout?: () => void): NavItem[] {
  const items: NavItem[] = [
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
    {
      href: "/coach",
      label: "Coach",
      emoji: "🤖",
      bg: "#8B2E8B",
      shadow: "#5A1A5A",
    },
    {
      href: "/portal",
      label: "Portal",
      emoji: "🏫",
      bg: "#B5451B",
      shadow: "#8B3010",
    },
  ];

  if (isAdmin) {
    items.push({
      href: "/admin/dashboard",
      label: "Admin",
      emoji: "⚙️",
      bg: "#4A4A4A",
      shadow: "#2A2A2A",
    });
  }

  items.push({
    label: "Logout",
    emoji: "🚪",
    bg: "#C0392B",
    shadow: "#8B1A1A",
    onClick: onLogout,
  });

  return items;
}

export function HomeNav({ isAdmin = false, onLogout }: HomeNavProps) {
  const navItems = getNavItems(isAdmin, onLogout);

  return (
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex gap-3 flex-wrap justify-center px-2">
      {navItems.map((item) => {
        const content = (
          <motion.div
            className="font-bold text-white rounded-2xl shadow-lg cursor-pointer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95, y: 2 }}
            style={{
              background: item.bg,
              fontFamily: "var(--font-fredoka), system-ui, sans-serif",
              fontSize: "clamp(11px, 1.4vw, 16px)",
              padding: "clamp(6px, 1.1vh, 12px) clamp(10px, 1.6vw, 20px)",
              boxShadow: `${item.shadow} 0px 4px 0px, rgba(0, 0, 0, 0.2) 0px 6px 16px`,
            }}
          >
            {item.emoji} {item.label}
          </motion.div>
        );

        if (item.onClick) {
          return (
            <div
              key={item.label}
              onClick={item.onClick}
              role="button"
              tabIndex={0}
            >
              {content}
            </div>
          );
        }

        return (
          <Link key={item.href} href={item.href!}>
            {content}
          </Link>
        );
      })}
    </div>
  );
}
