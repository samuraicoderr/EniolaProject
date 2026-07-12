"use client";

import { useCallback, useRef } from "react";

export interface SoundEffect {
  id: string;
  url: string;
}

export interface PlayEffectOptions {
  loop?: boolean;
  volume?: number;
  /**
   * Fade the effect to silence. `startAfter` is the number of milliseconds
   * to wait before beginning the fade, and `duration` is how long the fade
   * itself takes in milliseconds.
   */
  fadeOut?: {
    startAfter: number;
    duration: number;
  };
}

export function useSoundEffects() {
  const cacheRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const activeRef = useRef<Set<HTMLAudioElement>>(new Set());

  const preload = useCallback((effects: SoundEffect[]) => {
    if (typeof window === "undefined") return;

    effects.forEach((effect) => {
      if (!effect.url || cacheRef.current.has(effect.id)) return;

      const audio = new Audio(effect.url);
      audio.preload = "auto";
      audio.load();
      cacheRef.current.set(effect.id, audio);
    });
  }, []);

  const stopAll = useCallback(() => {
    activeRef.current.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = 1;
    });
    activeRef.current.clear();
  }, []);

  const play = useCallback((id: string, options: PlayEffectOptions = {}) => {
    if (typeof window === "undefined") return;

    const cached = cacheRef.current.get(id);
    if (!cached) {
      console.warn(`Sound effect "${id}" not available`);
      return;
    }

    // Clone so the same cached file can overlap with itself and repeated
    // plays don't cancel an already-running instance.
    const audio = cached.cloneNode() as HTMLAudioElement;
    audio.volume = options.volume ?? 1;
    audio.loop = options.loop ?? false;

    activeRef.current.add(audio);

    const remove = () => {
      activeRef.current.delete(audio);
    };

    audio.addEventListener("ended", remove, { once: true });
    audio.addEventListener("error", remove, { once: true });

    if (options.fadeOut) {
      const startVolume = audio.volume;
      const fadeTimer = setTimeout(() => {
        const steps = 20;
        const stepDuration = options.fadeOut!.duration / steps;
        const volumeStep = startVolume / steps;
        let step = 0;

        const interval = setInterval(() => {
          step += 1;
          if (step >= steps) {
            clearInterval(interval);
            audio.pause();
            audio.volume = startVolume;
            remove();
            return;
          }
          audio.volume = Math.max(0, startVolume - step * volumeStep);
        }, stepDuration);
      }, options.fadeOut.startAfter);

      audio.addEventListener(
        "ended",
        () => {
          clearTimeout(fadeTimer);
        },
        { once: true },
      );
    }

    const playWhenReady = () => {
      if (audio.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
        audio.play().catch(() => {
          audio.pause();
          remove();
        });
        return;
      }

      const onCanPlay = () => {
        cleanup();
        audio.play().catch(() => {
          audio.pause();
          remove();
        });
      };

      const onError = () => {
        cleanup();
        remove();
      };

      const cleanup = () => {
        audio.removeEventListener("canplaythrough", onCanPlay);
        audio.removeEventListener("error", onError);
      };

      audio.addEventListener("canplaythrough", onCanPlay, { once: true });
      audio.addEventListener("error", onError, { once: true });
    };

    playWhenReady();
  }, []);

  return { preload, play, stopAll };
}
