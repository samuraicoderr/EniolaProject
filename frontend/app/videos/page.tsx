"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRequiredAuth } from "@/lib/api/auth/authContext";
import { PageShell, PageCard } from "@/components/app/PageShell";

interface VideoItem {
  id: string;
  title: string;
  category: "animals" | "colors" | "numbers" | "objects";
  embedId: string;
  age: string;
  thumbnailUrl: string;
  emoji: string;
}

const categories: {
  key: string;
  label: string;
  emoji: string;
  color: string;
}[] = [
  { key: "all", label: "All", emoji: "🎬", color: "#D4A017" },
  { key: "animals", label: "Animals", emoji: "🦁", color: "#B5451B" },
  { key: "colors", label: "Colors", emoji: "🎨", color: "#1B3A8C" },
  { key: "numbers", label: "Numbers", emoji: "🔢", color: "#C8860A" },
  { key: "objects", label: "Objects", emoji: "🧸", color: "#2A7A3B" },
];

const videos: VideoItem[] = [
  {
    id: "1",
    title: "Farm Animals for Kids",
    category: "animals",
    embedId: "h2vSNA5Y5eM",
    age: "Ages 2–5",
    thumbnailUrl: "/videos/mqdefault.jpg",
    emoji: "🦁",
  },
  {
    id: "2",
    title: "Wild Animals Song",
    category: "animals",
    embedId: "Qp4uOQh6-P4",
    age: "Ages 2–5",
    thumbnailUrl: "/videos/mqdefault1.jpg",
    emoji: "🦒",
  },
  {
    id: "3",
    title: "Animals Sounds & Names",
    category: "animals",
    embedId: "p5cT0kL1Vlo",
    age: "Ages 2–5",
    thumbnailUrl: "/videos/mqdefault2.jpg",
    emoji: "🐘",
  },
  {
    id: "4",
    title: "Learning Colors – Color Crew",
    category: "colors",
    embedId: "yS68zG5yK1s",
    age: "Ages 2–5",
    thumbnailUrl: "/videos/mqdefault3.jpg",
    emoji: "🎨",
  },
  {
    id: "5",
    title: "Rainbow Colors Song",
    category: "colors",
    embedId: "u-9e47Y3h_4",
    age: "Ages 2–5",
    thumbnailUrl: "/videos/mqdefault4.jpg",
    emoji: "🌈",
  },
  {
    id: "6",
    title: "What Color Is It? – Toddler Colors",
    category: "colors",
    embedId: "xYz123abc",
    age: "Ages 2–5",
    thumbnailUrl: "/videos/mqdefault5.jpg",
    emoji: "🎨",
  },
  {
    id: "7",
    title: "1 to 10 Counting Song",
    category: "numbers",
    embedId: "e7y12pL9wAo",
    age: "Ages 2–5",
    thumbnailUrl: "/videos/mqdefault6.jpg",
    emoji: "🔢",
  },
  {
    id: "8",
    title: "Count to 20 – Kids Number Song",
    category: "numbers",
    embedId: "z8tP6Z9qF4w",
    age: "Ages 2–5",
    thumbnailUrl: "/videos/mqdefault7.jpg",
    emoji: "🧮",
  },
  {
    id: "9",
    title: "Numbers 1–10 for Toddlers",
    category: "numbers",
    embedId: "nUm123xyz",
    age: "Ages 2–5",
    thumbnailUrl: "/videos/mqdefault8.jpg",
    emoji: "🔢",
  },
  {
    id: "10",
    title: "Things at Home – Vocabulary for Kids",
    category: "objects",
    embedId: "p6t48Z3yN8s",
    age: "Ages 2–5",
    thumbnailUrl: "/videos/mqdefault9.jpg",
    emoji: "🧸",
  },
  {
    id: "11",
    title: "Everyday Objects Song",
    category: "objects",
    embedId: "objSong123",
    age: "Ages 2–5",
    thumbnailUrl: "/videos/mqdefault10.jpg",
    emoji: "⚽",
  },
  {
    id: "12",
    title: "Body Parts & Objects Song",
    category: "objects",
    embedId: "bodyObj123",
    age: "Ages 2–5",
    thumbnailUrl: "/videos/mqdefault11.jpg",
    emoji: "🪑",
  },
];

function getCategoryColor(category: string) {
  switch (category) {
    case "animals":
      return "#B5451B";
    case "colors":
      return "#1B3A8C";
    case "numbers":
      return "#C8860A";
    case "objects":
      return "#2A7A3B";
    default:
      return "#B5451B";
  }
}

export default function VideosPage() {
  const auth = useRequiredAuth();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeEmbedId, setActiveEmbedId] = useState<string | null>(null);

  const filteredVideos =
    activeCategory === "all"
      ? videos
      : videos.filter((v) => v.category === activeCategory);

  if (auth.isLoading || !auth.user) {
    return (
      <div className="min-h-screen bg-[#F2E1C0] flex items-center justify-center">
        <div
          className="text-center font-bold text-[#1B3A8C] text-xl animate-pulse"
          style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
        >
          Loading Yoruba Videos...
        </div>
      </div>
    );
  }

  return (
    <PageShell
      title="Watch & Learn"
      subtitle="Kid-safe educational videos"
      emoji="🎬"
      activeTab="videos"
    >
      {/* Category filters */}
      <motion.div
        className="flex gap-3 overflow-x-auto pb-2 mb-6 scrollbar-hide"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat.key;
          return (
            <motion.button
              key={cat.key}
              onClick={() => {
                setActiveCategory(cat.key);
                setActiveEmbedId(null);
              }}
              className="flex-shrink-0 px-6 py-3 rounded-full text-lg font-bold transition-all shadow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: isActive ? cat.color : "#FFFBF0",
                color: isActive ? "#FFFBF0" : cat.color,
                border: `3px solid ${cat.color}`,
                fontFamily: "var(--font-fredoka), system-ui, sans-serif",
                boxShadow: isActive ? `${cat.color}80 0px 4px 0px` : "none",
              }}
            >
              {cat.emoji} {cat.label}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Active video player */}
      <AnimatePresence>
        {activeEmbedId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full aspect-video rounded-[1.8rem] overflow-hidden border-4 border-[#D4A017] shadow-2xl mb-6 bg-black relative"
            style={{
              boxShadow: "#A06808 0px 6px 0px, rgba(0,0,0,0.25) 0px 10px 30px",
            }}
          >
            <iframe
              src={`https://www.youtube.com/embed/${activeEmbedId}?autoplay=1`}
              title="Yoruba Video Player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
            <button
              onClick={() => setActiveEmbedId(null)}
              className="absolute top-4 right-4 bg-[#C0392B] hover:bg-[#A93226] text-white font-bold w-10 h-10 rounded-full border-2 border-[#8B1A1A] flex items-center justify-center cursor-pointer shadow-lg active:scale-90 transition-colors"
              title="Close video"
            >
              ❌
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        layout
      >
        <AnimatePresence mode="popLayout">
          {filteredVideos.map((video, index) => {
            const color = getCategoryColor(video.category);
            return (
              <motion.button
                key={video.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setActiveEmbedId(video.embedId)}
                className="text-left rounded-[1.8rem] shadow-lg overflow-hidden flex flex-col w-full relative"
                style={{
                  background: "#FFFBF0",
                  border: `4px solid ${color}`,
                  boxShadow: `${color}80 0px 5px 0px`,
                }}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className="h-2"
                  style={{
                    background: `repeating-linear-gradient(90deg, ${color} 0px, ${color} 10px, #D4A017 10px, #D4A017 20px)`,
                  }}
                />
                <div
                  className="relative w-full overflow-hidden"
                  style={{ paddingBottom: "56.25%", background: "#1a1a2e" }}
                >
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        `https://img.youtube.com/vi/${video.embedId}/mqdefault.jpg`;
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-[#1B3A8C]/65">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                      style={{ background: "#D4A017" }}
                    >
                      <span className="text-3xl ml-1">▶</span>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{video.emoji}</span>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full capitalize"
                      style={{
                        background: `${color}22`,
                        color,
                      }}
                    >
                      {video.category}
                    </span>
                  </div>
                  <p
                    className="text-base font-bold leading-snug"
                    style={{
                      color: "#1B3A8C",
                      fontFamily: "var(--font-fredoka), system-ui, sans-serif",
                    }}
                  >
                    {video.title}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#9A8060" }}>
                    {video.age}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {filteredVideos.length === 0 && (
        <PageCard className="text-center py-12 mt-6">
          <div className="text-6xl mb-4">🔍</div>
          <p
            className="text-2xl font-bold"
            style={{
              color: "#1B3A8C",
              fontFamily: "var(--font-fredoka), system-ui, sans-serif",
            }}
          >
            No videos in this category yet!
          </p>
          <p className="text-base mt-2" style={{ color: "#5A4020" }}>
            Pick another category to keep watching.
          </p>
        </PageCard>
      )}
    </PageShell>
  );
}
