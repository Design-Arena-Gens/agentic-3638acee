"use client";

import clsx from "clsx";
import { Scene } from "./SceneForm";

interface TimelineProps {
  scenes: Scene[];
  activeId: string | null;
  progress: number;
}

export const Timeline = ({ scenes, activeId, progress }: TimelineProps) => {
  const total = scenes.reduce((acc, scene) => acc + scene.duration, 0);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
      <div className="flex items-center justify-between pb-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Timeline</h3>
        <span className="text-xs text-slate-500">{(progress * 100).toFixed(0)}%</span>
      </div>
      <div className="relative flex h-16 w-full overflow-hidden rounded-xl bg-slate-950/70">
        <div
          className="absolute left-0 top-0 h-full bg-accent-500/20 transition-all"
          style={{ width: `${Math.min(progress * 100, 100)}%` }}
        />
        {scenes.map((scene) => {
          const width = total > 0 ? (scene.duration / total) * 100 : 0;
          const isActive = scene.id === activeId;
          return (
            <div
              key={scene.id}
              className={clsx(
                "relative flex h-full flex-1 items-center justify-center border-r border-slate-800 text-xs font-medium uppercase tracking-wider text-slate-400 transition",
                isActive && "bg-slate-900/80 text-accent-300 shadow-inset"
              )}
              style={{ width: `${width}%` }}
            >
              <span className="max-w-[70%] truncate">{scene.title || "Scene"}</span>
            </div>
          );
        })}
        <div className="absolute inset-0 rounded-xl shadow-[inset_0_0_25px_rgba(14,165,233,0.15)]" />
      </div>
    </div>
  );
};
