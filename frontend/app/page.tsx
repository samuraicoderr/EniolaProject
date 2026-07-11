"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useRequiredAuth } from "@/lib/api/auth/authContext";
import YorubaService from "@/lib/api/services/Yoruba.Service";
import { HomeBackground } from "@/components/app/home/HomeBackground";
import {
  CategoryCard,
  AnimalIcon,
  NumbersIcon,
  ObjectsIcon,
  ColorsIcon,
} from "@/components/app/home/CategoryCard";
import { HomeNav } from "@/components/app/home/HomeNav";
import { SmartAvatar } from "@/components/ui/SmartAvatar";

export default function Home() {
  const auth = useRequiredAuth();
  const [totalStars, setTotalStars] = useState(0);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (auth.isAuthenticated) {
      YorubaService.getProgress()
        .then((data) => {
          const stars = data.reduce((acc, curr) => acc + curr.stars, 0);
          setTotalStars(stars);
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
          Loading Vocab Adventure...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[100dvh] relative overflow-hidden select-none bg-[#F2E1C0]">
      {/* Scenic background */}
      <HomeBackground />

      {/* Title banner */}
      <motion.div
        className="absolute top-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <div
          className="flex gap-3 px-7 py-2.5 rounded-full shadow-2xl text-center whitespace-nowrap"
          style={{
            background: "rgba(255, 251, 240, 0.95)",
            border: "4px solid #D4A017",
            color: "#1B3A8C",
            fontFamily: "var(--font-fredoka), system-ui, sans-serif",
            fontSize: "clamp(18px, 2.6vw, 32px)",
            boxShadow: "#A06808 0px 6px 0px, rgba(0, 0, 0, 0.25) 0px 10px 30px",
          }}
        >
          <span>Vocab Adventure </span>
          <SmartAvatar useSignedInUser={true} size={40} className="inline" />
        </div>
      </motion.div>

      {/* Stars counter */}
      <motion.div
        className="absolute z-30 flex items-center gap-2 px-4 py-2 rounded-full shadow-xl"
        data-testid="text-stars-count"
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        style={{
          top: "1rem",
          right: "1rem",
          background: "#D4A017",
          border: "3px solid #A06808",
          boxShadow: "#A06808 0px 4px 0px",
        }}
      >
        <span style={{ fontSize: "clamp(18px, 2.2vw, 26px)" }}>⭐</span>
        <span
          className="font-bold"
          style={{
            color: "#FFFBF0",
            fontFamily: "var(--font-fredoka), system-ui, sans-serif",
            fontSize: "clamp(18px, 2.2vw, 26px)",
          }}
        >
          {totalStars}
        </span>
      </motion.div>

      {/* Category cards */}
      <CategoryCard
        href="/game/animals"
        position={{ top: "8%", left: "2%" }}
        icon={<AnimalIcon />}
        emoji="🦁"
        label="Animals"
        bg="#B5451B"
        shadow="#8B3010"
        testId="button-category-Animals"
      />
      <CategoryCard
        href="/game/numbers"
        position={{ top: "6%", right: "2%" }}
        icon={<NumbersIcon />}
        emoji="🔢"
        label="Numbers"
        bg="#1B3A8C"
        shadow="#0D1E56"
        testId="button-category-Numbers"
      />
      <CategoryCard
        href="/game/objects"
        position={{ bottom: "12%", left: "1%" }}
        icon={<ObjectsIcon />}
        emoji="🧸"
        label="Objects"
        bg="#2A7A3B"
        shadow="#1A5C28"
        testId="button-category-Objects"
      />
      <CategoryCard
        href="/game/colors"
        position={{ bottom: "11%", right: "1%" }}
        icon={<ColorsIcon />}
        emoji="🎨"
        label="Colors"
        bg="#8B2E8B"
        shadow="#5A1A5A"
        testId="button-category-Colors"
      />

      {/* Bottom navigation */}
      <HomeNav
        isAdmin={auth.user.is_admin ?? auth.user.is_staff ?? false}
        onLogout={() => auth.logout()}
      />

      {/* Mute button */}
      <motion.button
        className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-xl text-xl sm:text-2xl transition-all"
        aria-label={muted ? "Unmute sound" : "Mute sound"}
        title={muted ? "Turn sound on" : "Turn sound off"}
        onClick={() => setMuted((m) => !m)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          background: "#D4A017",
          border: "3px solid #A06808",
          boxShadow: "#7A4F06 0px 5px 0px, rgba(0, 0, 0, 0.25) 0px 8px 16px",
        }}
      >
        {muted ? "🔇" : "🔊"}
      </motion.button>
    </div>
  );
}
