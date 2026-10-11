"use client";

import { useEffect, useRef } from "react";

import { useScrollEngine } from "@/components/providers/scroll-provider";

/**
 * Fixed scroll progress rail (top hairline + right-hand readout).
 *
 * Lives outside Locomotive's transformed container so `position: fixed` keeps
 * meaning what it should. The engine pushes values straight into the DOM —
 * this component never re-renders while scrolling.
 */
export function ScrollProgress() {
  const { subscribe } = useScrollEngine();
  const bar = useRef<HTMLDivElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const section = useRef<HTMLSpanElement>(null);

  useEffect(
    () =>
      subscribe((state) => {
        const percent = Math.round(state.progress * 100);
        if (bar.current) bar.current.style.transform = `scaleX(${state.progress})`;
        if (readout.current) readout.current.textContent = `${String(percent).padStart(2, "0")}`;
        if (section.current) {
          section.current.textContent = state.direction === "up" ? "▲" : "▼";
        }
      }),
    [subscribe],
  );

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[60]"
      aria-hidden="true"
    >
      <div className="h-px w-full bg-line">
        <div
          ref={bar}
          className="h-px w-full origin-left scale-x-0 bg-gradient-to-r from-volt-deep via-volt to-volt-soft"
        />
      </div>
      <div className="absolute right-4 top-3 hidden items-center gap-2 font-mono text-[0.625rem] tracking-[0.2em] text-ash-dim lg:flex">
        <span ref={section} className="text-volt">
          ▼
        </span>
        <span ref={readout}>00</span>
        <span>/ 100</span>
      </div>
    </div>
  );
}
