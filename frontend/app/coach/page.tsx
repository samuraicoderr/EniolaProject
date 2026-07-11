"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useRequiredAuth } from "@/lib/api/auth/authContext";
import YorubaService, {
  ChatMessageItem,
} from "@/lib/api/services/Yoruba.Service";
import { YorubaMascot } from "@/components/ui/YorubaMascot";

export default function CoachPage() {
  const auth = useRequiredAuth();
  const [active, setActive] = useState(true);
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const [mascotState, setMascotState] = useState<
    "idle" | "speaking" | "happy" | "thinking"
  >("idle");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch history and status
  useEffect(() => {
    if (auth.isAuthenticated) {
      YorubaService.getCoachStatusAndHistory()
        .then((data) => {
          setActive(data.active);
          setMessages(data.messages);
        })
        .catch((err) => {
          console.error("Error fetching coach data:", err);
        });
    }
  }, [auth.isAuthenticated]);

  // Scroll to bottom when message list changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const playVoice = (url: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setMascotState("speaking");
    const audio = new Audio(url);
    audioRef.current = audio;

    audio.onended = () => {
      setMascotState("idle");
    };

    audio.onerror = () => {
      setMascotState("idle");
      console.error("Audio playback error");
    };

    audio.play().catch((e) => {
      console.error("Play failed:", e);
      setMascotState("idle");
    });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text || sending) return;

    setInputText("");
    setSending(true);
    setMascotState("thinking");

    // Add user message locally
    const userMsg: ChatMessageItem = {
      id: Math.random().toString(),
      role: "user",
      text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const response = await YorubaService.sendCoachMessage(text);
      setMessages((prev) => [...prev, response]);
      setSending(false);

      if (response.audio_url) {
        playVoice(response.audio_url);
      } else {
        setMascotState("happy");
        setTimeout(() => setMascotState("idle"), 1500);
      }
    } catch (err: any) {
      console.error("Error sending chat message:", err);
      setSending(false);
      setMascotState("idle");

      const errorMsg: ChatMessageItem = {
        id: Math.random().toString(),
        role: "assistant",
        text:
          err.message ||
          "Oops! Something went wrong when connecting to Eniola.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  if (auth.isLoading || !auth.user) {
    return (
      <div className="min-h-screen bg-[#F2E1C0] flex items-center justify-center">
        <div className="text-center font-bold text-slate-800 text-xl animate-pulse">
          Loading Yoruba Coach...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[100dvh] relative overflow-hidden select-none bg-[#F2E1C0] flex flex-col justify-between">
      {/* Header */}
      <header className="w-full z-10 p-4 bg-amber-900 border-b-4 border-amber-950 flex items-center justify-between text-white flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💬</span>
          <h1 className="text-xl md:text-2xl font-black tracking-tight font-logo">
            Yoruba Coach
          </h1>
        </div>
        <div className="bg-green-700 text-white rounded-full px-3 py-1 text-xs font-bold border border-green-800 flex items-center gap-1.5 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-green-300" />
          Eniola is Online
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-4 flex flex-col min-h-0 relative z-10">
        {/* Animated Yoruba Mascot panel at the top */}
        <div className="flex flex-col items-center bg-white/95 border-4 border-amber-500 rounded-3xl p-4 shadow-xl mb-4 flex-shrink-0">
          <YorubaMascot state={mascotState} size={110} />
          <h2 className="text-lg font-black text-slate-800 mt-2 font-logo">
            Coach Eniola
          </h2>
          <p className="text-slate-500 text-xs font-semibold">
            &quot;Let&apos;s practice your Yoruba together! Ask me
            anything.&quot;
          </p>
        </div>

        {/* Message Log */}
        <div className="flex-1 bg-white/95 border-4 border-amber-500 rounded-3xl p-4 shadow-xl overflow-y-auto min-h-0 flex flex-col mb-4">
          <div className="flex-1 space-y-4">
            {/* Greeting */}
            <div className="flex justify-start">
              <div className="bg-amber-100 text-slate-800 font-medium px-4 py-3 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm border border-amber-200">
                Pẹlẹ o! (Hello!) I am Eniola, your Yoruba Coach. 🌟 Type a
                message below, and let&apos;s practice together!
              </div>
            </div>

            {messages.map((msg) => {
              const isUser = msg.role === "user";
              const bubbleClass = isUser
                ? "bg-[#1B3A8C] text-white rounded-tr-none border-[#152e70]"
                : "bg-amber-100 text-slate-800 rounded-tl-none border-amber-200";

              return (
                <div
                  key={msg.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-4 py-3 rounded-2xl max-w-[85%] shadow-sm border ${bubbleClass} flex flex-col`}
                  >
                    <span className="font-semibold text-sm md:text-base leading-relaxed">
                      {msg.text}
                    </span>
                    {msg.audio_url && (
                      <button
                        onClick={() => playVoice(msg.audio_url!)}
                        className="mt-2 self-start bg-amber-600 hover:bg-amber-500 text-white font-bold py-1 px-3 rounded-lg border border-amber-700 text-xs flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        🔊 Listen
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {sending && (
              <div className="flex justify-start">
                <div className="bg-amber-100 text-slate-400 font-bold px-4 py-3 rounded-2xl rounded-tl-none shadow-sm border border-amber-200 animate-pulse">
                  Eniola is typing... ✍️
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Disabled Overlay if keys are not set */}
        {!active && (
          <div className="absolute inset-x-4 top-[170px] bottom-20 bg-slate-900/90 rounded-3xl z-30 flex flex-col items-center justify-center p-6 text-center text-white">
            <span className="text-6xl animate-bounce">😴</span>
            <h3 className="text-xl font-black mt-4 font-logo">
              Eniola is sleeping...
            </h3>
            <p className="text-slate-400 text-sm max-w-xs mt-2 font-medium">
              Please tell your parent/admin to enter the Fal.ai and LLM keys in
              the Admin Settings so I can wake up and chat!
            </p>
            {auth.user.is_staff && (
              <Link
                href="/admin/dashboard"
                className="mt-6 bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 px-6 rounded-2xl border-2 border-amber-800 shadow transition-all"
              >
                Go to Admin Settings
              </Link>
            )}
          </div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={handleSend}
          className="w-full flex items-center gap-2 flex-shrink-0"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message in English or Yoruba..."
            disabled={sending || !active}
            className="flex-1 bg-white/95 border-3 border-amber-500 rounded-2xl px-4 py-3 text-slate-800 font-bold placeholder-slate-400 outline-none shadow focus:border-amber-600 transition-colors"
          />
          <button
            type="submit"
            disabled={sending || !active || !inputText.trim()}
            className="bg-[#1B3A8C] hover:bg-[#152e70] text-white font-bold p-3 rounded-2xl border-3 border-[#152e70] shadow flex-shrink-0 cursor-pointer disabled:opacity-50 transition-colors"
          >
            🚀
          </button>
        </form>
      </main>

      {/* Bottom Nav */}
      <footer className="w-full z-10 bg-amber-900 border-t-4 border-amber-950 p-4 flex-shrink-0">
        <div className="max-w-md mx-auto flex items-center justify-between text-white">
          <Link
            href="/"
            className="flex flex-col items-center gap-1 hover:text-amber-300 transition-colors"
          >
            <span className="text-2xl">🎮</span>
            <span className="text-xs">Play</span>
          </Link>
          <Link
            href="/leaderboard"
            className="flex flex-col items-center gap-1 hover:text-amber-300 transition-colors"
          >
            <span className="text-2xl">🏆</span>
            <span className="text-xs">Ranks</span>
          </Link>
          <Link
            href="/videos"
            className="flex flex-col items-center gap-1 hover:text-amber-300 transition-colors"
          >
            <span className="text-2xl">📺</span>
            <span className="text-xs">Videos</span>
          </Link>
          <Link
            href="/coach"
            className="flex flex-col items-center gap-1 text-amber-300 font-bold"
          >
            <span className="text-2xl">💬</span>
            <span className="text-xs">Coach</span>
          </Link>
          <Link
            href="/progress"
            className="flex flex-col items-center gap-1 hover:text-amber-300 transition-colors"
          >
            <span className="text-2xl">👨‍👩‍👧</span>
            <span className="text-xs">Portal</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
