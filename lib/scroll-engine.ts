"use client";

import type { LocomotiveScrollInstance } from "locomotive-scroll";
import type LocomotiveScroll from "locomotive-scroll";

import { ScrollTrigger, gsap } from "@/lib/gsap";

export type ScrollState = {
  /** Current (smoothed) scroll offset in px. */
  y: number;
  progress: number;
  direction: "up" | "down";
  speed: number;
  /** True while the smooth scroller is still catching up to its target. */
  moving: boolean;
};

type Listener = (state: ScrollState) => void;

function reducedMotionSafe(): ScrollBehavior {
  return prefersReducedMotion() ? "auto" : "smooth";
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * OBSIDIAN — scroll engine.
 *
 * One place owns every moving part of the scroll system:
 *
 *   1. Locomotive Scroll v4 in `smooth: true` mode (transform-based) on desktop,
 *      and a first-class *native* Loco instance on touch devices so mobile keeps
 *      buttery, un-hijacked, browser-native scrolling (no pinning, no fighting).
 *   2. A `ScrollTrigger.scrollerProxy` so GSAP measures against Locomotive's
 *      virtual scroll position instead of `window.scrollY` (which never moves
 *      while Loco owns the transform).
 *   3. A demand-driven rAF loop that keeps ScrollTrigger in sync while Loco
 *      interpolates and sleeps as soon as everything settles — no idle battery
 *      drain, no competing animation loops.
 *
 * Both libraries animate *different* properties on purpose:
 * Locomotive owns the container `translateY`, GSAP owns everything inside it.
 */
export class ScrollEngine {
  loco: LocomotiveScroll | null = null;
  container: HTMLElement | null = null;
  /** True when Locomotive is interpolating (proxy + pinType transform apply). */
  smooth = false;
  ready = false;

  private listeners = new Set<Listener>();
  private raf = 0;
  private running = false;
  private settleFrames = 0;
  private lastY = -1;
  private lastDirection: "up" | "down" = "down";
  private onLocoScroll?: (instance: LocomotiveScrollInstance) => void;
  private onRefresh?: () => void;
  private destroyed = false;
  /** Invalidates in-flight `init()` calls when an effect is torn down mid-boot. */
  private initToken = 0;

  async init(container: HTMLElement): Promise<void> {
    if (this.ready) return;

    // React StrictMode mounts effects twice in development: a teardown can land
    // between the dynamic import starting and resolving, so each boot takes a
    // token and revives the instance. Without this, the second mount would bail
    // on the previous teardown's `destroyed` flag and the site would silently
    // fall back to native scrolling in `npm run dev`.
    this.destroyed = false;
    this.container = container;
    const token = (this.initToken += 1);

    const reduced = prefersReducedMotion();
    const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    const isNarrow = window.innerWidth < 1024;

    try {
      const { default: LocomotiveScrollCtor } = await import("locomotive-scroll");
      if (this.destroyed || token !== this.initToken) return;

      this.loco = new LocomotiveScrollCtor({
        el: container,
        name: "scroll",
        // Smooth transform scrolling only for precise pointers on large screens.
        smooth: !reduced && !isTouch && !isNarrow,
        lerp: 0.085,
        multiplier: 1.05,
        class: "is-inview",
        getDirection: true,
        getSpeed: true,
        // Listen on `document` so the fixed navigation/overlays still scroll.
        scrollFromAnywhere: true,
        resetNativeScroll: true,
        tablet: { smooth: false, breakpoint: 1024 },
        smartphone: { smooth: false },
      });
    } catch (error) {
      // Never let a smooth-scroll failure take the page down: the site falls
      // back to native scrolling with ScrollTrigger on the window scroller.
      console.warn("[obsidian] Smooth scrolling unavailable, using native scroll.", error);
      this.smooth = false;
      this.ready = true;
      return;
    }

    this.smooth = Boolean(this.loco.scroll && this.loco.el && this.loco.el.classList.contains("has-scroll-smooth"));
    // `has-scroll-smooth` is applied to <html> by Locomotive, so read it there.
    this.smooth = document.documentElement.classList.contains("has-scroll-smooth");

    if (this.smooth) {
      ScrollTrigger.scrollerProxy(container, {
        scrollTop(value) {
          if (typeof value === "number") {
            // Triggered by ScrollTrigger.refresh()/pin recalculation: jump
            // without animation and without lerp so measurements stay honest.
            engineLoco()?.scrollTo(value, { duration: 0, disableLerp: true });
          }
          return engineLoco()?.scroll.instance.scroll.y ?? 0;
        },
        scrollLeft() {
          return 0;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        },
        // The container itself carries Locomotive's translate3d, so pins must
        // be transform-based rather than position: fixed.
        pinType: "transform",
      });
    }

    this.onLocoScroll = () => this.wake();
    this.loco.on("scroll", this.onLocoScroll);

    // Lovable detail: re-measure Locomotive whenever ScrollTrigger recomputes
    // (pin spacers change the document height, so Loco's limit must follow).
    this.onRefresh = () => {
      this.loco?.update();
      this.wake();
    };
    ScrollTrigger.addEventListener("refresh", this.onRefresh);

    // Fonts/images can change the layout after first paint.
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!this.destroyed && token === this.initToken) this.refresh();
      });
    }

    this.ready = true;
    this.refresh();
  }

  /** Hard re-measure of both libraries. Safe to call at any time. */
  refresh(): void {
    if (!this.ready) return;
    ScrollTrigger.refresh();
    this.loco?.update();
    this.wake();
  }

  scrollTo(
    target: string | HTMLElement | number,
    options: { offset?: number; duration?: number; onComplete?: () => void } = {},
  ): void {
    const { offset = 0, duration = 1.05, onComplete } = options;

    if (this.loco) {
      this.loco.scrollTo(target, {
        offset,
        duration: Math.round(duration * 1000),
        easing: [0.22, 1, 0.36, 1],
        callback: () => {
          this.wake();
          onComplete?.();
        },
      });
      this.wake();
      return;
    }

    // Native fallback (reduced motion, touch devices, or engine failure).
    if (typeof target === "number") {
      window.scrollTo({ top: target + offset, behavior: reducedMotionSafe() });
      onComplete?.();
      return;
    }

    const el =
      typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
    if (!el) return;

    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: reducedMotionSafe() });
    onComplete?.();
  }

  /** Locks background scrolling (mobile menu / project case-study modal). */
  pause(): void {
    this.loco?.stop();
  }

  unlock(): void {
    this.loco?.start();
  }

  get y(): number {
    return this.loco?.scroll.instance.scroll.y ?? (typeof window === "undefined" ? 0 : window.scrollY);
  }

  get limit(): number {
    if (!this.loco) {
      return typeof document === "undefined"
        ? 0
        : document.documentElement.scrollHeight - window.innerHeight;
    }
    return Math.max(this.loco.scroll.instance.limit.y, 1);
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.snapshot());
    this.wake();
    return () => {
      this.listeners.delete(listener);
    };
  }

  private snapshot(): ScrollState {
    return {
      y: this.y,
      progress: Math.min(Math.max(this.y / this.limit, 0), 1),
      direction: this.lastDirection,
      speed: this.loco?.scroll.instance.speed ?? 0,
      moving: this.running,
    };
  }

  /** Starts (or keeps alive) the sync loop. Stops itself once settled. */
  private wake(): void {
    if (this.destroyed) return;
    this.settleFrames = 0;
    if (this.running) return;
    this.running = true;
    this.raf = requestAnimationFrame(this.loop);
  }

  private loop = (): void => {
    if (this.destroyed || !this.loco) {
      this.running = false;
      return;
    }

    const y = this.loco.scroll.instance.scroll.y;
    if (Math.abs(y - this.lastY) > 0.05) {
      if (y < this.lastY) this.lastDirection = "up";
      else if (y > this.lastY) this.lastDirection = "down";
      this.lastY = y;
      this.settleFrames = 0;
      // GSAP does the maths, Locomotive owns the transform.
      ScrollTrigger.update();
      const state = this.snapshot();
      this.listeners.forEach((listener) => listener(state));
    } else if (++this.settleFrames > 6) {
      // Locomotive has caught up: let the main thread rest.
      this.running = false;
      this.settleFrames = 0;
      return;
    }

    this.raf = requestAnimationFrame(this.loop);
  };

  destroy(): void {
    this.destroyed = true;
    // Any in-flight init() aborts on its next check.
    this.initToken += 1;
    cancelAnimationFrame(this.raf);
    this.listeners.clear();
    if (this.onRefresh) ScrollTrigger.removeEventListener("refresh", this.onRefresh);
    if (this.loco && this.onLocoScroll) this.loco.off("scroll", this.onLocoScroll);
    this.loco?.destroy();
    this.loco = null;
    this.ready = false;
    this.running = false;
    // Locomotive sets these on <html>; leaving them behind breaks native scroll.
    document.documentElement.classList.remove("has-scroll-smooth", "has-scroll-init");
    document.documentElement.removeAttribute("data-scroll-direction");
    document.querySelector(".c-scrollbar")?.remove();
  }
}

/**
 * `scrollTo` inside the proxy needs access to the live engine instance while
 * staying a plain function (ScrollTrigger stores it, not a bound method).
 */
let engineRef: ScrollEngine | null = null;
let engineLoco: () => LocomotiveScroll | null = () => null;

export function bindEngine(engine: ScrollEngine): void {
  engineRef = engine;
  engineLoco = () => engineRef?.loco ?? null;
}

export function unbindEngine(): void {
  engineRef = null;
  engineLoco = () => null;
}

/** gsap.ticker-friendly helper for components that need per-frame scroll maths. */
export function onScrollFrame(callback: () => void): () => void {
  const id = gsap.ticker.add(callback);
  return () => gsap.ticker.remove(id);
}
