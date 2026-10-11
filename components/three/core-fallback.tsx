"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

/**
 * CORE FALLBACK — what renders when WebGL is unavailable, disabled, or the
 * context is lost. It is deliberately built from the same visual language
 * (chrome sphere, lime orbital rings, dust, atmospheric glow) so the hero never
 * looks broken or empty — just lighter.
 *
 * Pure CSS + SVG: zero JavaScript on the animation path.
 */
export function CoreFallback({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none relative flex h-full w-full items-center justify-center overflow-hidden",
        className,
      )}
      aria-hidden="true"
    >
      {/* atmospheric glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(204,255,0,0.16),transparent_58%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_75%,rgba(111,140,255,0.10),transparent_55%)]" />

      <div className="relative scale-[0.85] sm:scale-100">
        {/* orbital rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          {[
            { size: 340, rotate: 72, duration: 46, opacity: 0.22, accent: false },
            { size: 430, rotate: 28, duration: 64, opacity: 0.34, accent: true },
            { size: 520, rotate: 86, duration: 88, opacity: 0.14, accent: false },
          ].map((ring) => (
            <motion.div
              key={ring.size}
              className="absolute rounded-full border"
              style={{
                width: ring.size,
                height: ring.size,
                transform: `rotateX(${ring.rotate}deg)`,
                borderColor: ring.accent
                  ? `rgba(204,255,0,${ring.opacity})`
                  : `rgba(231,236,243,${ring.opacity})`,
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: ring.duration, ease: "linear", repeat: Infinity }}
            />
          ))}
        </div>

        {/* chrome core */}
        <div className="relative h-[210px] w-[210px] sm:h-[260px] sm:w-[260px]">
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 32% 26%, #ffffff 0%, #dfe6ef 12%, #8d97a6 34%, #303743 58%, #0d1118 78%, #04060a 100%)",
              boxShadow:
                "inset -18px -22px 46px rgba(0,0,0,0.85), inset 12px 14px 30px rgba(255,255,255,0.16), 0 0 90px -10px rgba(204,255,0,0.35)",
            }}
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 9, ease: "easeInOut", repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-0 rounded-full opacity-70 mix-blend-screen"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg, rgba(204,255,0,0.55) 40deg, transparent 120deg, rgba(231,236,243,0.35) 200deg, transparent 300deg)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 18, ease: "linear", repeat: Infinity }}
          />
          <div className="absolute inset-[18%] rounded-full border border-volt/40" />
          <div className="absolute inset-[34%] rounded-full bg-volt/25 blur-[18px]" />
        </div>
      </div>

      {/* dust */}
      <svg className="absolute inset-0 h-full w-full opacity-70" aria-hidden="true">
        <defs>
          <radialGradient id="dust" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e3ff85" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ccff00" stopOpacity="0" />
          </radialGradient>
        </defs>
        {Array.from({ length: 46 }).map((_, index) => {
          const x = (index * 137.5) % 100;
          const y = (index * 61.8) % 100;
          const r = 0.6 + ((index * 7) % 5) * 0.35;
          return (
            <circle
              key={index}
              cx={`${x}%`}
              cy={`${y}%`}
              r={r}
              fill="url(#dust)"
              style={{ animation: `pulse-soft ${5 + (index % 6)}s ease-in-out infinite` }}
            />
          );
        })}
      </svg>
    </div>
  );
}
