"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useRequiredAuth } from "@/lib/api/auth/authContext";
import YorubaService, {
  UserProgressItem,
} from "@/lib/api/services/Yoruba.Service";
import { PageShell, PageCard } from "@/components/app/PageShell";
import { YorubaMascot } from "@/components/ui/YorubaMascot";

const categories = [
  {
    key: "animals",
    label: "Eranko (Animals)",
    emoji: "🦁",
    color: "#2A7A3B",
    shadow: "#1A5C28",
  },
  {
    key: "colors",
    label: "Awo (Colors)",
    emoji: "🎨",
    color: "#B5451B",
    shadow: "#8B3010",
  },
  {
    key: "numbers",
    label: "Onka (Numbers)",
    emoji: "🔢",
    color: "#1B3A8C",
    shadow: "#0D1E56",
  },
  {
    key: "objects",
    label: "Nkan (Objects)",
    emoji: "🧸",
    color: "#C8860A",
    shadow: "#A06808",
  },
];

export default function ProgressPage() {
  const auth = useRequiredAuth();
  const [progress, setProgress] = useState<UserProgressItem[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    if (auth.isAuthenticated) {
      YorubaService.getProgress()
        .then((data) => {
          setProgress(data);
          const stars = data.reduce((acc, curr) => acc + curr.stars, 0);
          setTotalStars(stars);
          setCompletedCount(data.filter((p) => p.completed).length);
        })
        .catch((err) => console.error("Error fetching progress:", err));
    }
  }, [auth.isAuthenticated]);

  if (auth.isLoading || !auth.user) {
    return (
      <div className="min-h-screen bg-[#F2E1C0] flex items-center justify-center">
        <div
          className="text-center font-bold text-[#1B3A8C] text-xl animate-pulse"
          style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
        >
          Loading Progress Portal...
        </div>
      </div>
    );
  }

  const getCategoryProgress = (key: string) => {
    return (
      progress.find((p) => p.category === key) || { stars: 0, completed: false }
    );
  };

  return (
    <PageShell
      title="Ẹ káabọ̀, Parent!"
      subtitle="Here is your child's learning progress"
      emoji="👋"
      headerButton={{
        label: "← Back to Play",
        href: "/",
        bg: "#1B3A8C",
        color: "#FFFBF0",
        shadow: "#0D1E56",
      }}
    >
      {/* Welcome card */}
      <PageCard className="flex items-center gap-6 mb-8 pt-8">
        <YorubaMascot state="happy" size={80} />
        <div>
          <h1
            className="text-3xl md:text-4xl font-bold"
            style={{
              color: "#1B3A8C",
              fontFamily: "var(--font-fredoka), system-ui, sans-serif",
            }}
          >
            Ẹ káabọ̀, Parent!
          </h1>
          <p className="text-base mt-1" style={{ color: "#5A4020" }}>
            Here is your child&apos;s learning progress
          </p>
        </div>
      </PageCard>

      {/* Progress summary */}
      <PageCard className="mb-8">
        <div className="flex items-center gap-4 border-b border-[#D4A017]/30 pb-4 mb-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow"
            style={{ background: "#FFF8E1", border: "3px solid #D4A017" }}
          >
            🧑‍🎓
          </div>
          <div>
            <h2
              className="text-xl font-black"
              style={{
                color: "#1B3A8C",
                fontFamily: "var(--font-fredoka), system-ui, sans-serif",
              }}
            >
              {auth.user.first_name || auth.user.username}
            </h2>
            <p className="text-[#9A8060] text-xs font-semibold">
              Active Learner Profile
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div
            className="rounded-2xl p-3 border"
            style={{ background: "#FFF8E1", borderColor: "#D4A017" }}
          >
            <span className="text-[#9A8060] text-xs font-bold uppercase tracking-wider block">
              Total Stars
            </span>
            <span
              className="text-3xl font-black block"
              style={{
                color: "#D4A017",
                fontFamily: "var(--font-fredoka), system-ui, sans-serif",
              }}
            >
              ⭐ {totalStars}
            </span>
          </div>
          <div
            className="rounded-2xl p-3 border"
            style={{ background: "#E8F5E9", borderColor: "#2A7A3B" }}
          >
            <span className="text-[#9A8060] text-xs font-bold uppercase tracking-wider block">
              Completed Topics
            </span>
            <span
              className="text-3xl font-black block"
              style={{
                color: "#2A7A3B",
                fontFamily: "var(--font-fredoka), system-ui, sans-serif",
              }}
            >
              {completedCount} / 4
            </span>
          </div>
        </div>
      </PageCard>

      {/* Categories Progress List */}
      <h2
        className="text-2xl font-bold mb-4"
        style={{
          color: "#1B3A8C",
          fontFamily: "var(--font-fredoka), system-ui, sans-serif",
        }}
      >
        Learning by Category
      </h2>

      <div className="space-y-4 mb-8">
        {categories.map((cat, index) => {
          const { stars, completed } = getCategoryProgress(cat.key);
          return (
            <motion.div
              key={cat.key}
              className="rounded-[1.5rem] p-4 flex items-center justify-between shadow"
              style={{
                background: "#FFFBF0",
                border: `3px solid ${cat.color}`,
                boxShadow: `${cat.shadow} 0px 4px 0px`,
              }}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">{cat.emoji}</span>
                <div>
                  <h4
                    className="font-black text-slate-800 text-lg"
                    style={{
                      fontFamily: "var(--font-fredoka), system-ui, sans-serif",
                    }}
                  >
                    {cat.label}
                  </h4>
                  <span className="text-[#9A8060] text-xs font-semibold">
                    Stars Earned: {stars} / 8
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className="text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full border"
                  style={{
                    background: completed ? `${cat.color}22` : "#FFFBF0",
                    color: cat.color,
                    borderColor: cat.color,
                  }}
                >
                  {completed ? "Completed ✅" : "In Progress 🚀"}
                </span>
                <Link href={`/game/${cat.key}`}>
                  <motion.button
                    className="text-white font-bold py-1.5 px-4 rounded-xl text-xs"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      background: cat.color,
                      boxShadow: `${cat.shadow} 0px 3px 0px`,
                      fontFamily: "var(--font-fredoka), system-ui, sans-serif",
                    }}
                  >
                    Play
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Link href="/videos">
          <motion.button
            className="w-full text-xl font-bold py-5 rounded-2xl text-white"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: "#C8860A",
              fontFamily: "var(--font-fredoka), system-ui, sans-serif",
              boxShadow: "#A06808 0px 5px 0px",
            }}
          >
            🎬 Watch Videos
          </motion.button>
        </Link>
        <Link href="/leaderboard">
          <motion.button
            className="w-full text-xl font-bold py-5 rounded-2xl text-white"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: "#1B3A8C",
              fontFamily: "var(--font-fredoka), system-ui, sans-serif",
              boxShadow: "#0D1E56 0px 5px 0px",
            }}
          >
            🏆 Leaderboard
          </motion.button>
        </Link>
        <Link href="/" className="col-span-2">
          <motion.button
            className="w-full text-xl font-bold py-5 rounded-2xl text-white"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: "#2A7A3B",
              fontFamily: "var(--font-fredoka), system-ui, sans-serif",
              boxShadow: "#1A5C28 0px 5px 0px",
            }}
          >
            🎮 Play Games
          </motion.button>
        </Link>
      </div>
    </PageShell>
  );
}
