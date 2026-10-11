"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Animated display typography.
 *
 * Each word sits in an overflow-hidden line so it can rise into place on
 * scroll — the classic editorial reveal — while the caller keeps full control
 * of semantics (`as` renders the real heading element).
 */
export function SplitHeading({
  text,
  className,
  wordClassName,
  id,
  as: Tag = "h2",
  delay = 0,
  stagger = 0.055,
  once = true,
  play = true,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  /** Passed to the rendered heading element so `aria-labelledby` keeps working. */
  id?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  stagger?: number;
  once?: boolean;
  /** Force the animation (used by the hero, which plays on load). */
  play?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, amount: 0.4 });
  const active = play && (inView || !once);
  const words = text.split(" ");

  return (
    <Tag id={id} className={cn(className)}>
      <span ref={ref} className="inline">
        {words.map((word, index) => (
          <span
            key={`${word}-${index}`}
            data-animate=""
            className={cn("inline-block overflow-hidden pb-[0.06em] align-bottom", wordClassName)}
          >
            <motion.span
              className="inline-block will-change-transform"
              initial={{ y: "115%", opacity: 0 }}
              animate={active ? { y: "0%", opacity: 1 } : { y: "115%", opacity: 0 }}
              transition={{
                duration: 1.05,
                delay: delay + index * stagger,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {word}
              {index < words.length - 1 ? "\u00A0" : ""}
            </motion.span>
          </span>
        ))}
      </span>
    </Tag>
  );
}

/**
 * Per-character reveal for short, high-impact lines (the hero headline).
 * Screen readers get the intact string through `aria-label`.
 */
export function CharReveal({
  text,
  className,
  delay = 0,
  stagger = 0.022,
  play = true,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  play?: boolean;
}) {
  const characters = Array.from(text);

  return (
    <span className={cn("inline-block", className)} aria-label={text}>
      {characters.map((char, index) => (
        <span
          key={`${char}-${index}`}
          data-animate=""
          className="inline-block overflow-hidden"
          aria-hidden="true"
        >
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: "108%" }}
            animate={play ? { y: "0%" } : { y: "108%" }}
            transition={{
              duration: 0.95,
              delay: delay + index * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
