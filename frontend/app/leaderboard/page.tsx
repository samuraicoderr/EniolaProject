"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useRequiredAuth } from "@/lib/api/auth/authContext";
import YorubaService, {
  LeaderboardUser,
} from "@/lib/api/services/Yoruba.Service";
import { PageShell, PageCard } from "@/components/app/PageShell";

const avatars = [
  "🦁",
  "🐘",
  "🦒",
  "🐦",
  "🐢",
  "🦋",
  "🐸",
  "🦓",
  "🦊",
  "🐬",
  "🦅",
  "🐼",
];

function getRankStyle(rank: number, isSelf: boolean) {
  if (isSelf) {
    return {
      bg: "linear-gradient(135deg, #1B3A8C 0%, #2A5FCC 100%)",
      border: "#D4A017",
      shadow: "#0D1E56",
      nameColor: "#FFFBF0",
      starColor: "#FFE082",
      badgeBg: "#D4A017",
      badgeBorder: "#A06808",
      badgeText: "#1B3A8C",
    };
  }
  if (rank === 1) {
    return {
      bg: "#FFF8E1",
      border: "#D4A017",
      shadow: "#A06808",
      nameColor: "#1B3A8C",
      starColor: "#D4A017",
      badgeBg: "#FFFBF0",
      badgeBorder: "#D4A017",
      badgeText: "#5A4020",
    };
  }
  if (rank === 2) {
    return {
      bg: "#F5F5F5",
      border: "#9E9E9E",
      shadow: "#616161",
      nameColor: "#1B3A8C",
      starColor: "#D4A017",
      badgeBg: "#FFFBF0",
      badgeBorder: "#9E9E9E",
      badgeText: "#5A4020",
    };
  }
  if (rank === 3) {
    return {
      bg: "#FFF8E1",
      border: "#D4A017",
      shadow: "#A06808",
      nameColor: "#1B3A8C",
      starColor: "#D4A017",
      badgeBg: "#D4A017",
      badgeBorder: "#A06808",
      badgeText: "#1B3A8C",
    };
  }
  return {
    bg: "#FFFBF0",
    border: "#E8D8B0",
    shadow: "rgba(0,0,0,0.08)",
    nameColor: "#1B3A8C",
    starColor: "#C8860A",
    badgeBg: "#F0E8D0",
    badgeBorder: "#C8B890",
    badgeText: "#5A4020",
  };
}

function getRankIcon(rank: number) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return rank.toString();
}

export default function LeaderboardPage() {
  const auth = useRequiredAuth();
  const [leaders, setLeaders] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth.isAuthenticated) {
      YorubaService.getLeaderboard()
        .then((data) => {
          setLeaders(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching leaderboard:", err);
          setLoading(false);
        });
    }
  }, [auth.isAuthenticated]);

  if (auth.isLoading || loading) {
    return (
      <div className="min-h-screen bg-[#17224f] flex items-center justify-center">
        <div
          className="text-center font-bold text-[#FFFBF0] text-xl animate-pulse"
          style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
        >
          Loading Leaderboard...
        </div>
      </div>
    );
  }

  const selfLeader = leaders.find((l) => l.is_self);
  const totalCount = leaders.length;
  const selfRank = selfLeader?.rank ?? totalCount + 1;
  const selfStars = selfLeader?.stars ?? 0;

  return (
    <PageShell
      title="Leaderboard"
      subtitle="Top star earners this week!"
      emoji="🏆"
      background="dark"
      showBirds
      headerButton={{
        label: "← Home",
        href: "/",
        bg: "#D4A017",
        color: "#1B3A8C",
        shadow: "#A06808",
      }}
    >
      {/* Your ranking card */}
      <motion.div
        className="rounded-[2rem] p-5 mb-6 flex items-center gap-5 shadow-2xl relative overflow-hidden"
        style={{
          background: "#D4A017",
          border: "4px solid #A06808",
          boxShadow: "#A06808 0px 6px 0px",
        }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #fff 0px, #fff 4px, transparent 4px, transparent 14px), repeating-linear-gradient(-45deg, #fff 0px, #fff 4px, transparent 4px, transparent 14px)",
          }}
        />
        <div className="text-6xl z-10">🥉</div>
        <div className="z-10">
          <p className="text-base font-bold" style={{ color: "#5A3000" }}>
            Your ranking
          </p>
          <p
            className="text-4xl font-black"
            style={{
              color: "#1B3A8C",
              fontFamily: "var(--font-fredoka), system-ui, sans-serif",
            }}
          >
            #{selfRank} of {totalCount || 1}
          </p>
          <p
            className="text-base font-semibold mt-0.5"
            style={{ color: "#5A3000" }}
          >
            ⭐ {selfStars} stars — keep going!
          </p>
        </div>
        <div className="ml-auto z-10 text-5xl">
          <motion.span
            animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🌟
          </motion.span>
        </div>
      </motion.div>

      {/* Leaderboard list */}
      <div className="flex-1 flex flex-col gap-3">
        {leaders.map((leader, index) => {
          const style = getRankStyle(leader.rank, leader.is_self);
          const avatar = leader.is_self
            ? "⭐"
            : avatars[index % avatars.length];

          return (
            <motion.div
              key={leader.username}
              className="flex items-center gap-4 px-5 py-4 rounded-[1.5rem] relative overflow-hidden"
              style={{
                background: style.bg,
                border: `3px solid ${style.border}`,
                boxShadow: `${style.shadow} 0px 4px 0px`,
              }}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.01 }}
            >
              {leader.is_self && (
                <div
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{
                    background:
                      "repeating-linear-gradient(90deg, #D4A017 0px, #D4A017 10px, #B5451B 10px, #B5451B 20px)",
                  }}
                />
              )}
              <div
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full text-lg font-black"
                style={{
                  background: style.badgeBg,
                  border: `2px solid ${style.badgeBorder}`,
                  color: style.badgeText,
                  fontFamily: "var(--font-fredoka), system-ui, sans-serif",
                }}
              >
                {getRankIcon(leader.rank)}
              </div>
              <div
                className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full text-2xl"
                style={{
                  background: leader.is_self
                    ? "rgba(255,255,255,0.15)"
                    : "#F0E8D0",
                }}
              >
                {avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-lg font-bold truncate"
                  style={{
                    color: style.nameColor,
                    fontFamily: "var(--font-fredoka), system-ui, sans-serif",
                  }}
                >
                  {leader.first_name || leader.username}
                  {leader.is_self && (
                    <span
                      className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: "#D4A017", color: "#1B3A8C" }}
                    >
                      YOU
                    </span>
                  )}
                </p>
              </div>
              <div className="flex-shrink-0 flex items-center gap-1.5">
                <span className="text-xl">⭐</span>
                <span
                  className="text-xl font-black"
                  style={{
                    color: style.starColor,
                    fontFamily: "var(--font-fredoka), system-ui, sans-serif",
                  }}
                >
                  {leader.stars}
                </span>
              </div>
            </motion.div>
          );
        })}

        {leaders.length === 0 && (
          <PageCard className="text-center py-12">
            <div className="text-6xl mb-4">🏆</div>
            <p
              className="text-2xl font-bold"
              style={{
                color: "#1B3A8C",
                fontFamily: "var(--font-fredoka), system-ui, sans-serif",
              }}
            >
              No star records yet!
            </p>
            <p className="text-base mt-2" style={{ color: "#5A4020" }}>
              Play a game to start climbing the board.
            </p>
          </PageCard>
        )}
      </div>

      {/* CTA card */}
      <motion.div
        className="mt-8 rounded-[2rem] p-6 text-center shadow-xl"
        style={{
          background: "rgba(255, 251, 240, 0.12)",
          border: "2px solid rgba(212, 160, 23, 0.5)",
        }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p
          className="text-2xl font-bold"
          style={{
            color: "#FFE082",
            fontFamily: "var(--font-fredoka), system-ui, sans-serif",
          }}
        >
          Play more games to climb the board! 🚀
        </p>
        <Link href="/">
          <motion.button
            className="mt-4 text-xl font-bold py-4 px-10 rounded-2xl text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: "#2A7A3B",
              fontFamily: "var(--font-fredoka), system-ui, sans-serif",
              boxShadow: "#1A5C28 0px 5px 0px",
            }}
          >
            🎮 Play Now
          </motion.button>
        </Link>
      </motion.div>
    </PageShell>
  );
}
