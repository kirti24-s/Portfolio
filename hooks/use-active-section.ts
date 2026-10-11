"use client";

import { useEffect, useState } from "react";

/** True after the first client commit — the standard hydration escape hatch. */
export function useIsMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/**
 * Tracks which of the given section ids owns the viewport.
 *
 * IntersectionObserver instead of scroll maths: it is cheap, works identically
 * with Locomotive's transformed container and with native scrolling, and needs
 * no re-measurement when sections grow (project case studies, images…).
 */
export function useActiveSection(ids: string[], rootMargin = "-38% 0px -52% 0px"): string {
  const [active, setActive] = useState("");

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));
    if (elements.length === 0) return;

    const visible = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        let bestId = "";
        let bestRatio = 0;
        visible.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });

        if (bestId) setActive(bestId);
      },
      {
        rootMargin,
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [ids, rootMargin]);

  return active;
}
