/**
 * Minimal ambient types for `locomotive-scroll@4`.
 *
 * The package ships no TypeScript definitions, so this declares exactly the
 * surface this project relies on (verified against
 * `node_modules/locomotive-scroll/src/scripts/*`).
 */
declare module "locomotive-scroll" {
  export interface LocomotiveScrollInstance {
    scroll: { x: number; y: number };
    limit: { x: number; y: number };
    delta: { x: number; y: number };
    speed: number;
    direction: "up" | "down" | "left" | "right" | null;
  }

  export interface ScrollToOptions {
    /** Pixels added to the target position (negative values scroll less far). */
    offset?: number | string;
    /** Animation duration in ms. Defaults to 1000. */
    duration?: number;
    /** Bezier easing array: [x1, y1, x2, y2]. */
    easing?: [number, number, number, number];
    /** Skips the lerp easing once the animation lands. */
    disableLerp?: boolean;
    /** Called when the scroll animation completes. */
    callback?: () => void;
  }

  export interface LocomotiveScrollOptions {
    el?: HTMLElement | null;
    name?: string;
    /** Enables transform-based smooth scrolling (desktop only by default). */
    smooth?: boolean;
    /** Higher = snappier. `inertia * 0.1` under the hood. */
    lerp?: number;
    multiplier?: number;
    class?: string;
    initClass?: string;
    scrollingClass?: string;
    draggingClass?: string;
    smoothClass?: string;
    getDirection?: boolean;
    getSpeed?: boolean;
    offset?: [number, number];
    /** Attach wheel/touch listeners to `document` instead of the container. */
    scrollFromAnywhere?: boolean;
    reloadOnContextChange?: boolean;
    resetNativeScroll?: boolean;
    scrollbarContainer?: HTMLElement | false;
    tablet?: {
      smooth?: boolean;
      breakpoint?: number;
      direction?: "vertical" | "horizontal";
      gestureDirection?: "vertical" | "horizontal";
    };
    smartphone?: {
      smooth?: boolean;
      direction?: "vertical" | "horizontal";
      gestureDirection?: "vertical" | "horizontal";
    };
  }

  type ScrollEventName = "scroll" | "call";

  export default class LocomotiveScroll {
    constructor(options?: LocomotiveScrollOptions);

    /** The smooth (or native) scroll driver — holds live scroll state. */
    scroll: {
      instance: LocomotiveScrollInstance;
      limit: { x: number; y: number };
      isScrolling?: boolean;
      scrollTo(target: string | HTMLElement | number, options?: ScrollToOptions): void;
      update(): void;
      setScroll(x: number, y: number): void;
      destroy(): void;
      stopScroll(): void;
      startScroll(): void;
    };

    el: HTMLElement;

    init(): void;
    update(): void;
    setScroll(x: number, y: number): void;
    scrollTo(target: string | HTMLElement | number, options?: ScrollToOptions): void;
    on(event: ScrollEventName, func: (args: LocomotiveScrollInstance) => void): void;
    off(event: ScrollEventName, func: (args: LocomotiveScrollInstance) => void): void;
    stop(): void;
    start(): void;
    destroy(): void;
  }
}
