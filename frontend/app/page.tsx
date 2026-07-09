"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useRequiredAuth } from "@/lib/api/auth/authContext";
import YorubaService, { UserProgressItem } from "@/lib/api/services/Yoruba.Service";
import { YorubaMascot } from "@/components/ui/YorubaMascot";

export default function Home() {
  const auth = useRequiredAuth();
  const router = useRouter();
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
          Loading Yoruba Adventure...
        </div>
      </div>
    );
  }

  const getCategoryStars = (category: string) => {
    const p = progress.find((item) => item.category === category);
    return p ? p.stars : 0;
  };

  const isCategoryCompleted = (category: string) => {
    const p = progress.find((item) => item.category === category);
    return p ? p.completed : false;
  };

  return (
    <div className="w-full min-h-[100dvh] relative overflow-hidden select-none bg-[#F2E1C0] flex flex-col justify-between">
      {/* Background SVG - Sky, hills, river, trees, clouds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <svg
          className="w-full h-full object-cover"
          viewBox="0 0 1280 720"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="hSky" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#5AB0E0" />
              <stop offset="55%" stopColor="#9ACFE8" />
              <stop offset="100%" stopColor="#BEEACF" />
            </linearGradient>
            <linearGradient id="hHillFar" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#56A8AB" />
              <stop offset="100%" stopColor="#368890" />
            </linearGradient>
            <linearGradient id="hHill1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#44B458" />
              <stop offset="100%" stopColor="#268C3E" />
            </linearGradient>
            <linearGradient id="hHill2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38A84E" />
              <stop offset="100%" stopColor="#1E8438" />
            </linearGradient>
            <linearGradient id="hGround" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4EBC62" />
              <stop offset="100%" stopColor="#28863A" />
            </linearGradient>
            <linearGradient id="hRiver" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#58A4C8" />
              <stop offset="50%" stopColor="#78CAE5" />
              <stop offset="100%" stopColor="#58A4C8" />
            </linearGradient>
          </defs>

          {/* Sky */}
          <rect width="1280" height="720" fill="url(#hSky)" />

          {/* Far Hills */}
          <path
            d="M0,330 Q100,185 210,262 Q320,160 440,278 Q560,148 660,242 Q780,138 900,252 Q1010,155 1110,234 Q1210,178 1280,212 L1280,380 L0,380Z"
            fill="url(#hHillFar)"
            opacity="0.7"
          />

          {/* Near Hill 1 */}
          <path
            d="M0,395 Q160,298 325,360 Q490,292 645,355 Q800,286 960,348 Q1120,290 1280,332 L1280,720 L0,720Z"
            fill="url(#hHill1)"
          />

          {/* Near Hill 2 */}
          <path
            d="M0,445 Q200,362 405,412 Q608,358 808,408 Q1004,358 1205,398 L1280,445 L1280,720 L0,720Z"
            fill="url(#hHill2)"
          />

          {/* Ground */}
          <path
            d="M0,502 Q165,454 325,494 Q485,448 645,488 Q806,447 962,484 Q1122,450 1280,470 L1280,720 L0,720Z"
            fill="url(#hGround)"
          />
          <rect x="0" y="585" width="1280" height="135" fill="#28883A" />

          {/* Winding River */}
          <path
            d="M510,720 Q528,658 568,620 Q618,572 645,542 Q664,516 662,492 Q660,468 638,453 Q618,438 618,422 Q618,382 660,362 Q702,342 712,312 Q722,282 700,250"
            stroke="url(#hRiver)"
            strokeWidth="50"
            fill="none"
            strokeLinecap="round"
          />

          {/* Winding Path / Dirt Road */}
          <path
            d="M195,720 Q248,642 302,582 Q362,512 434,492 Q512,472 604,492"
            stroke="#D4B870"
            strokeWidth="22"
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M1085,720 Q1044,652 984,592 Q924,536 844,512 Q764,492 702,492"
            stroke="#D4B870"
            strokeWidth="22"
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
          />
        </svg>

        {/* Floating Clouds */}
        <motion.div
          className="absolute top-10 w-24 h-12 bg-white/90 rounded-full blur-[1px]"
          animate={{ x: ["-10vw", "110vw"] }}
          transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
        />
        <motion.div
          className="absolute top-24 w-32 h-16 bg-white/80 rounded-full blur-[1px]"
          animate={{ x: ["110vw", "-10vw"] }}
          transition={{ repeat: Infinity, duration: 80, ease: "linear" }}
        />
      </div>

      {/* Header Panel */}
      <header className="w-full z-10 p-4 flex items-center justify-between bg-gradient-to-b from-black/20 to-transparent">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500 text-white rounded-full p-2.5 shadow-lg border border-amber-600">
            <span className="text-xl">🌟</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white text-xs font-bold uppercase tracking-wider">Total Stars</span>
            <span className="text-amber-300 text-2xl font-black drop-shadow-md">{totalStars} Stars</span>
          </div>
        </div>

        {/* Dashboard Title & Admin Control */}
        <div className="flex items-center gap-4">
          <h1 className="text-white text-xl md:text-3xl font-black tracking-tight drop-shadow-lg font-logo">
            YORÙBÁ ADVENTURE
          </h1>
          {auth.user.is_staff && (
            <Link
              href="/admin/dashboard"
              className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 px-4 rounded-xl border border-amber-700 shadow-md text-xs transition-colors flex items-center gap-1.5"
            >
              ⚙️ Admin Dashboard
            </Link>
          )}
        </div>
      </header>

      {/* Main Map Path Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 relative z-10 flex flex-col justify-center">
        
        {/* Animated Yoruba Mascot waving in the middle of the road */}
        <div className="absolute top-[40%] left-[45%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <YorubaMascot state="happy" size={140} />
        </div>

        {/* Grid / Layout of Category Nodes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 relative w-full pt-16 pb-24">
          
          {/* Node 1: Animals */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center"
          >
            <Link href="/game/animals" className="w-full flex flex-col items-center">
              <div className="w-36 h-36 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-4 border-white shadow-xl flex items-center justify-center relative cursor-pointer active:brightness-90 transition-all">
                <span className="text-6xl drop-shadow">🦁</span>
                {isCategoryCompleted("animals") && (
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-white rounded-full p-1.5 border-2 border-white text-xs">
                    ✅
                  </span>
                )}
              </div>
              <span className="mt-3 text-slate-800 text-lg font-black bg-white/95 px-4 py-1.5 rounded-full shadow border-2 border-green-500">
                Eranko (Animals)
              </span>
              <span className="text-amber-600 text-sm font-bold mt-1">
                ⭐ {getCategoryStars("animals")}/8
              </span>
            </Link>
          </motion.div>

          {/* Node 2: Colors */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center mt-12 md:mt-0"
          >
            <Link href="/game/colors" className="w-full flex flex-col items-center">
              <div className="w-36 h-36 rounded-full bg-gradient-to-br from-red-400 to-red-600 border-4 border-white shadow-xl flex items-center justify-center relative cursor-pointer active:brightness-90 transition-all">
                <span className="text-6xl drop-shadow">🎨</span>
                {isCategoryCompleted("colors") && (
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-white rounded-full p-1.5 border-2 border-white text-xs">
                    ✅
                  </span>
                )}
              </div>
              <span className="mt-3 text-slate-800 text-lg font-black bg-white/95 px-4 py-1.5 rounded-full shadow border-2 border-red-500">
                Awo (Colors)
              </span>
              <span className="text-amber-600 text-sm font-bold mt-1">
                ⭐ {getCategoryStars("colors")}/8
              </span>
            </Link>
          </motion.div>

          {/* Node 3: Numbers */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center"
          >
            <Link href="/game/numbers" className="w-full flex flex-col items-center">
              <div className="w-36 h-36 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-4 border-white shadow-xl flex items-center justify-center relative cursor-pointer active:brightness-90 transition-all">
                <span className="text-6xl drop-shadow">🔢</span>
                {isCategoryCompleted("numbers") && (
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-white rounded-full p-1.5 border-2 border-white text-xs">
                    ✅
                  </span>
                )}
              </div>
              <span className="mt-3 text-slate-800 text-lg font-black bg-white/95 px-4 py-1.5 rounded-full shadow border-2 border-blue-500">
                Onka (Numbers)
              </span>
              <span className="text-amber-600 text-sm font-bold mt-1">
                ⭐ {getCategoryStars("numbers")}/8
              </span>
            </Link>
          </motion.div>

          {/* Node 4: Objects */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center mt-12 md:mt-0"
          >
            <Link href="/game/objects" className="w-full flex flex-col items-center">
              <div className="w-36 h-36 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border-4 border-white shadow-xl flex items-center justify-center relative cursor-pointer active:brightness-90 transition-all">
                <span className="text-6xl drop-shadow">⚽</span>
                {isCategoryCompleted("objects") && (
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-white rounded-full p-1.5 border-2 border-white text-xs">
                    ✅
                  </span>
                )}
              </div>
              <span className="mt-3 text-slate-800 text-lg font-black bg-white/95 px-4 py-1.5 rounded-full shadow border-2 border-amber-500">
                Nkan (Objects)
              </span>
              <span className="text-amber-600 text-sm font-bold mt-1">
                ⭐ {getCategoryStars("objects")}/8
              </span>
            </Link>
          </motion.div>

        </div>
      </main>

      {/* Bottom Navigation Menu */}
      <footer className="w-full z-10 bg-amber-900 border-t-4 border-amber-950 p-4">
        <div className="max-w-md mx-auto flex items-center justify-between text-white">
          <Link href="/" className="flex flex-col items-center gap-1 text-amber-300 font-bold">
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
          <Link href="/coach" className="flex flex-col items-center gap-1 hover:text-amber-300 transition-colors relative">
            <span className="text-2xl">💬</span>
            <span className="text-xs">Coach</span>
            <span className="absolute -top-1 -right-1 bg-red-500 w-2.5 h-2.5 rounded-full animate-ping" />
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
