"use client";

import { useEffect, useRef, useState } from "react";

import { useIsDesktopPointer, useReducedMotion } from "@/hooks/use-media-query";

/**
 * Custom cursor — desktop, fine-pointer, motion-allowed only.
 *
 * Two layers with different smoothing (a tight dot and a lagging ring) plus a
 * contextual label read from `data-cursor-label` on interactive elements.
 * Purely decorative: `pointer-events: none`, never rendered on touch devices,
 * and the native cursor is only hidden once this component is actually live.
 */
export function CustomCursor() {
  const enabled = useIsDesktopPointer();
  const reduced = useReducedMotion();
  const [label, setLabel] = useState<string | null>(null);
  const active = enabled && !reduced;

  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;

    document.body.dataset.customCursor = "true";
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { ...target };
    const dotPos = { ...target };
    let hovering = false;
    let raf = 0;

    const onMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;

      const element = (event.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-cursor], a, button, input, textarea, [role='button']",
      );
      const nextLabel = element?.dataset.cursorLabel ?? null;
      setLabel((current) => (current === nextLabel ? current : nextLabel));

      const nextHovering = Boolean(element);
      if (nextHovering !== hovering) {
        hovering = nextHovering;
        ring.current?.classList.toggle("size-16", hovering);
        ring.current?.classList.toggle("size-9", !hovering);
        ring.current?.classList.toggle("border-volt", hovering);
        ring.current?.classList.toggle("bg-volt/10", hovering);
      }
    };

    const onLeave = () => {
      if (dot.current) dot.current.style.opacity = "0";
      if (ring.current) ring.current.style.opacity = "0";
    };
    const onEnter = () => {
      if (dot.current) dot.current.style.opacity = "1";
      if (ring.current) ring.current.style.opacity = "1";
    };

    const tick = () => {
      dotPos.x += (target.x - dotPos.x) * 0.55;
      dotPos.y += (target.y - dotPos.y) * 0.55;
      ringPos.x += (target.x - ringPos.x) * 0.16;
      ringPos.y += (target.y - ringPos.y) * 0.16;

      if (dot.current) {
        dot.current.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0) translate(-50%, -50%)`;
      }
      if (ring.current) {
        ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      cancelAnimationFrame(raf);
      delete document.body.dataset.customCursor;
    };
  }, [active]);

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[70] hidden lg:block" aria-hidden="true">
      <div
        ref={ring}
        className="absolute left-0 top-0 flex size-9 items-center justify-center rounded-full border border-chrome/40 transition-[width,height,background-color,border-color] duration-300 ease-out"
      >
        {label ? (
          <span className="font-mono text-[0.5rem] tracking-[0.14em] whitespace-nowrap text-volt uppercase">
            {label}
          </span>
        ) : null}
      </div>
      <div ref={dot} className="absolute left-0 top-0 size-1.5 rounded-full bg-volt" />
    </div>
  );
}
