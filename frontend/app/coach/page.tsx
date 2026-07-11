"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useRequiredAuth } from "@/lib/api/auth/authContext";
import YorubaService, {
  ChatMessageItem,
} from "@/lib/api/services/Yoruba.Service";
import { YorubaMascot } from "@/components/ui/YorubaMascot";
import { PageShell, PageCard } from "@/components/app/PageShell";

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Oops! Something went wrong when connecting to Eniola.";
}

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
  const idCounterRef = useRef(0);

  const nextMessageId = () => {
    idCounterRef.current += 1;
    return `coach-msg-${idCounterRef.current}`;
  };

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
      id: nextMessageId(),
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
    } catch (err) {
      console.error("Error sending chat message:", err);
      setSending(false);
      setMascotState("idle");

      const errorMsg: ChatMessageItem = {
        id: nextMessageId(),
        role: "assistant",
        text: getErrorMessage(err),
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  if (auth.isLoading || !auth.user) {
    return (
      <div className="min-h-screen bg-[#F2E1C0] flex items-center justify-center">
        <div
          className="text-center font-bold text-[#1B3A8C] text-xl animate-pulse"
          style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
        >
          Loading Yoruba Coach...
        </div>
      </div>
    );
  }

  const isAdmin = auth.user.is_admin ?? auth.user.is_staff ?? false;

  return (
    <PageShell
      title="Yoruba Coach"
      subtitle="Chat with Eniola, your Yoruba learning assistant"
      emoji="💬"
      activeTab="coach"
      showBottomNav
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mascot panel */}
        <motion.div
          className="lg:col-span-1"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <PageCard
            borderColor="#8B2E8B"
            shadowColor="#5A1A5A"
            padding="p-6"
            className="text-center h-full"
          >
            <YorubaMascot state={mascotState} size={140} />
            <h2
              className="text-2xl font-black mt-4"
              style={{
                color: "#1B3A8C",
                fontFamily: "var(--font-fredoka), system-ui, sans-serif",
              }}
            >
              Coach Eniola
            </h2>
            <p className="text-[#5A4020] text-sm font-medium mt-1">
              &quot;Let&apos;s practice your Yoruba together! Ask me
              anything.&quot;
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 bg-green-100 text-green-700 border border-green-300 rounded-full px-3 py-1 text-xs font-black">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Eniola is Online
            </div>
          </PageCard>
        </motion.div>

        {/* Chat log */}
        <motion.div
          className="lg:col-span-2 flex flex-col"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <PageCard
            borderColor="#8B2E8B"
            shadowColor="#5A1A5A"
            padding="p-0"
            className="flex flex-col h-[60vh] lg:h-[65vh] relative"
          >
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Greeting */}
              <div className="flex justify-start">
                <div
                  className="font-semibold px-4 py-3 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm border"
                  style={{
                    background: "#F3E8F3",
                    color: "#1B3A8C",
                    borderColor: "#D8BFD8",
                  }}
                >
                  Pẹlẹ o! (Hello!) I am Eniola, your Yoruba Coach. 🌟 Type a
                  message below, and let&apos;s practice together!
                </div>
              </div>

              {messages.map((msg) => {
                const isUser = msg.role === "user";

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className="px-4 py-3 rounded-2xl max-w-[85%] shadow-sm border flex flex-col"
                      style={{
                        background: isUser ? "#1B3A8C" : "#F3E8F3",
                        color: isUser ? "#FFFBF0" : "#1B3A8C",
                        borderColor: isUser ? "#0D1E56" : "#D8BFD8",
                        borderRadius: isUser
                          ? "1rem 1rem 0.25rem 1rem"
                          : "1rem 1rem 1rem 0.25rem",
                      }}
                    >
                      <span className="font-semibold text-sm md:text-base leading-relaxed">
                        {msg.text}
                      </span>
                      {msg.audio_url && (
                        <button
                          onClick={() => playVoice(msg.audio_url!)}
                          className="mt-2 self-start font-bold py-1 px-3 rounded-lg border text-xs flex items-center gap-1 cursor-pointer transition-colors"
                          style={{
                            background: "#D4A017",
                            borderColor: "#A06808",
                            color: "#FFFBF0",
                          }}
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
                  <div
                    className="font-bold px-4 py-3 rounded-2xl rounded-tl-none shadow-sm border animate-pulse"
                    style={{
                      background: "#F3E8F3",
                      color: "#8B2E8B",
                      borderColor: "#D8BFD8",
                    }}
                  >
                    Eniola is typing... ✍️
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Disabled Overlay if keys are not set */}
            {!active && (
              <div className="absolute inset-0 bg-slate-900/90 rounded-[inherit] z-30 flex flex-col items-center justify-center p-6 text-center text-white">
                <span className="text-6xl animate-bounce">😴</span>
                <h3
                  className="text-xl font-black mt-4"
                  style={{
                    fontFamily: "var(--font-fredoka), system-ui, sans-serif",
                  }}
                >
                  Eniola is sleeping...
                </h3>
                <p className="text-slate-400 text-sm max-w-xs mt-2 font-medium">
                  Please tell your parent/admin to enter the Fal.ai and LLM keys
                  in the Admin Settings so I can wake up and chat!
                </p>
                {isAdmin && (
                  <Link
                    href="/admin/dashboard"
                    className="mt-6 font-bold py-2.5 px-6 rounded-2xl border-2 shadow transition-all"
                    style={{
                      background: "#D4A017",
                      borderColor: "#A06808",
                      color: "#FFFBF0",
                    }}
                  >
                    Go to Admin Settings
                  </Link>
                )}
              </div>
            )}
          </PageCard>

          {/* Input Bar */}
          <form
            onSubmit={handleSend}
            className="w-full flex items-center gap-3 mt-4"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message in English or Yoruba..."
              disabled={sending || !active}
              className="flex-1 rounded-2xl px-5 py-3.5 font-bold outline-none shadow transition-colors"
              style={{
                background: "#FFFBF0",
                color: "#1B3A8C",
                border: "4px solid #8B2E8B",
                boxShadow: "#5A1A5A 0px 5px 0px",
                fontFamily: "var(--font-fredoka), system-ui, sans-serif",
              }}
            />
            <motion.button
              type="submit"
              disabled={sending || !active || !inputText.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="font-bold p-3.5 rounded-2xl border-4 shadow shrink-0 cursor-pointer disabled:opacity-50 transition-colors"
              style={{
                background: "#1B3A8C",
                borderColor: "#0D1E56",
                color: "#FFFBF0",
                boxShadow: "#0D1E56 0px 5px 0px",
              }}
            >
              🚀
            </motion.button>
          </form>
        </motion.div>
      </div>
    </PageShell>
  );
}
