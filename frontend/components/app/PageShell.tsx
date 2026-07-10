"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useRequiredAuth } from "@/lib/api/auth/authContext";

interface PageShellProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  emoji: string;
  headerButton?: {
    label: string;
    href: string;
    bg?: string;
    color?: string;
    shadow?: string;
  };
  activeTab?: "play" | "ranks" | "videos" | "coach" | "portal";
  background?: "cream" | "dark";
  showBirds?: boolean;
  showBottomNav?: boolean;
}

function AnkaraPattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ opacity: 0.1 }}
    >
      <defs>
        <pattern
          id="ankara-pattern"
          x="0"
          y="0"
          width="64"
          height="64"
          patternUnits="userSpaceOnUse"
        >
          <polygon
            points="32,3 61,32 32,61 3,32"
            fill="none"
            stroke="#1B3A8C"
            strokeWidth="1.8"
          />
          <polygon
            points="32,14 50,32 32,50 14,32"
            fill="none"
            stroke="#D4A017"
            strokeWidth="1.4"
          />
          <circle cx="0" cy="0" r="3.5" fill="#C0392B" />
          <circle cx="64" cy="0" r="3.5" fill="#C0392B" />
          <circle cx="0" cy="64" r="3.5" fill="#C0392B" />
          <circle cx="64" cy="64" r="3.5" fill="#C0392B" />
          <circle cx="32" cy="32" r="3.5" fill="#D4A017" />
          <circle cx="32" cy="0" r="2" fill="#1B3A8C" />
          <circle cx="32" cy="64" r="2" fill="#1B3A8C" />
          <circle cx="0" cy="32" r="2" fill="#1B3A8C" />
          <circle cx="64" cy="32" r="2" fill="#1B3A8C" />
          <line
            x1="3"
            y1="32"
            x2="14"
            y2="32"
            stroke="#1B3A8C"
            strokeWidth="1"
          />
          <line
            x1="50"
            y1="32"
            x2="61"
            y2="32"
            stroke="#1B3A8C"
            strokeWidth="1"
          />
          <line
            x1="32"
            y1="3"
            x2="32"
            y2="14"
            stroke="#1B3A8C"
            strokeWidth="1"
          />
          <line
            x1="32"
            y1="50"
            x2="32"
            y2="61"
            stroke="#1B3A8C"
            strokeWidth="1"
          />
          <polygon points="32,14 41,23 32,23" fill="#D4A017" opacity="0.5" />
          <polygon points="32,50 41,41 32,41" fill="#D4A017" opacity="0.5" />
          <polygon points="14,32 23,23 23,32" fill="#C0392B" opacity="0.5" />
          <polygon points="50,32 41,41 41,32" fill="#C0392B" opacity="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ankara-pattern)" />
    </svg>
  );
}

function FlyingBirds() {
  const birds = [
    {
      top: "8%",
      opacity: 0.55,
      duration: 26,
      delay: 0,
      color: "#1B3A8C",
      scale: 1.1,
      rtl: false,
    },
    {
      top: "18%",
      opacity: 0.45,
      duration: 34,
      delay: -8,
      color: "#B5451B",
      scale: 0.8,
      rtl: false,
    },
    {
      top: "28%",
      opacity: 0.6,
      duration: 20,
      delay: -15,
      color: "#1B3A8C",
      scale: 1.4,
      rtl: true,
    },
    {
      top: "12%",
      opacity: 0.4,
      duration: 40,
      delay: -22,
      color: "#2A7A3B",
      scale: 0.7,
      rtl: false,
    },
    {
      top: "22%",
      opacity: 0.5,
      duration: 28,
      delay: -5,
      color: "#C8860A",
      scale: 1.2,
      rtl: true,
    },
    {
      top: "6%",
      opacity: 0.45,
      duration: 32,
      delay: -18,
      color: "#1B3A8C",
      scale: 0.9,
      rtl: false,
    },
    {
      top: "32%",
      opacity: 0.38,
      duration: 38,
      delay: -28,
      color: "#B5451B",
      scale: 0.6,
      rtl: true,
    },
  ];

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
      style={{ zIndex: 5 }}
    >
      <style>{`
        @keyframes flyLTR {
          0% { transform: translateX(-120px); }
          100% { transform: translateX(calc(100vw + 120px)); }
        }
        @keyframes flyRTL {
          0% { transform: translateX(calc(100vw + 120px)) scaleX(-1); }
          100% { transform: translateX(-120px) scaleX(-1); }
        }
        @keyframes wingFlap {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.55); }
        }
      `}</style>
      {birds.map((bird, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            top: bird.top,
            opacity: bird.opacity,
            animation: `${bird.rtl ? "flyRTL" : "flyLTR"} ${bird.duration}s linear ${bird.delay}s infinite`,
            transformOrigin: "center center",
          }}
        >
          <div
            style={{
              animation: `wingFlap 0.6s ease-in-out infinite`,
              transformOrigin: "center bottom",
            }}
          >
            <svg
              width={36 * bird.scale}
              height={14 * bird.scale}
              viewBox="0 0 36 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M0 10C5 2 11 0 18 5"
                stroke={bird.color}
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M36 10C31 2 25 0 18 5"
                stroke={bird.color}
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}

const bottomNavItems = [
  { href: "/", label: "Play", emoji: "🎮" },
  { href: "/leaderboard", label: "Ranks", emoji: "🏆" },
  { href: "/videos", label: "Videos", emoji: "📺" },
  { href: "/coach", label: "Coach", emoji: "💬" },
  { href: "/progress", label: "Portal", emoji: "👨‍👩‍👧" },
];

export function PageShell({
  children,
  title,
  subtitle,
  emoji,
  headerButton,
  activeTab,
  background = "cream",
  showBirds = false,
  showBottomNav = false,
}: PageShellProps) {
  const auth = useRequiredAuth();
  const isDark = background === "dark";

  const buttonBg = headerButton?.bg ?? (isDark ? "#D4A017" : "#1B3A8C");
  const buttonColor = headerButton?.color ?? (isDark ? "#1B3A8C" : "#FFFBF0");
  const buttonShadow = headerButton?.shadow ?? (isDark ? "#A06808" : "#0D1E56");
  const buttonLabel = headerButton?.label ?? "← Home";
  const buttonHref = headerButton?.href ?? "/";

  return (
    <div
      className="min-h-[100dvh] w-full flex flex-col relative overflow-hidden"
      style={{
        background: isDark
          ? "linear-gradient(160deg, #17224f 0%, #273468 50%, #1c2340 100%)"
          : "linear-gradient(160deg, #f4e7cd 0%, #edd8b6 100%)",
      }}
    >
      <AnkaraPattern />
      {showBirds && <FlyingBirds />}

      {/* Top stripe */}
      <div
        className="h-5 flex-shrink-0 z-10"
        style={{
          background: isDark
            ? "repeating-linear-gradient(90deg, #D4A017 0px, #D4A017 20px, #B5451B 20px, #B5451B 40px, #2A7A3B 40px, #2A7A3B 60px, #FFFBF0 60px, #FFFBF0 80px)"
            : "repeating-linear-gradient(90deg, #C8860A 0px, #C8860A 24px, #1B3A8C 24px, #1B3A8C 48px, #B5451B 48px, #B5451B 72px, #2A7A3B 72px, #2A7A3B 96px)",
        }}
      />

      {/* Main content */}
      <main className="w-full max-w-5xl mx-auto px-4 pt-6 z-10 relative flex-1 flex flex-col pb-28">
        {/* Header */}
        <motion.div
          className="flex items-center gap-4 mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <Link href={buttonHref}>
            <motion.button
              className="text-xl font-bold px-5 py-3 rounded-2xl shadow-md flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: buttonBg,
                color: buttonColor,
                fontFamily: "var(--font-fredoka), system-ui, sans-serif",
                boxShadow: `${buttonShadow} 0px 4px 0px`,
              }}
            >
              {buttonLabel}
            </motion.button>
          </Link>
          <div>
            <h1
              className="text-3xl md:text-4xl font-bold"
              style={{
                color: isDark ? "#FFFBF0" : "#1B3A8C",
                fontFamily: "var(--font-fredoka), system-ui, sans-serif",
                textShadow: isDark
                  ? "2px 2px 0px #D4A017"
                  : "1px 2px 0px #D4A017",
              }}
            >
              {emoji} {title}
            </h1>
            <p
              className="text-sm font-semibold"
              style={{ color: isDark ? "#D4A017" : "#B5451B" }}
            >
              {subtitle}
            </p>
          </div>
        </motion.div>

        {children}
      </main>

      {/* Bottom nav */}
      {showBottomNav && (
        <footer
          className="w-full z-10 p-4 fixed bottom-0 left-0 right-0"
          style={{
            background: "rgba(120, 53, 15, 0.95)",
            borderTop: "4px solid #5c2b0e",
          }}
        >
          <div className="max-w-md mx-auto flex items-center justify-between text-white">
            {bottomNavItems.map((item) => {
              const isActive = activeTab === item.label.toLowerCase();
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-1 transition-colors ${
                    isActive
                      ? "text-amber-300 font-bold"
                      : "hover:text-amber-300"
                  }`}
                >
                  <motion.span
                    className="text-2xl"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {item.emoji}
                  </motion.span>
                  <span className="text-xs">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </footer>
      )}
    </div>
  );
}

export function PageCard({
  children,
  className = "",
  borderColor = "#D4A017",
  shadowColor,
  padding = "p-6",
  hasStripes = true,
}: {
  children: React.ReactNode;
  className?: string;
  borderColor?: string;
  shadowColor?: string;
  padding?: string;
  hasStripes?: boolean;
}) {
  const shadow =
    shadowColor ?? (borderColor === "#D4A017" ? "#A06808" : borderColor);
  return (
    <motion.div
      className={`rounded-[2rem] shadow-xl relative overflow-hidden ${padding} ${className}`}
      style={{
        background: "#FFFBF0",
        border: `5px solid ${borderColor}`,
        boxShadow: `${shadow} 0px 7px 0px`,
      }}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
    >
      {hasStripes && (
        <div
          className="absolute top-0 left-0 right-0 h-3"
          style={{
            background: `repeating-linear-gradient(90deg, ${borderColor} 0px, ${borderColor} 16px, #D4A017 16px, #D4A017 32px, #B5451B 32px, #B5451B 48px)`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
