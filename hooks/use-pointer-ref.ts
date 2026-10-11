"use client";

import { useEffect, useRef } from "react";

export type PointerRef = {
  /** Normalised pointer position, −1 → 1 on both axes. */
  x: number;
  y: number;
  /** Raw client coordinates (px). */
  clientX: number;
  clientY: number;
  /** Per-frame smoothed values (lerped towards the raw position). */
  smoothX: number;
  smoothY: number;
};

/**
 * Global pointer tracker that never re-renders React.
 *
 * Reads/writes a mutable ref and lerps automatically inside the browser's own
 * paint loop — used by the 3D core and the custom cursor.
 */
export function usePointerRef(smoothing = 0.12): React.RefObject<PointerRef> {
  const pointer = useRef<PointerRef>({
    x: 0,
    y: 0,
    clientX: 0,
    clientY: 0,
    smoothX: 0,
    smoothY: 0,
  });

  useEffect(() => {
    let frame = 0;
    let running = false;

    const onMove = (event: PointerEvent) => {
      const { innerWidth, innerHeight } = window;
      pointer.current.clientX = event.clientX;
      pointer.current.clientY = event.clientY;
      pointer.current.x = (event.clientX / innerWidth) * 2 - 1;
      pointer.current.y = -((event.clientY / innerHeight) * 2 - 1);
      if (!running) {
        running = true;
        frame = requestAnimationFrame(tick);
      }
    };

    const tick = () => {
      const p = pointer.current;
      p.smoothX += (p.x - p.smoothX) * smoothing;
      p.smoothY += (p.y - p.smoothY) * smoothing;
      if (Math.abs(p.x - p.smoothX) < 0.0005 && Math.abs(p.y - p.smoothY) < 0.0005) {
        running = false;
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [smoothing]);

  return pointer;
}
