"use client";

import { useCallback, useRef } from "react";

export interface SoundEffect {
  id: string;
  url: string;
}

export interface PlayEffectOptions {
  loop?: boolean;
  volume?: number;
  fadeOut?: {
    startAfter: number;
    duration: number;
  };
}

interface LoadedEffect {
  audio: HTMLAudioElement;
  objectURL: string;
}

function playWhenReady(audio: HTMLAudioElement): Promise<void> {
  return new Promise((resolve, reject) => {
    if (audio.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
      audio
        .play()
        .then(resolve)
        .catch((err) => reject(err));
      return;
    }

    const onCanPlay = () => {
      cleanup();
      audio
        .play()
        .then(resolve)
        .catch((err) => reject(err));
    };

    const onError = () => {
      cleanup();
      reject(new Error("Audio load error"));
    };

    const cleanup = () => {
      audio.removeEventListener("canplaythrough", onCanPlay);
      audio.removeEventListener("error", onError);
    };

    audio.addEventListener("canplaythrough", onCanPlay, { once: true });
    audio.addEventListener("error", onError, { once: true });
  });
}

export function useSoundEffects() {
  const cacheRef = useRef<Map<string, LoadedEffect>>(new Map());
  const activeRef = useRef<Set<HTMLAudioElement>>(new Set());

  const preload = useCallback(async (effects: SoundEffect[]) => {
    if (typeof window === "undefined") return;

    for (const effect of effects) {
      if (!effect.url || cacheRef.current.has(effect.id)) continue;

      try {
        const response = await fetch(effect.url, { mode: "cors" });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const blob = await response.blob();
        const objectURL = URL.createObjectURL(blob);
        const audio = new Audio(objectURL);
        cacheRef.current.set(effect.id, { audio, objectURL });
      } catch (err) {
        console.error(`Failed to preload sound effect "${effect.id}":`, err);
      }
    }
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

    const entry = cacheRef.current.get(id);
    if (!entry) {
      console.warn(`Sound effect "${id}" not available`);
      return;
    }

    const audio = entry.audio;

    // If this effect is already playing, restart it.
    if (activeRef.current.has(audio)) {
      audio.pause();
    }

    audio.currentTime = 0;
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

      audio.addEventListener("ended", () => clearTimeout(fadeTimer), {
        once: true,
      });
    }

    playWhenReady(audio).catch(() => {
      audio.pause();
      remove();
    });
  }, []);

  return { preload, play, stopAll };
}
