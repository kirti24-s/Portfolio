"use client";

import { useEffect, useRef } from "react";
import type { DependencyList, RefObject } from "react";

import { ScrollTrigger, gsap } from "@/lib/gsap";
import { useScrollEngine } from "@/components/providers/scroll-provider";

type ScopeElement = HTMLElement | SVGElement;

export type GsapScopeApi = {
  gsap: typeof gsap;
  ScrollTrigger: typeof ScrollTrigger;
  /** `undefined` in native-scroll mode → ScrollTrigger falls back to window. */
  scroller: HTMLElement | undefined;
  scope: ScopeElement;
  /** Re-measure after DOM/height changes created by this setup. */
  refresh: () => void;
};

/**
 * `useGsapScope` — the one supported way to build GSAP timelines in this
 * project. It waits for the scroll engine, creates a `gsap.context()` scoped to
 * the returned ref (so every tween/ScrollTrigger is reverted automatically),
 * and always hands you the right `scroller` for the active scroll mode.
 *
 *   const scope = useGsapScope(({ gsap, ScrollTrigger, scroller }) => {
 *     gsap.from(".card", { y: 40, scrollTrigger: { trigger: ".card", scroller } });
 *   });
 *   return <section ref={scope}>…</section>;
 */
export function useGsapScope<T extends ScopeElement = HTMLDivElement>(
  setup: (api: GsapScopeApi) => void | (() => void),
  deps: DependencyList = [],
): RefObject<T | null> {
  const scopeRef = useRef<T | null>(null);
  const setupRef = useRef(setup);
  setupRef.current = setup;

  const { ready, engine, scroller } = useScrollEngine();

  useEffect(() => {
    if (!ready) return;
    const scope = scopeRef.current;
    if (!scope) return;

    // Reduced motion: never build scroll timelines at all.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let extraCleanup: (() => void) | void;

    const context = gsap.context(() => {
      if (reduced) return;
      extraCleanup = setupRef.current({
        gsap,
        ScrollTrigger,
        scroller: scroller ?? undefined,
        scope,
        refresh: () => engine.refresh(),
      });
    }, scope);

    // Layout for this tree changed: let ScrollTrigger re-measure once painted.
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(frame);
      context.revert();
      if (typeof extraCleanup === "function") extraCleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, scroller, engine, ...deps]);

  return scopeRef;
}
