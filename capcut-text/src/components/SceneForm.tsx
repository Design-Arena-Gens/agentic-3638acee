"use client";

import { ChangeEvent } from "react";
import { Trash2 } from "lucide-react";
import clsx from "clsx";

export type AnimationStyle = "fade" | "slide-up" | "slide-left" | "zoom" | "glitch" | "pop";

export interface Scene {
  id: string;
  title: string;
  subtitle: string;
  duration: number;
  animation: AnimationStyle;
  accentColor: string;
  fontSize: number;
  stroke: boolean;
}

interface SceneFormProps {
  scene: Scene;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, scene: Scene) => void;
  onRemove: (id: string) => void;
}

export const animationLabels: Record<AnimationStyle, string> = {
  fade: "Cinematic Fade",
  "slide-up": "Slide Up",
  "slide-left": "Slide Left",
  zoom: "Dynamic Zoom",
  glitch: "Neon Glitch",
  pop: "Pop Bounce"
};

export const SceneForm = ({ scene, isSelected, onSelect, onUpdate, onRemove }: SceneFormProps) => {
  const handleChange = (key: keyof Scene) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = event.target.type === "number" ? Number(event.target.value) : event.target.type === "checkbox" ? (event.target as HTMLInputElement).checked : event.target.value;
    onUpdate(scene.id, { ...scene, [key]: value });
  };

  return (
    <button
      type="button"
      onClick={() => onSelect(scene.id)}
      className={clsx(
        "group w-full text-left",
        "rounded-2xl border border-slate-800 transition duration-200",
        isSelected ? "border-accent-500 bg-slate-900/80 shadow-float" : "bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60"
      )}
    >
      <div className="flex w-full flex-col gap-4 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-wide text-accent-400">Scene</p>
            <p className="text-xl font-semibold text-slate-50">{scene.title || "Untitled"}</p>
          </div>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onRemove(scene.id);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800/60 text-slate-300 transition hover:bg-red-500/20 hover:text-red-400"
            aria-label="Remove scene"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <label className="flex flex-col gap-2 text-sm">
          <span className="text-xs uppercase tracking-wide text-slate-400">Headline</span>
          <input
            value={scene.title}
            onChange={handleChange("title")}
            className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-base text-slate-100 outline-none transition focus:border-accent-500 focus:ring-2 focus:ring-accent-500/40"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm">
          <span className="text-xs uppercase tracking-wide text-slate-400">Caption</span>
          <textarea
            value={scene.subtitle}
            onChange={handleChange("subtitle")}
            rows={2}
            className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-base text-slate-200 outline-none transition focus:border-accent-500 focus:ring-2 focus:ring-accent-500/40"
          />
        </label>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <label className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wide text-slate-400">Animation</span>
            <select
              value={scene.animation}
              onChange={handleChange("animation")}
              className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-slate-100 outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/40"
            >
              {Object.entries(animationLabels).map(([value, label]) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wide text-slate-400">Duration (s)</span>
            <input
              type="number"
              min={1}
              max={10}
              step={0.5}
              value={scene.duration}
              onChange={handleChange("duration")}
              className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-slate-100 outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/40"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wide text-slate-400">Accent Color</span>
            <input
              type="color"
              value={scene.accentColor}
              onChange={handleChange("accentColor")}
              className="h-11 w-full cursor-pointer rounded-lg border border-slate-800 bg-slate-950/70"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wide text-slate-400">Font Size</span>
            <input
              type="number"
              min={36}
              max={96}
              value={scene.fontSize}
              onChange={handleChange("fontSize")}
              className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-slate-100 outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/40"
            />
          </label>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={scene.stroke}
            onChange={handleChange("stroke")}
            className="h-4 w-4 rounded border border-slate-700 bg-slate-900 text-accent-500 focus:ring-accent-500"
          />
          Text outline stroke for bold energy
        </label>

        <p className="text-xs text-slate-500">{animationLabels[scene.animation]} · {scene.duration}s · {scene.fontSize}px</p>
      </div>
    </button>
  );
};
