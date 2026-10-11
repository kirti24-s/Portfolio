"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { ScrollEngine, bindEngine, unbindEngine, type ScrollState } from "@/lib/scroll-engine";

type ScrollContextValue = {
  /** True once the engine finished booting (Locomotive imported & created). */
  ready: boolean;
  /** True when Locomotive owns the transform (desktop, motion allowed). */
  smooth: boolean;
  engine: ScrollEngine;
  /**
   * Pass to `ScrollTrigger` as `scroller`. `null` means "use the window"
   * (native scroll mode) — never pass `null` straight through.
   */
  scroller: HTMLElement | null;
  scrollTo: (
    target: string | HTMLElement | number,
    options?: { offset?: number; duration?: number; onComplete?: () => void },
  ) => void;
  subscribe: (listener: (state: ScrollState) => void) => () => void;
  pause: () => void;
  unlock: () => void;
  refresh: () => void;
};

const ScrollContext = createContext<ScrollContextValue | null>(null);

export function ScrollEngineProvider({
  children,
  overlays,
}: {
  children: React.ReactNode;
  /** Fixed-position UI that must live *outside* Locomotive's transform. */
  overlays?: React.ReactNode;
}) {
  const engineRef = useRef<ScrollEngine | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const [ready, setReady] = useState(false);
  const [smooth, setSmooth] = useState(false);

  if (!engineRef.current) engineRef.current = new ScrollEngine();
  const engine = engineRef.current;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    bindEngine(engine);

    // Locomotive boots after a dynamic import (~once per session) — the
    // `ScrollTrigger.refresh()` inside `init` reconciles every measurement.
    engine.init(container).then(() => {
      if (cancelled) return;
      setSmooth(engine.smooth);
      setReady(true);
    });

    return () => {
      cancelled = true;
      // StrictMode double-invokes effects: full teardown keeps things honest.
      engine.destroy();
      unbindEngine();
      setReady(false);
    };
  }, [engine]);

  const value = useMemo<ScrollContextValue>(
    () => ({
      ready,
      smooth,
      engine,
      scroller: smooth ? (containerRef.current ?? null) : null,
      scrollTo: (target, options) => engine.scrollTo(target, options),
      subscribe: (listener) => engine.subscribe(listener),
      pause: () => engine.pause(),
      unlock: () => engine.unlock(),
      refresh: () => engine.refresh(),
    }),
    [engine, ready, smooth],
  );

  return (
    <ScrollContext.Provider value={value}>
      {overlays}
      <main
        id="content"
        ref={containerRef}
        data-scroll-container
        className="relative w-full overflow-x-clip"
      >
        {children}
      </main>
    </ScrollContext.Provider>
  );
}

export function useScrollEngine(): ScrollContextValue {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error("useScrollEngine must be used inside <ScrollEngineProvider>");
  }
  return context;
}

/**
 * Smooth-scroll anchor navigation.
 * Returns a click handler that delegates to Locomotive so anchors stay
 * perfectly in sync with the virtual scroll position.
 */
export function useAnchorScroll() {
  const { scrollTo, ready } = useScrollEngine();
  const router = useRouter();

  return useCallback(
    (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, hash: string, offset = 0) => {
      if (!hash.startsWith("#")) return;
      event.preventDefault();
      const target = hash === "#top" ? 0 : hash;

      // Navigating from a sub-page (e.g. /work/ai-code-reviewer) where the
      // section does not exist: send the visitor home, anchored.
      if (typeof target === "string" && !document.querySelector(target)) {
        router.push(`/${target}`);
        return;
      }
      if (!ready && typeof window !== "undefined") {
        // Extremely early interaction: fall back to the browser.
        if (typeof target === "number") window.scrollTo({ top: 0, behavior: "smooth" });
        else document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
        return;
      }
      scrollTo(target, { offset, duration: 1.1 });
      // Keep the URL shareable without triggering a second, native jump.
      if (typeof window !== "undefined" && hash !== "#top") {
        window.history.replaceState(null, "", hash);
      }
    },
    [ready, scrollTo],
  );
}
