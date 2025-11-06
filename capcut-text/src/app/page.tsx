"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Play, Square, Volume2, VolumeX, Wand2 } from "lucide-react";

import { SceneForm, Scene } from "@/components/SceneForm";
import { ScenePreview } from "@/components/ScenePreview";
import { Timeline } from "@/components/Timeline";
import { useTransitionSound } from "@/hooks/useTransitionSound";

const createScene = (index: number): Scene => ({
  id: `scene-${index}-${Math.random().toString(36).slice(2, 8)}`,
  title: "Neon Momentum",
  subtitle: "Punchy opener with electrified typography and coated highlights.",
  duration: 2.5,
  animation: "slide-up",
  accentColor: "#38bdf8",
  fontSize: 64,
  stroke: true
});

const starterScenes: Scene[] = [
  {
    id: "scene-1",
    title: "Amplify Your Story",
    subtitle: "Stack animated text layers, sync the sonic swoosh, and whip up viral-ready hooks in seconds.",
    duration: 2.8,
    animation: "fade",
    accentColor: "#22d3ee",
    fontSize: 68,
    stroke: true
  },
  {
    id: "scene-2",
    title: "Neon Velocity",
    subtitle: "Slide into the beat with crystal typography, kinetic motion, and an instant energy burst.",
    duration: 2.2,
    animation: "slide-left",
    accentColor: "#38bdf8",
    fontSize: 62,
    stroke: false
  },
  {
    id: "scene-3",
    title: "Impact Outro",
    subtitle: "Glitch the finale, lock the message, and leave the audience craving the next cut.",
    duration: 2.6,
    animation: "glitch",
    accentColor: "#f472b6",
    fontSize: 64,
    stroke: true
  }
];

export default function Home() {
  const [scenes, setScenes] = useState<Scene[]>(starterScenes);
  const [selectedSceneId, setSelectedSceneId] = useState<string>(starterScenes[0]?.id ?? "");
  const [activeSceneId, setActiveSceneId] = useState<string>(starterScenes[0]?.id ?? "");
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [progress, setProgress] = useState(0);

  const playSound = useTransitionSound();
  const frameRef = useRef<number>();
  const isCancelledRef = useRef(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const totalDurationMs = useMemo(() => scenes.reduce((acc, scene) => acc + scene.duration, 0) * 1000, [scenes]);

  const activeScene = scenes.find((scene) => scene.id === activeSceneId);

  const delay = useCallback((ms: number) => {
    return new Promise<void>((resolve) => {
      const timeout = setTimeout(() => {
        timeoutsRef.current = timeoutsRef.current.filter((entry) => entry !== timeout);
        resolve();
      }, ms);
      timeoutsRef.current.push(timeout);
    });
  }, []);

  const stopPlayback = useCallback(() => {
    isCancelledRef.current = true;
    setIsPlaying(false);
    setProgress(0);
    setActiveSceneId(selectedSceneId || scenes[0]?.id || "");
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }
    timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    timeoutsRef.current = [];
  }, [selectedSceneId, scenes]);

  useEffect(() => {
    if (!isPlaying || scenes.length === 0) {
      return undefined;
    }

    isCancelledRef.current = false;
    const startedAt = performance.now();

    const updateProgress = () => {
      const now = performance.now();
      const elapsed = now - startedAt;
      const ratio = totalDurationMs === 0 ? 0 : Math.min(elapsed / totalDurationMs, 1);
      setProgress(ratio);
      if (!isCancelledRef.current && ratio < 1) {
        frameRef.current = requestAnimationFrame(updateProgress);
      }
    };

    frameRef.current = requestAnimationFrame(updateProgress);

    (async () => {
      for (const scene of scenes) {
        if (isCancelledRef.current) break;
        setActiveSceneId(scene.id);
        if (soundEnabled) {
          playSound().catch(() => undefined);
        }
        await delay(scene.duration * 1000);
      }
      if (!isCancelledRef.current) {
        setIsPlaying(false);
        setProgress(1);
        setTimeout(() => {
          setProgress(0);
          setActiveSceneId(selectedSceneId || scenes[0]?.id || "");
        }, 480);
      }
    })();

    return () => {
      isCancelledRef.current = true;
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
      timeoutsRef.current = [];
    };
  }, [isPlaying, scenes, soundEnabled, playSound, totalDurationMs, selectedSceneId, delay]);

  const handleAddScene = () => {
    const newScene = createScene(scenes.length + 1);
    setScenes((prev) => [...prev, newScene]);
    setSelectedSceneId(newScene.id);
    setActiveSceneId(newScene.id);
  };

  const handleUpdateScene = (id: string, nextScene: Scene) => {
    setScenes((prev) => prev.map((scene) => (scene.id === id ? nextScene : scene)));
  };

  const handleRemoveScene = (id: string) => {
    if (scenes.length === 1) return;
    const nextScenes = scenes.filter((scene) => scene.id !== id);
    setScenes(nextScenes);
    const fallback = nextScenes[0]?.id ?? "";
    setSelectedSceneId(fallback);
    setActiveSceneId(fallback);
  };

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-10 md:py-16">
      <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <p className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-4 py-1 text-xs uppercase tracking-[0.28em] text-slate-400">
            <Wand2 className="h-3.5 w-3.5" /> CapCut-Style Text Lab
          </p>
          <h1 className="font-display text-4xl font-black tracking-tight text-slate-50 md:text-5xl">
            Animate cinematic titles with sound-reactive transitions
          </h1>
          <p className="max-w-2xl text-base text-slate-400">
            Type, animate, and trigger the swoosh soundtrack while you preview. Stack scenes, swap presets, and fine-tune lettering like you would inside CapCut — right in the browser.
          </p>
        </div>
        <div className="flex h-full flex-col items-stretch gap-3 md:w-64">
          <button
            onClick={() => (isPlaying ? stopPlayback() : setIsPlaying(true))}
            className="group flex items-center justify-center gap-3 rounded-2xl border border-transparent bg-gradient-to-r from-accent-700 via-accent-600 to-accent-500 px-6 py-4 text-lg font-semibold text-slate-950 shadow-[0_25px_60px_-35px_rgba(14,165,233,0.85)] transition hover:brightness-110"
          >
            {isPlaying ? (
              <>
                <Square size={20} className="transition group-hover:scale-110" /> Stop Preview
              </>
            ) : (
              <>
                <Play size={20} className="transition group-hover:translate-x-0.5" /> Preview Sequence
              </>
            )}
          </button>
          <button
            onClick={handleAddScene}
            className="flex items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/60 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-700 hover:bg-slate-900"
          >
            <Plus size={18} /> Add Scene
          </button>
          <button
            onClick={() => setSoundEnabled((value) => !value)}
            className="flex items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/60 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-700 hover:bg-slate-900"
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            {soundEnabled ? "Sound on" : "Sound muted"}
          </button>
        </div>
      </header>

      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col gap-6">
          <ScenePreview scene={activeScene} />
          <Timeline scenes={scenes} activeId={activeSceneId} progress={progress} />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex max-h-[calc(100vh-220px)] flex-col gap-3 overflow-y-auto rounded-3xl border border-slate-800 bg-slate-950/60 p-4 shadow-[0_35px_120px_-80px_rgba(14,165,233,0.35)]"
        >
          <h2 className="px-2 text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">Scenes</h2>
          <div className="flex flex-col gap-4">
            {scenes.map((scene) => (
              <SceneForm
                key={scene.id}
                scene={scene}
                isSelected={scene.id === selectedSceneId}
                onSelect={setSelectedSceneId}
                onUpdate={handleUpdateScene}
                onRemove={handleRemoveScene}
              />
            ))}
          </div>
        </motion.div>
      </section>
    </main>
  );
}
