"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useIntro } from "@/components/providers/intro-provider";
import { siteConfig } from "@/data/site-config";

/**
 * Loading curtain.
 *
 * Shown once per session, never for reduced-motion visitors, and capped at a
 * fixed duration so it can never become a gate in front of the content. The
 * progress counter is driven by `requestAnimationFrame` and writing straight to
 * a ref — no per-frame React renders.
 */
export function Preloader() {
  const { showIntro, complete } = useIntro();
  const valueRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showIntro) return;

    // Lock scrolling while the curtain is up.
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const duration = 1250;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // easeOutExpo so it races then settles — reads as "loading", not "lagging"
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -9 * t);
      const value = Math.round(eased * 100);
      if (valueRef.current) valueRef.current.textContent = String(value).padStart(3, "0");
      if (barRef.current) barRef.current.style.transform = `scaleX(${eased})`;

      if (t < 1) raf = requestAnimationFrame(tick);
      else complete();
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [complete, showIntro]);

  return (
    <AnimatePresence>
      {showIntro ? (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-obsidian px-6 py-8 sm:px-10 sm:py-12"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
        >
          <div className="flex items-start justify-between">
            <span className="font-mono text-[0.625rem] tracking-[0.3em] text-ash-dim uppercase">
              {siteConfig.name.initials} / Portfolio
            </span>
            <span className="font-mono text-[0.625rem] tracking-[0.3em] text-ash-dim uppercase">
              {siteConfig.location}
            </span>
          </div>

          <div className="flex flex-col gap-6">
            <motion.p
              className="max-w-4xl font-display text-[clamp(1.75rem,5vw,3.5rem)] leading-[1.05] tracking-[-0.04em] text-chrome"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            >
              Rendering the obsidian core
              <span className="text-volt">.</span>
            </motion.p>

            <div className="flex items-center gap-5">
              <div className="h-px flex-1 bg-line">
                <div ref={barRef} className="h-px origin-left scale-x-0 bg-volt" />
              </div>
              <span className="font-mono text-xs tracking-[0.2em] text-volt">
                <span ref={valueRef}>000</span>
                <span className="text-ash-dim">/100</span>
              </span>
            </div>
          </div>

          <div className="flex items-end justify-between font-mono text-[0.625rem] tracking-[0.3em] text-ash-dim uppercase">
            <span>Three.js · react three fiber</span>
            <span>Loading assets</span>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
