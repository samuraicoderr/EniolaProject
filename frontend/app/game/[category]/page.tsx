"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useRequiredAuth } from "@/lib/api/auth/authContext";
import YorubaService, { VocabularyItem } from "@/lib/api/services/Yoruba.Service";

// Helper to play synthesized sounds using Web Audio API so no audio files are needed!
const playSynthSound = (type: "success" | "error" | "click") => {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "success") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.12); // E5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === "error") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(150.0, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else {
      // click
      osc.type = "sine";
      osc.frequency.setValueAtTime(400.0, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    }
  } catch (e) {
    console.error("Audio synth error", e);
  }
};

export default function GamePage() {
  const auth = useRequiredAuth();
  const router = useRouter();
  const params = useParams();
  const category = (params.category as string) || "animals";

  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Game state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<VocabularyItem[]>([]);
  const [muted, setMuted] = useState(false);

  // Fetch vocabulary
  useEffect(() => {
    if (auth.isAuthenticated) {
      YorubaService.getVocabulary(category)
        .then((data) => {
          if (!data || data.length === 0) {
            throw new Error("No vocabulary items found for this category.");
          }
          setVocabulary(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message || "Failed to load vocabulary data.");
          setLoading(false);
        });
    }
  }, [category, auth.isAuthenticated]);

  const currentQuestion = useMemo(() => {
    if (vocabulary.length === 0) return null;
    // Map to ensure we always have 8 questions. If vocabulary length is less, repeat or cycle.
    const itemIndex = currentIndex % vocabulary.length;
    return vocabulary[itemIndex];
  }, [vocabulary, currentIndex]);

  // Set up options for the current question
  useEffect(() => {
    if (!currentQuestion || vocabulary.length === 0) return;

    // Get correct option
    const correct = currentQuestion;

    // Filter out correct option to find distractors
    const distractors = vocabulary.filter((item) => item.id !== correct.id);

    // Shuffle distractors and pick 3
    const shuffledDistractors = [...distractors].sort(() => 0.5 - Math.random());
    const selectedDistractors = shuffledDistractors.slice(0, Math.min(3, distractors.length));

    // Combine correct and distractors, and shuffle them
    const allOptions = [correct, ...selectedDistractors].sort(() => 0.5 - Math.random());

    setShuffledOptions(allOptions);
    setSelectedOptionId(null);
    setFeedback(null);
  }, [currentQuestion, vocabulary]);

  const speakWord = (text: string) => {
    if (muted || typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    // Simple Yoruba pronunciation heuristic: use Italian/Spanish for vowels, or generic en-US fallback
    utterance.lang = "yo-NG" in SpeechSynthesis ? "yo-NG" : "es-ES";
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  const handleOptionClick = (option: VocabularyItem) => {
    if (feedback === "correct") return; // Block clicking after correct answer

    if (!muted) playSynthSound("click");
    setSelectedOptionId(option.id);

    if (option.id === currentQuestion?.id) {
      setFeedback("correct");
      setScore((prev) => prev + 1);
      if (!muted) playSynthSound("success");
      speakWord(option.yoruba);

      // Move to next question after 1.8 seconds
      setTimeout(() => {
        if (currentIndex < 7) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          // Finished round of 8
          YorubaService.updateProgress(category, score + 1, true)
            .then(() => setIsFinished(true))
            .catch((err) => {
              console.error("Error saving progress:", err);
              setIsFinished(true);
            });
        }
      }, 1800);
    } else {
      setFeedback("incorrect");
      if (!muted) playSynthSound("error");
      speakWord("Oti o (No)");
    }
  };

  if (auth.isLoading || loading) {
    return (
      <div className="min-h-screen bg-[#F2E1C0] flex items-center justify-center">
        <div className="text-center font-bold text-slate-800 text-xl animate-pulse">
          Loading Yoruba Game...
        </div>
      </div>
    );
  }

  if (error || !currentQuestion) {
    return (
      <div className="min-h-screen bg-[#F2E1C0] flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white p-8 rounded-3xl shadow-xl border-4 border-red-500">
          <span className="text-6xl">⚠️</span>
          <h2 className="text-2xl font-black text-slate-800 mt-4">Oh No!</h2>
          <p className="text-slate-600 mt-2">{error || "Game data not found."}</p>
          <Link
            href="/"
            className="mt-6 inline-block bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 px-6 rounded-2xl border border-amber-700 transition-colors"
          >
            Back to Map
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center p-4 md:p-8 relative overflow-hidden bg-[#F2E1C0]">
      
      {/* Background SVG Decoration */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-15">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="ankaraPattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <polygon fill="none" stroke="#1B3A8C" strokeWidth="2" points="40,4 76,40 40,76 4,40" />
              <circle cx="40" cy="40" r="6" fill="#D4A017" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ankaraPattern)" />
        </svg>
      </div>

      {/* Top Header Row */}
      <div className="w-full max-w-3xl flex items-center gap-4 z-20 relative mt-4">
        <Link
          href="/"
          className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md text-3xl cursor-pointer hover:scale-110 active:scale-95 transition-all bg-amber-700 border-4 border-amber-950"
        >
          🏠
        </Link>
        
        {/* Progress Bar */}
        <div className="flex-1 h-7 rounded-full overflow-hidden bg-white/60 border-3 border-amber-600">
          <motion.div
            className="h-full rounded-full bg-amber-500"
            initial={{ width: "0%" }}
            animate={{ width: `${(currentIndex / 8) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <div className="font-bold text-xl px-4 py-1.5 rounded-full shadow bg-amber-700 text-white border-2 border-amber-950">
          {currentIndex + 1} / 8
        </div>
      </div>

      {/* Main Question & Completion Box */}
      <div className="w-full max-w-3xl flex-1 flex flex-col justify-center items-center z-10 py-6">
        <AnimatePresence mode="wait">
          {!isFinished ? (
            <motion.div
              key="question-box"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full flex flex-col items-center"
            >
              {/* Question Header Card */}
              <div className="flex items-center gap-6 mb-8 px-8 py-6 rounded-3xl shadow-xl bg-white/95 border-5 border-amber-500 relative max-w-xl w-full justify-between">
                <div className="flex flex-col">
                  <span className="text-slate-500 text-sm font-bold uppercase tracking-wider">Tap the</span>
                  <h2 className="text-3xl md:text-5xl font-black text-[#1B3A8C] font-logo mt-1">
                    {currentQuestion.english}
                  </h2>
                </div>
                <button
                  onClick={() => speakWord(currentQuestion.yoruba)}
                  className="bg-amber-600 hover:bg-amber-500 text-white p-4 rounded-full shadow-md active:scale-95 transition-all"
                  title="Listen to Yoruba pronunciation"
                >
                  🔊
                </button>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-2 gap-4 md:gap-6 w-full max-w-2xl">
                {shuffledOptions.map((option) => {
                  const isSelected = selectedOptionId === option.id;
                  const isCorrectAnswer = option.id === currentQuestion.id;
                  let cardStyle = "bg-white/90 border-amber-500 hover:bg-white";

                  if (feedback && isSelected) {
                    cardStyle = isCorrectAnswer
                      ? "bg-green-100 border-green-500"
                      : "bg-red-100 border-red-500 animate-shake";
                  }

                  return (
                    <motion.button
                      key={option.id}
                      onClick={() => handleOptionClick(option)}
                      whileHover={{ scale: feedback ? 1 : 1.03 }}
                      whileTap={{ scale: feedback ? 1 : 0.97 }}
                      className={`rounded-[2.5rem] p-8 md:p-10 shadow-lg flex flex-col items-center justify-center min-h-[160px] md:min-h-[220px] border-6 transition-all relative overflow-hidden cursor-pointer ${cardStyle}`}
                    >
                      <span className="text-[5.5rem] leading-none drop-shadow">
                        {option.emoji}
                      </span>
                      {feedback && isSelected && (
                        <span className="mt-2 text-lg font-black text-slate-800 bg-white/90 px-3 py-1 rounded-full border">
                          {option.yoruba}
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="finished-box"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/95 border-5 border-amber-500 rounded-3xl p-8 shadow-2xl text-center max-w-md w-full relative"
            >
              <span className="text-7xl block animate-bounce">🏆</span>
              <h2 className="text-3xl md:text-4xl font-black text-[#1B3A8C] mt-4 font-logo">
                Ku iṣẹ! (Well Done!)
              </h2>
              <p className="text-slate-600 mt-2 font-medium">
                You successfully completed the {category} adventure lesson!
              </p>
              
              <div className="my-6 bg-amber-50 rounded-2xl p-4 border border-amber-200">
                <span className="text-amber-600 font-bold uppercase tracking-wider block text-xs">Stars Earned</span>
                <span className="text-3xl font-black text-amber-500 block">⭐ {score} Stars</span>
              </div>

              <button
                onClick={() => router.push("/")}
                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3.5 px-6 rounded-2xl border-4 border-green-800 shadow-lg transition-all active:scale-95"
              >
                Continue Playing
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mute controller */}
      <button
        onClick={() => setMuted((prev) => !prev)}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-xl text-2xl bg-amber-500 border-3 border-amber-700 text-white hover:scale-110 active:scale-90 transition-all"
        title={muted ? "Unmute sound" : "Mute sound"}
      >
        {muted ? "🔇" : "🔊"}
      </button>
    </div>
  );
}
