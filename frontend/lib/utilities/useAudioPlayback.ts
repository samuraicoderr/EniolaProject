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

export function useAudioPlayback() {
  const cacheRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const currentRef = useRef<HTMLAudioElement | null>(null);

  const stopCurrent = useCallback(() => {
    if (currentRef.current) {
      currentRef.current.pause();
      currentRef.current.currentTime = 0;
      currentRef.current = null;
    }
  }, []);

  const preload = useCallback((items: AudioPlayable[]) => {
    if (typeof window === "undefined") return;

    items.forEach((item) => {
      if (!item.audio_url || cacheRef.current.has(item.id)) return;

      const audio = new Audio(item.audio_url);
      audio.preload = "auto";
      audio.load();
      cacheRef.current.set(item.id, audio);
    });
  }, []);

  const play = useCallback(
    (item: AudioPlayable, options?: AudioPlayOptions) => {
      if (typeof window === "undefined") return;

      stopCurrent();

      let audio = item.audio_url ? cacheRef.current.get(item.id) : undefined;

      if (!audio && item.audio_url) {
        audio = new Audio(item.audio_url);
        audio.preload = "auto";
        cacheRef.current.set(item.id, audio);
      }

      if (!audio) {
        console.warn(`Audio not available for "${item.id}"`);
        options?.onError?.();
        return;
      }

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
        console.error(`Audio playback failed for "${item.id}"`);
        options?.onError?.();
      };

      audio.addEventListener("ended", handleEnded, { once: true });
      audio.addEventListener("error", handleError, { once: true });

      audio.currentTime = 0;
      currentRef.current = audio;

      const playWhenReady = () => {
        if (audio.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
          audio.play().catch((err) => {
            console.error(`Audio play() rejected for "${item.id}":`, err);
            handleError();
          });
          return;
        }

        const onCanPlay = () => {
          cleanup();
          audio.play().catch((err) => {
            console.error(`Audio play() rejected for "${item.id}":`, err);
            handleError();
          });
        };

        const onError = () => {
          cleanup();
          handleError();
        };

        const cleanup = () => {
          audio.removeEventListener("canplaythrough", onCanPlay);
          audio.removeEventListener("error", onError);
        };

        audio.addEventListener("canplaythrough", onCanPlay, { once: true });
        audio.addEventListener("error", onError, { once: true });
      };

      playWhenReady();
    },
    [stopCurrent],
  );

  return useMemo(
    () => ({ preload, play, stop: stopCurrent }),
    [preload, play, stopCurrent],
  );
}
