"use client";

import { useCallback, useMemo, useRef } from "react";

export interface AudioPlayable {
  id: string;
  text: string;
  audio_url?: string;
}

export interface AudioPlayOptions {
  onEnded?: () => void;
  onError?: () => void;
}

function speakWithTTS(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  // Use Spanish/Italian-style vowels as a Yoruba approximation. We avoid
  // explicitly selecting a Yoruba voice because some browser Yoruba voices
  // misread short fallback phrases (e.g. "Oti o" getting rendered as
  // another word). The original game used this same heuristic.
  utterance.lang = "es-ES";
  utterance.rate = 0.85;
  window.speechSynthesis.speak(utterance);
}

export function useAudioPlayback() {
  const cacheRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const currentRef = useRef<HTMLAudioElement | null>(null);

  const stopCurrent = useCallback(() => {
    if (currentRef.current) {
      currentRef.current.pause();
      currentRef.current.currentTime = 0;
      currentRef.current = null;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const preload = useCallback((items: AudioPlayable[]) => {
    if (typeof window === "undefined") return;

    items.forEach((item) => {
      if (!item.audio_url || cacheRef.current.has(item.id)) return;

      const audio = new Audio(item.audio_url);
      audio.preload = "auto";
      audio.crossOrigin = "anonymous";
      audio.load();
      cacheRef.current.set(item.id, audio);
    });
  }, []);

  const play = useCallback(
    (item: AudioPlayable, options?: AudioPlayOptions) => {
      if (typeof window === "undefined") return;

      stopCurrent();

      const cached = item.audio_url ? cacheRef.current.get(item.id) : undefined;

      if (cached) {
        const audio = cached;

        const handleEnded = () => {
          if (currentRef.current === audio) {
            currentRef.current = null;
          }
          options?.onEnded?.();
        };

        const handleError = () => {
          if (currentRef.current === audio) {
            currentRef.current = null;
          }
          speakWithTTS(item.text);
          options?.onError?.();
        };

        audio.addEventListener("ended", handleEnded, { once: true });
        audio.addEventListener("error", handleError, { once: true });

        audio.currentTime = 0;
        currentRef.current = audio;

        audio.play().catch(() => {
          handleError();
        });
      } else {
        speakWithTTS(item.text);
      }
    },
    [stopCurrent],
  );

  return useMemo(
    () => ({ preload, play, stop: stopCurrent }),
    [preload, play, stopCurrent],
  );
}
