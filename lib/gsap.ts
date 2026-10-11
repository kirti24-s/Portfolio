"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Single registration point for GSAP plugins.
 *
 * GSAP is imported statically here (it is SSR-safe) while Locomotive Scroll is
 * imported dynamically inside the engine because its dependency tree touches
 * `document` at module scope.
 */
let registered = false;

export const gsapRegistered: typeof gsap = (() => {
  if (typeof window !== "undefined" && !registered) {
    registered = true;
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: "power3.out", duration: 0.9 });
    ScrollTrigger.config({
      // Mobile browsers fire a resize when the URL bar collapses — ignore it so
      // pinned sections do not jump while scrolling. Everything else (resize,
      // visibilitychange, load, popstate) keeps ScrollTrigger's defaults.
      ignoreMobileResize: true,
    });
  }
  return gsap;
})();

export { gsap, ScrollTrigger };

export const EASE = {
  expo: "expo.out",
  power: "power3.out",
  inOut: "power2.inOut",
  none: "none",
} as const;

/** GSAP-backed media query helpers that auto-revert their context. */
export const BP = {
  mobile: "(max-width: 767px)",
  tablet: "(max-width: 1023px)",
  desktop: "(min-width: 1024px)",
  reduced: "(prefers-reduced-motion: reduce)",
} as const;
