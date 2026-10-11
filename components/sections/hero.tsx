"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowDown, MoveDown, Sparkles } from "lucide-react";

import { siteConfig } from "@/data/site-config";
import { cn } from "@/lib/utils";
import { usePointerRef } from "@/hooks/use-pointer-ref";
import { useIsMobile, useMediaQuery, useReducedMotion } from "@/hooks/use-media-query";
import { useWebGLSupport } from "@/lib/webgl";
import { useGsapScope } from "@/hooks/use-gsap-scope";
import { useAnchorScroll } from "@/components/providers/scroll-provider";
import { useIntro } from "@/components/providers/intro-provider";
import { CoreFallback } from "@/components/three/core-fallback";
import { CharReveal } from "@/components/animations/text-reveal";
import { ButtonAnchor } from "@/components/ui/button";

/**
 * The WebGL scene (three.js + React Three Fiber + drei, ~350 kB) is split out of
 * the initial payload and only requested once the hero is on screen and WebGL
 * has been confirmed. The CSS/SVG core renders instantly underneath, so the
 * first paint never waits on the 3D bundle.
 */
const HeroScene = dynamic(() => import("@/components/three/hero-scene").then((m) => m.HeroScene), {
  ssr: false,
});

const TECH_LABELS = [
  "Next.js",
  "React Three Fiber",
  "GSAP ScrollTrigger",
  "Locomotive Scroll",
  "TypeScript",
];

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

/**
 * HERO — "Engineering the extraordinary."
 *
 * Layering, from back to front:
 *   1. CSS atmospheric gradients + grid (instant paint, no JS)
 *   2. The 3D core scene (fades in over the layer below once WebGL is ready)
 *   3. The CSS/SVG core fallback — visible immediately, and the permanent
 *      scene on devices without WebGL, with motion reduced, or on context loss
 *   4. Editorial copy: technical labels, oversized headline, CTAs, scroll cue
 *
 * Scroll behaviour is a single scrubbed GSAP timeline (copy drifts out, the
 * scene scales and fades, the hint disappears) whose progress is also piped
 * into the 3D camera — one source of truth for "how far into the hero we are".
 */
export function Hero() {
  const pointer = usePointerRef();
  const scrollRef = useRef(0);
  const anchor = useAnchorScroll();
  const { introDone } = useIntro();
  const webgl = useWebGLSupport();
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const isTablet = useMediaQuery("(max-width: 1023px)");
  const [sceneReady, setSceneReady] = useState(false);

  const quality = isMobile ? "low" : isTablet ? "medium" : "high";
  const showScene = webgl === true && !reduced;
  const [showFallback, setShowFallback] = useState(true);

  // Once the WebGL scene has painted, retire the CSS/SVG stand-in so its
  // animations stop running behind an opaque canvas.
  useEffect(() => {
    if (!sceneReady) return;
    const timeout = window.setTimeout(() => setShowFallback(false), 1500);
    return () => window.clearTimeout(timeout);
  }, [sceneReady]);

  const scope = useGsapScope(({ gsap, scroller, scope }) => {
    if (!scope) return;
    const section = scope;

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: 0.6,
        scroller,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Consumed by <HeroScene> inside useFrame — no React state involved.
          scrollRef.current = self.progress;
        },
      },
    });

    timeline
      .to("[data-hero-copy]", { yPercent: -14, opacity: 0.12, ease: "none" }, 0)
      .to("[data-hero-scene]", { scale: 1.06, opacity: 0.15, ease: "none" }, 0)
      .to("[data-hero-hint]", { opacity: 0, y: 18, ease: "none" }, 0)
      .to("[data-hero-rail]", { opacity: 0, ease: "none" }, 0);
  }, []);

  return (
    <section
      id="home"
      ref={scope}
      aria-labelledby="hero-heading"
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden pt-28 sm:pt-32"
    >
      {/* 1 — atmospheric background */}
      <div aria-hidden="true" className="absolute inset-0 -z-30">
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,#0b0f16_0%,#04060a_55%,#04060a_100%)]" />
        <div className="grid-lines absolute inset-0 opacity-[0.5] mask-fade-b" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-obsidian to-transparent" />
      </div>

      {/* 2/3 — the 3D core, with an instant-paint fallback beneath it */}
      <div data-hero-scene className="absolute inset-0 -z-20">
        {showFallback ? (
          <div className="absolute inset-0">
            <CoreFallback className="opacity-90" />
          </div>
        ) : null}
        {showScene ? (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: sceneReady ? 1 : 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <HeroScene
              pointer={pointer}
              scroll={scrollRef}
              quality={quality}
              fallback={<CoreFallback />}
              onReady={() => setSceneReady(true)}
            />
          </motion.div>
        ) : null}
      </div>

      {/* 4 — editorial copy */}
      <div data-hero-copy className="shell relative z-10 flex w-full flex-1 flex-col justify-center">
        <motion.div
          className="flex flex-wrap items-center gap-x-6 gap-y-3"
          variants={fadeUp}
          custom={0.15}
          initial="hidden"
          animate={introDone ? "visible" : "hidden"}
        >
          <span className="flex items-center gap-2 font-mono text-[0.625rem] tracking-[0.28em] text-volt uppercase">
            <Sparkles className="size-3.5" aria-hidden="true" />
            {siteConfig.availability}
          </span>
          <span className="hidden h-3 w-px bg-line-strong sm:block" aria-hidden="true" />
          <span className="font-mono text-[0.625rem] tracking-[0.28em] text-ash-dim uppercase">
            {siteConfig.location}
          </span>
        </motion.div>

        <h1
          id="hero-heading"
          className="mt-8 max-w-[16ch] font-display text-[clamp(2.9rem,10.2vw,9.5rem)] leading-[0.9] font-medium tracking-[-0.045em]"
        >
          <span className="block">
            <CharReveal text={siteConfig.headline.line1} play={introDone} delay={0.25} />
          </span>
          <span className="text-chrome block italic">
            <CharReveal
              text={siteConfig.headline.line2}
              play={introDone}
              delay={0.5}
              stagger={0.018}
            />
          </span>
        </h1>

        <motion.p
          className="text-body-lg mt-8 max-w-xl"
          variants={fadeUp}
          custom={0.95}
          initial="hidden"
          animate={introDone ? "visible" : "hidden"}
        >
          {siteConfig.subheadline}
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4"
          variants={fadeUp}
          custom={1.05}
          initial="hidden"
          animate={introDone ? "visible" : "hidden"}
        >
          <ButtonAnchor
            href="#work"
            size="lg"
            onClick={(event) => anchor(event, "#work")}
            icon={<ArrowDown className="size-4" />}
            data-cursor-label="Projects"
          >
            Explore My Work
          </ButtonAnchor>
          <ButtonAnchor
            href="#contact"
            size="lg"
            variant="outline"
            onClick={(event) => anchor(event, "#contact")}
            data-cursor-label="Say hello"
          >
            Let&apos;s Connect
          </ButtonAnchor>
        </motion.div>
      </div>

      {/* Bottom strip: technical labels + scroll cue */}
      <div className="shell relative z-10 w-full pb-8 sm:pb-10">
        <div className="rule mb-6" />
        <div className="flex flex-wrap items-end justify-between gap-6">
          <motion.ul
            className="flex flex-wrap items-center gap-x-5 gap-y-2"
            variants={fadeUp}
            custom={1.2}
            initial="hidden"
            animate={introDone ? "visible" : "hidden"}
          >
            {TECH_LABELS.map((label, index) => (
              <li key={label} className="flex items-center gap-5">
                <span className="font-mono text-[0.625rem] tracking-[0.2em] text-ash-dim uppercase">
                  {label}
                </span>
                {index < TECH_LABELS.length - 1 ? (
                  <span className="text-volt/50" aria-hidden="true">
                    ·
                  </span>
                ) : null}
              </li>
            ))}
          </motion.ul>

          <motion.button
            data-hero-hint
            type="button"
            onClick={(event) => anchor(event, "#work")}
            className="group flex items-center gap-3 text-left"
            variants={fadeUp}
            custom={1.3}
            initial="hidden"
            animate={introDone ? "visible" : "hidden"}
            aria-label="Scroll to selected work"
            data-cursor-label="Scroll"
          >
            <span className="relative flex h-12 w-[1px] overflow-hidden bg-line-strong">
              <motion.span
                className="absolute inset-x-0 top-0 h-4 bg-volt"
                animate={{ y: [-16, 48] }}
                transition={{ duration: 2.2, ease: "easeInOut", repeat: Infinity }}
              />
            </span>
            <span className="flex flex-col">
              <span className="font-mono text-[0.625rem] tracking-[0.2em] text-chrome uppercase">
                Scroll
              </span>
              <span className="font-mono text-[0.625rem] tracking-[0.2em] text-ash-dim uppercase">
                Selected work
              </span>
            </span>
            <MoveDown
              className="size-4 text-volt transition-transform duration-500 group-hover:translate-y-1"
              aria-hidden="true"
            />
          </motion.button>
        </div>
      </div>

      {/* Side rail: rotated technical label */}
      <div
        data-hero-rail
        aria-hidden="true"
        className="absolute right-4 top-1/2 hidden -translate-y-1/2 xl:block"
      >
        <div className="flex flex-col items-center gap-4">
          <span className="h-24 w-px bg-gradient-to-b from-transparent via-line-strong to-transparent" />
          <span className="font-mono text-[0.5625rem] tracking-[0.34em] text-ash-dim uppercase [writing-mode:vertical-rl]">
            Obsidian · 3D Portfolio · {new Date().getFullYear()}
          </span>
          <LocalClock className="[writing-mode:vertical-rl]" />
          <span className="h-24 w-px bg-gradient-to-b from-transparent via-line-strong to-transparent" />
        </div>
      </div>
    </section>
  );
}

/**
 * Live local time. Rendered only after mount so the server HTML and the first
 * client render always agree (no hydration mismatch).
 */
function LocalClock({ className }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZoneName: "short",
        }).format(new Date()),
      );
    update();
    const interval = window.setInterval(update, 30_000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <span
      className={cn("font-mono text-[0.5625rem] tracking-[0.3em] text-volt uppercase", className)}
      suppressHydrationWarning
    >
      {time ?? "—"}
    </span>
  );
}
