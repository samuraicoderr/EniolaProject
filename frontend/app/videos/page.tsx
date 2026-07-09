"use client";

import { useState } from "react";
import Link from "next/link";
import { useRequiredAuth } from "@/lib/api/auth/authContext";

interface VideoItem {
  id: string;
  title: string;
  category: "animals" | "colors" | "numbers" | "objects";
  embedId: string;
  age: string;
  thumbnail: string;
}

export default function VideosPage() {
  const auth = useRequiredAuth();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeEmbedId, setActiveEmbedId] = useState<string | null>(null);

  const videos: VideoItem[] = [
    {
      id: "1",
      title: "Farm Animals for Kids - Yoruba Names",
      category: "animals",
      embedId: "h2vSNA5Y5eM",
      age: "Ages 2-5",
      thumbnail: "🦁",
    },
    {
      id: "2",
      title: "Wild Animals Song & Yoruba Words",
      category: "animals",
      embedId: "Qp4uOQh6-P4",
      age: "Ages 2-5",
      thumbnail: "🦒",
    },
    {
      id: "3",
      title: "Animals Sounds & Names in Yoruba",
      category: "animals",
      embedId: "p5cT0kL1Vlo",
      age: "Ages 2-5",
      thumbnail: "🐘",
    },
    {
      id: "4",
      title: "Learning Colors in Yoruba - Color Crew",
      category: "colors",
      embedId: "yS68zG5yK1s",
      age: "Ages 2-5",
      thumbnail: "🎨",
    },
    {
      id: "5",
      title: "Rainbow Colors Song in Yoruba",
      category: "colors",
      embedId: "u-9e47Y3h_4",
      age: "Ages 2-5",
      thumbnail: "🌈",
    },
    {
      id: "6",
      title: "1 to 10 Counting Song (Onka Yoruba)",
      category: "numbers",
      embedId: "e7y12pL9wAo",
      age: "Ages 2-5",
      thumbnail: "🔢",
    },
    {
      id: "7",
      title: "Count to 20 in Yoruba - Kids Song",
      category: "numbers",
      embedId: "z8tP6Z9qF4w",
      age: "Ages 2-5",
      thumbnail: "🧮",
    },
    {
      id: "8",
      title: "Everyday Objects & Yoruba Names",
      category: "objects",
      embedId: "p6t48Z3yN8s",
      age: "Ages 2-5",
      thumbnail: "⚽",
    },
  ];

  const filteredVideos = activeCategory === "all"
    ? videos
    : videos.filter((v) => v.category === activeCategory);

  if (auth.isLoading || !auth.user) {
    return (
      <div className="min-h-screen bg-[#F2E1C0] flex items-center justify-center">
        <div className="text-center font-bold text-slate-800 text-xl animate-pulse">
          Loading Yoruba Videos...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[100dvh] relative overflow-hidden select-none bg-[#F2E1C0] flex flex-col justify-between">
      
      {/* Header */}
      <header className="w-full z-10 p-4 bg-amber-900 border-b-4 border-amber-950 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📺</span>
          <h1 className="text-xl md:text-2xl font-black tracking-tight font-logo">Watch & Learn</h1>
        </div>
        <div className="bg-amber-800 rounded-xl px-3 py-1 text-xs font-bold border border-amber-700">
          Kid-Safe Educational Videos
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-6 relative z-10">
        
        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {["all", "animals", "colors", "numbers", "objects"].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setActiveEmbedId(null);
              }}
              className={`px-5 py-2 rounded-full text-xs font-black uppercase border-2 transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-amber-600 text-white border-amber-800 shadow"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dynamic Video Player Frame */}
        {activeEmbedId && (
          <div className="w-full aspect-video rounded-3xl overflow-hidden border-4 border-amber-500 shadow-2xl mb-6 bg-black relative">
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
              className="absolute top-4 right-4 bg-red-600 hover:bg-red-500 text-white font-bold w-10 h-10 rounded-full border border-red-700 flex items-center justify-center cursor-pointer shadow-lg active:scale-90"
              title="Close video"
            >
              ❌
            </button>
          </div>
        )}

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => setActiveEmbedId(video.embedId)}
              className="bg-white/95 border-3 border-amber-500 rounded-3xl p-4 flex items-center gap-4 shadow cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-4xl shadow-inner flex-shrink-0">
                {video.thumbnail}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-slate-800 text-sm md:text-base truncate leading-tight">
                  {video.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {video.category}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    {video.age}
                  </span>
                </div>
              </div>
              <span className="text-3xl text-amber-600 hover:scale-110 transition-transform">▶️</span>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Nav */}
      <footer className="w-full z-10 bg-amber-900 border-t-4 border-amber-950 p-4">
        <div className="max-w-md mx-auto flex items-center justify-between text-white">
          <Link href="/" className="flex flex-col items-center gap-1 hover:text-amber-300 transition-colors">
            <span className="text-2xl">🎮</span>
            <span className="text-xs">Play</span>
          </Link>
          <Link href="/leaderboard" className="flex flex-col items-center gap-1 hover:text-amber-300 transition-colors">
            <span className="text-2xl">🏆</span>
            <span className="text-xs">Ranks</span>
          </Link>
          <Link href="/videos" className="flex flex-col items-center gap-1 text-amber-300 font-bold">
            <span className="text-2xl">📺</span>
            <span className="text-xs">Videos</span>
          </Link>
          <Link href="/coach" className="flex flex-col items-center gap-1 hover:text-amber-300 transition-colors">
            <span className="text-2xl">💬</span>
            <span className="text-xs">Coach</span>
          </Link>
          <Link href="/progress" className="flex flex-col items-center gap-1 hover:text-amber-300 transition-colors">
            <span className="text-2xl">👨‍👩‍👧</span>
            <span className="text-xs">Portal</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
