"use client";

import { useCallback, useEffect, useRef } from "react";

export const useTransitionSound = () => {
  const contextRef = useRef<AudioContext | null>(null);
  const sourcesRef = useRef<{ stop: () => void }[]>([]);

  useEffect(() => {
    return () => {
      sourcesRef.current.forEach((source) => {
        try {
          source.stop();
        } catch (error) {
          console.warn("Failed to stop oscillator", error);
        }
      });
      contextRef.current?.close().catch(() => undefined);
      sourcesRef.current = [];
    };
  }, []);

  return useCallback(async () => {
    if (typeof window === "undefined") return;

    if (!contextRef.current) {
      const audioCtor =
        window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!audioCtor) return;
      contextRef.current = new audioCtor();
    }

    const ctx = contextRef.current;
    if (ctx.state === "suspended") {
      await ctx.resume();
    }

    const now = ctx.currentTime;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(320, now);
    oscillator.frequency.exponentialRampToValueAtTime(1240, now + 0.4);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(900, now);
    filter.Q.setValueAtTime(12, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.4, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.6);

    sourcesRef.current.push(oscillator);
  }, []);
};
