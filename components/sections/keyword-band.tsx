"use client";

import { Marquee } from "@/components/ui/marquee";

const KEYWORDS = [
  "Full-stack development",
  "Backend engineering",
  "AI integration",
  "Retrieval-augmented generation",
  "Computer vision",
  "Interactive 3D",
  "API design",
  "Data modelling",
];

/**
 * Divider between the hero and the work section: a scroll-reactive band that
 * speeds up and reverses with the page. Slides gently out of the way as the
 * showcase pins.
 */
export function KeywordBand() {
  return (
    <div className="relative border-y border-line bg-void/60 py-6 sm:py-8">
      <Marquee
        items={KEYWORDS}
        mode="scroll"
        itemClassName="font-display text-[clamp(1.1rem,2.6vw,2.1rem)] tracking-[-0.02em] text-ash-dim uppercase"
      />
    </div>
  );
}
