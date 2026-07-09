"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRequiredAuth } from "@/lib/api/auth/authContext";
import YorubaService, { LeaderboardUser } from "@/lib/api/services/Yoruba.Service";

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
      <div className="min-h-screen bg-[#F2E1C0] flex items-center justify-center">
        <div className="text-center font-bold text-slate-800 text-xl animate-pulse">
          Loading Leaderboard...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[100dvh] relative overflow-hidden select-none bg-[#F2E1C0] flex flex-col justify-between">
      
      {/* Header */}
      <header className="w-full z-10 p-4 bg-amber-900 border-b-4 border-amber-950 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏆</span>
          <h1 className="text-xl md:text-2xl font-black tracking-tight font-logo">Leaderboard</h1>
        </div>
        <div className="bg-amber-800 rounded-xl px-3 py-1 text-xs font-bold border border-amber-700">
          Top Star Earners
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-xl mx-auto px-4 py-8 relative z-10 overflow-y-auto">
        <div className="bg-white/95 border-4 border-amber-500 rounded-3xl p-6 shadow-xl mb-6 text-center">
          <h2 className="text-xl md:text-2xl font-black text-[#1B3A8C] font-logo">Weekly Champions! 🌟</h2>
          <p className="text-slate-500 text-xs mt-1 font-semibold">Keep learning Yoruba to climb to the top of the chart!</p>
        </div>

        {/* Leaderboard List */}
        <div className="bg-white/95 border-4 border-amber-500 rounded-3xl overflow-hidden shadow-xl">
          <div className="divide-y divide-slate-100">
            {leaders.map((leader) => {
              // Highlight user
              const rowBg = leader.is_self ? "bg-amber-100 font-bold" : "";
              const rankIcon = 
                leader.rank === 1 ? "🥇" :
                leader.rank === 2 ? "🥈" :
                leader.rank === 3 ? "🥉" :
                `#${leader.rank}`;

              return (
                <div
                  key={leader.username}
                  className={`p-4 flex items-center justify-between transition-colors ${rowBg}`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-black text-slate-800 w-8 text-center">{rankIcon}</span>
                    <div className="flex flex-col">
                      <span className="text-slate-800 font-black">
                        {leader.first_name || leader.username} {leader.is_self && "(You)"}
                      </span>
                      <span className="text-slate-400 text-xs font-semibold">@{leader.username}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5 shadow-sm">
                    <span className="text-base">⭐</span>
                    <span className="text-amber-600 font-black text-base">{leader.stars}</span>
                  </div>
                </div>
              );
            })}

            {leaders.length === 0 && (
              <div className="p-8 text-center text-slate-400 font-semibold">
                No star records found yet. Play a game to start!
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Bottom Nav */}
      <footer className="w-full z-10 bg-amber-900 border-t-4 border-amber-950 p-4">
        <div className="max-w-md mx-auto flex items-center justify-between text-white">
          <Link href="/" className="flex flex-col items-center gap-1 hover:text-amber-300 transition-colors">
            <span className="text-2xl">🎮</span>
            <span className="text-xs">Play</span>
          </Link>
          <Link href="/leaderboard" className="flex flex-col items-center gap-1 text-amber-300 font-bold">
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
          <Link href="/progress" className="flex flex-col items-center gap-1 hover:text-amber-300 transition-colors">
            <span className="text-2xl">👨‍👩‍👧</span>
            <span className="text-xs">Portal</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
