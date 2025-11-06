"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Scene, animationLabels } from "./SceneForm";
import clsx from "clsx";

const animationVariants = {
  fade: {
    initial: { opacity: 0, y: 10, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 }
  },
  "slide-up": {
    initial: { opacity: 0, y: 80 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -40 }
  },
  "slide-left": {
    initial: { opacity: 0, x: 80 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -80 }
  },
  zoom: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.1 }
  },
  glitch: {
    initial: { opacity: 0, x: -30, skewX: -10 },
    animate: { opacity: 1, x: 0, skewX: 0 },
    exit: { opacity: 0, x: 20, skewX: 8 }
  },
  pop: {
    initial: { opacity: 0, scale: 0.6 },
    animate: { opacity: 1, scale: 1, rotate: [0, -2, 1, 0] },
    exit: { opacity: 0, scale: 0.9 }
  }
};

interface ScenePreviewProps {
  scene: Scene | undefined;
}

export const ScenePreview = ({ scene }: ScenePreviewProps) => {
  return (
    <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900 to-black shadow-[0_45px_140px_-80px_rgba(56,189,248,0.55)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.25),transparent_55%)] mix-blend-screen" />
      <div className="absolute inset-10 rounded-[40px] border border-slate-800/60 bg-slate-950/60 backdrop-blur-xl" />
      <AnimatePresence mode="wait">
        {scene ? (
          <motion.div
            key={scene.id}
            initial={animationVariants[scene.animation].initial}
            animate={animationVariants[scene.animation].animate}
            exit={animationVariants[scene.animation].exit}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 flex max-w-3xl flex-col items-center gap-6 px-10 text-center"
          >
            <div
              className={clsx(
                "font-display uppercase tracking-[0.4em] text-sm text-accent-200",
                scene.stroke && "text-shadow-stroke"
              )}
              style={{ color: scene.accentColor }}
            >
              {animationLabels[scene.animation]}
            </div>
            <h1
              className={clsx(
                "font-display font-black leading-tight drop-shadow-[0_15px_35px_rgba(14,165,233,0.25)]",
                scene.stroke && "text-shadow-stroke"
              )}
              style={{ fontSize: `${scene.fontSize}px` }}
            >
              {scene.title || "Add Your Text"}
            </h1>
            <p className="max-w-2xl text-lg text-slate-200/90">
              {scene.subtitle || "Craft cinematic titles with animation-driven cuts. Mix bold typography, neon accents, and sonic transitions for instant hype."}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 flex max-w-xl flex-col items-center gap-3 px-12 text-center"
          >
            <h2 className="font-display text-4xl font-semibold text-slate-200">Select a scene to preview</h2>
            <p className="text-base text-slate-400">Add text, play with motion presets, and trigger the swoosh sound to feel the CapCut vibes.</p>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="pointer-events-none absolute inset-0 opacity-70 mix-blend-color-dodge">
        <div className="animate-grid-sweep h-full w-full bg-[linear-gradient(90deg,rgba(56,189,248,0)_0%,rgba(56,189,248,0.15)_45%,rgba(56,189,248,0)_100%)]" />
      </div>
    </div>
  );
};
