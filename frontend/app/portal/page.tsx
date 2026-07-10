"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useRequiredAuth } from "@/lib/api/auth/authContext";
import { PageShell, PageCard } from "@/components/app/PageShell";

interface PortalCardProps {
  href: string;
  emoji: string;
  title: string;
  description: string;
  bg: string;
  shadow: string;
}

function PortalCard({ href, emoji, title, description, bg, shadow }: PortalCardProps) {
  return (
    <Link href={href}>
      <motion.div
        className="rounded-[1.8rem] p-6 h-full"
        style={{
          background: bg,
          border: `4px solid ${shadow}`,
          boxShadow: `${shadow} 0px 5px 0px`,
        }}
        whileHover={{ scale: 1.03, y: -4 }}
        whileTap={{ scale: 0.97 }}
      >
        <div className="text-5xl mb-3">{emoji}</div>
        <h3
          className="text-xl font-black text-white mb-1"
          style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
        >
          {title}
        </h3>
        <p className="text-white/90 text-sm font-medium">{description}</p>
      </motion.div>
    </Link>
  );
}

export default function PortalPage() {
  const auth = useRequiredAuth();

  if (auth.isLoading || !auth.user) {
    return (
      <div className="min-h-screen bg-[#F2E1C0] flex items-center justify-center">
        <div
          className="text-center font-bold text-[#1B3A8C] text-xl animate-pulse"
          style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
        >
          Loading Parent Portal...
        </div>
      </div>
    );
  }

  const cards: PortalCardProps[] = [
    {
      href: "/progress",
      emoji: "📊",
      title: "Progress",
      description: "Track stars, completed topics and learning by category.",
      bg: "#2A7A3B",
      shadow: "#1A5C28",
    },
    {
      href: "/videos",
      emoji: "🎬",
      title: "Videos",
      description: "Browse kid-safe educational videos by category.",
      bg: "#C8860A",
      shadow: "#A06808",
    },
    {
      href: "/leaderboard",
      emoji: "🏆",
      title: "Leaderboard",
      description: "See how your child ranks against other learners.",
      bg: "#1B3A8C",
      shadow: "#0D1E56",
    },
    {
      href: "/coach",
      emoji: "💬",
      title: "Coach",
      description: "Chat with Eniola, the Yoruba learning assistant.",
      bg: "#8B2E8B",
      shadow: "#5A1A5A",
    },
  ];

  return (
    <PageShell
      title="Parent Portal"
      subtitle="Everything you need to support your child"
      emoji="👨‍👩‍👧"
      activeTab="portal"
    >
      {/* Welcome card */}
      <PageCard className="mb-8 pt-8">
        <div className="flex items-center gap-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
            style={{ background: "#FFF8E1", border: "4px solid #D4A017" }}
          >
            👨‍👩‍👧
          </div>
          <div>
            <h2
              className="text-2xl md:text-3xl font-black"
              style={{
                color: "#1B3A8C",
                fontFamily: "var(--font-fredoka), system-ui, sans-serif",
              }}
            >
              Welcome back, {auth.user.first_name || "Parent"}!
            </h2>
            <p className="text-[#5A4020] text-base mt-1">
              Support your child&apos;s Yoruba learning journey from one place.
            </p>
          </div>
        </div>
      </PageCard>

      {/* Quick actions grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <PortalCard {...card} />
          </motion.div>
        ))}
      </div>

      {/* Admin card for staff */}
      {auth.user.is_staff && (
        <PageCard className="mb-8" borderColor="#4A4A4A" shadowColor="#2A2A2A" padding="p-6">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
              style={{ background: "#E8E8E8", border: "3px solid #4A4A4A" }}
            >
              ⚙️
            </div>
            <div className="flex-1">
              <h3
                className="text-xl font-black"
                style={{
                  color: "#1B3A8C",
                  fontFamily: "var(--font-fredoka), system-ui, sans-serif",
                }}
              >
                Admin Area
              </h3>
              <p className="text-[#5A4020] text-sm">
                Manage app settings, API keys and view platform stats.
              </p>
            </div>
            <Link href="/admin/dashboard">
              <motion.button
                className="text-white font-bold py-2.5 px-6 rounded-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: "#4A4A4A",
                  boxShadow: "#2A2A2A 0px 4px 0px",
                  fontFamily: "var(--font-fredoka), system-ui, sans-serif",
                }}
              >
                Open Admin
              </motion.button>
            </Link>
          </div>
        </PageCard>
      )}

      {/* Tip card */}
      <PageCard className="text-center py-8" borderColor="#2A7A3B" shadowColor="#1A5C28">
        <div className="text-5xl mb-3">💡</div>
        <h3
          className="text-xl font-black mb-2"
          style={{
            color: "#1B3A8C",
            fontFamily: "var(--font-fredoka), system-ui, sans-serif",
          }}
        >
          Daily Learning Tip
        </h3>
        <p className="text-[#5A4020] max-w-lg mx-auto">
          Consistency beats intensity! Even 10 minutes of practice a day builds strong Yoruba
          vocabulary. Try reviewing one category before bedtime.
        </p>
      </PageCard>
    </PageShell>
  );
}
