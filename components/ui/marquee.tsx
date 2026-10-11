"use client";

import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";

import { cn } from "@/lib/utils";
import { useScrollEngine } from "@/components/providers/scroll-provider";
import { useReducedMotion } from "@/hooks/use-media-query";

/**
 * Infinite marquee band.
 *
 * · `mode="css"` — pure CSS keyframes (cheapest; ambient bands).
 * · `mode="scroll"` — the track drifts on its own and picks up the page's
 *   scroll velocity through the engine subscription, so it accelerates, brakes
 *   and reverses with the page. Transform-only writes, no React re-renders,
 *   and it stops entirely when off-screen or when motion is reduced.
 */
export function Marquee({
  items,
  className,
  itemClassName,
  speed = 46,
  reverse = false,
  mode = "scroll",
  separator = "◆",
}: {
  items: string[];
  className?: string;
  itemClassName?: string;
  /** Seconds per full loop (CSS mode only). */
  speed?: number;
  reverse?: boolean;
  mode?: "css" | "scroll";
  separator?: string;
}) {
  if (mode === "css") {
    return <CssMarquee {...{ items, className, itemClassName, speed, reverse, separator }} />;
  }
  return <ScrollMarquee {...{ items, className, itemClassName, reverse, separator }} />;
}

function Track({
  items,
  itemClassName,
  separator,
}: {
  items: string[];
  itemClassName?: string;
  separator: string;
}) {
  return (
    <>
      {[0, 1].map((copy) => (
        <div key={copy} className="flex items-center">
          {items.map((item, index) => (
            <span
              key={`${copy}-${item}-${index}`}
              className={cn("flex items-center", itemClassName)}
            >
              {item}
              <span className="mx-6 text-volt sm:mx-10" aria-hidden="true">
                {separator}
              </span>
            </span>
          ))}
        </div>
      ))}
    </>
  );
}

function CssMarquee({
  items,
  className,
  itemClassName,
  speed,
  reverse,
  separator,
}: {
  items: string[];
  className?: string;
  itemClassName?: string;
  speed: number;
  reverse: boolean;
  separator: string;
}) {
  return (
    <div className={cn("mask-fade-x relative overflow-hidden", className)} aria-hidden="true">
      <div
        className="flex w-max items-center will-change-transform"
        style={{ animation: `${reverse ? "marquee-rev" : "marquee"} ${speed}s linear infinite` }}
      >
        <Track items={items} itemClassName={itemClassName} separator={separator} />
      </div>
    </div>
  );
}

function ScrollMarquee({
  items,
  className,
  itemClassName,
  reverse,
  separator,
}: {
  items: string[];
  className?: string;
  itemClassName?: string;
  reverse: boolean;
  separator: string;
}) {
  const wrapper = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapper, { margin: "20% 0px 20% 0px" });
  const reduced = useReducedMotion();
  const { subscribe } = useScrollEngine();
  const velocity = useRef(0);

  // Scroll velocity → drift. Subscribing only writes to a ref; the rAF loop
  // below owns the transform, so there is exactly one writer per element.
  useEffect(() => subscribe((state) => {
    velocity.current = Math.max(-8, Math.min(8, state.speed * 0.06));
  }), [subscribe]);

  useEffect(() => {
    if (!inView || reduced) return;
    const element = track.current;
    if (!element) return;

    let offset = 0;
    let raf = 0;
    const base = reverse ? 0.4 : -0.4;

    const tick = () => {
      velocity.current *= 0.94;
      offset += base + velocity.current;

      // Seamless wrap: the track holds two identical copies.
      const half = element.scrollWidth / 2;
      if (half > 0) {
        if (offset <= -half) offset += half;
        if (offset > 0) offset -= half;
      }

      element.style.transform = `translate3d(${offset}px,0,0)`;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, reverse]);

  return (
    <div
      ref={wrapper}
      className={cn("mask-fade-x relative overflow-hidden", className)}
      aria-hidden="true"
    >
      <div ref={track} className="flex w-max items-center will-change-transform">
        <Track items={items} itemClassName={itemClassName} separator={separator} />
      </div>
    </div>
  );
}
