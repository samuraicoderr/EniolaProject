"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRequiredAuth } from "@/lib/api/auth/authContext";
import YorubaService, { UserProgressItem } from "@/lib/api/services/Yoruba.Service";

export default function ProgressPage() {
  const auth = useRequiredAuth();
  const [progress, setProgress] = useState<UserProgressItem[]>([]);
  const [totalStars, setTotalStars] = useState(0);

  useEffect(() => {
    if (auth.isAuthenticated) {
      YorubaService.getProgress()
        .then((data) => {
          setProgress(data);
          const stars = data.reduce((acc, curr) => acc + curr.stars, 0);
          setTotalStars(stars);
        })
        .catch((err) => console.error("Error fetching progress:", err));
    }
  }, [auth.isAuthenticated]);

  if (auth.isLoading || !auth.user) {
    return (
      <div className="min-h-screen bg-[#F2E1C0] flex items-center justify-center">
        <div className="text-center font-bold text-slate-800 text-xl animate-pulse">
          Loading Progress Portal...
        </div>
      </div>
    );
  }

  const categories = [
    { key: "animals", label: "Eranko (Animals)", emoji: "🦁", color: "border-green-500 text-green-700 bg-green-50" },
    { key: "colors", label: "Awo (Colors)", emoji: "🎨", color: "border-red-500 text-red-700 bg-red-50" },
    { key: "numbers", label: "Onka (Numbers)", emoji: "🔢", color: "border-blue-500 text-blue-700 bg-blue-50" },
    { key: "objects", label: "Nkan (Objects)", emoji: "⚽", color: "border-amber-500 text-amber-700 bg-amber-50" },
  ];

  const getCategoryProgress = (key: string) => {
    return progress.find((p) => p.category === key) || { stars: 0, completed: false };
  };

  return (
    <div className="w-full min-h-[100dvh] relative overflow-hidden select-none bg-[#F2E1C0] flex flex-col justify-between">
      
      {/* Header */}
      <header className="w-full z-10 p-4 bg-amber-900 border-b-4 border-amber-950 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <span className="text-2xl">👨‍👩‍👧</span>
          <h1 className="text-xl md:text-2xl font-black tracking-tight font-logo">Parent Portal</h1>
        </div>
        <button
          onClick={() => auth.logout()}
          className="bg-red-700 hover:bg-red-600 text-white font-bold py-1.5 px-4 rounded-xl border border-red-800 text-xs transition-colors"
        >
          Log out
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-8 relative z-10">
        <div className="bg-white/95 border-4 border-amber-500 rounded-3xl p-6 shadow-xl mb-8">
          <div className="flex items-center gap-4 border-b border-slate-200 pb-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-3xl shadow">
              🧑‍🎓
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800">{auth.user.first_name || auth.user.username}</h2>
              <p className="text-slate-500 text-xs font-semibold">Active Learner Profile</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">Total Stars</span>
              <span className="text-3xl font-black text-amber-500 block">⭐ {totalStars}</span>
            </div>
            <div className="bg-green-50 rounded-2xl p-3 border border-green-200">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">Completed Topics</span>
              <span className="text-3xl font-black text-green-600 block">
                {progress.filter((p) => p.completed).length} / 4
              </span>
            </div>
          </div>
        </div>

        {/* Categories Progress List */}
        <h3 className="text-lg font-black text-amber-950 mb-4 px-2">Learning by Category</h3>
        
        <div className="space-y-4">
          {categories.map((cat) => {
            const { stars, completed } = getCategoryProgress(cat.key);
            
            return (
              <div
                key={cat.key}
                className={`border-3 rounded-2xl p-4 flex items-center justify-between shadow ${cat.color}`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{cat.emoji}</span>
                  <div>
                    <h4 className="font-black text-slate-800 text-lg">{cat.label}</h4>
                    <span className="text-slate-500 text-xs font-semibold">
                      Stars Earned: {stars} / 8
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full border">
                    {completed ? "Completed ✅" : "In Progress 🚀"}
                  </span>
                  <Link
                    href={`/game/${cat.key}`}
                    className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-1.5 px-4 rounded-xl border border-amber-700 text-xs transition-colors"
                  >
                    Play
                  </Link>
                </div>
              </div>
            );
          })}
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
          <Link href="/videos" className="flex flex-col items-center gap-1 hover:text-amber-300 transition-colors">
            <span className="text-2xl">📺</span>
            <span className="text-xs">Videos</span>
          </Link>
          <Link href="/coach" className="flex flex-col items-center gap-1 hover:text-amber-300 transition-colors">
            <span className="text-2xl">💬</span>
            <span className="text-xs">Coach</span>
          </Link>
          <Link href="/progress" className="flex flex-col items-center gap-1 text-amber-300 font-bold">
            <span className="text-2xl">👨‍👩‍👧</span>
            <span className="text-xs">Portal</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
