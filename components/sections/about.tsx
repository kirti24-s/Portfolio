"use client";

import { motion } from "framer-motion";
import { GraduationCap, Layers, Sparkles, Workflow } from "lucide-react";

import { siteConfig } from "@/data/site-config";
import { Reveal, RevealGroup, RevealItem, SectionLabel } from "@/components/animations/reveal";
import { SplitHeading } from "@/components/animations/text-reveal";

const FOCUS_ICONS = [Layers, Workflow, Sparkles, GraduationCap];

/**
 * ABOUT — editorial two-column layout.
 *
 * Left: the narrative. Right: what I actually do, plus the way I work. The
 * headline animates word-by-word on scroll; the paragraphs fade in sequence.
 */
export function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="relative py-24 sm:py-32">
      <div className="shell">
        <SectionLabel index="02" label="About" />

        <div className="mt-10 grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div className="flex flex-col gap-8">
            <SplitHeading
              as="h2"
              id="about-heading"
              className="text-display-lg max-w-2xl text-chrome"
              text="A student engineer with a systems mindset."
            />

            <Reveal delay={0.05}>
              <p className="text-body-lg max-w-2xl">{siteConfig.about.intro}</p>
            </Reveal>

            <div className="flex flex-col gap-6">
              {siteConfig.about.paragraphs.map((paragraph, index) => (
                <Reveal key={paragraph.slice(0, 24)} delay={0.08 * index}>
                  <p className="max-w-2xl text-[0.9375rem] leading-[1.75] text-ash">{paragraph}</p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.1}>
              <ul className="flex flex-wrap gap-x-6 gap-y-3 border-t border-line pt-6">
                {siteConfig.about.principles.map((principle, index) => (
                  <li
                    key={principle}
                    className="flex items-center gap-3 font-mono text-[0.6875rem] tracking-[0.14em] text-ash uppercase"
                  >
                    <span className="text-volt">{String(index + 1).padStart(2, "0")}</span>
                    {principle}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="flex flex-col gap-10">
            {/* Focus areas */}
            <RevealGroup className="flex flex-col divide-y divide-line border-y border-line">
              {siteConfig.about.focus.map((item, index) => {
                const Icon = FOCUS_ICONS[index % FOCUS_ICONS.length];
                return (
                  <RevealItem key={item.label}>
                    <div className="group flex items-start gap-5 py-5">
                      <span className="grid size-10 shrink-0 place-items-center border border-line text-volt transition-colors duration-500 group-hover:border-volt/60 group-hover:bg-volt/5">
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      <div className="flex flex-col gap-1">
                        <span className="font-display text-lg text-chrome">{item.label}</span>
                        <span className="text-sm leading-relaxed text-ash">{item.detail}</span>
                      </div>
                    </div>
                  </RevealItem>
                );
              })}
            </RevealGroup>

            {/* Abstract portrait frame */}
            <Reveal delay={0.1}>
              <div className="panel relative aspect-[4/3] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(70%_70%_at_30%_20%,rgba(204,255,0,0.14),transparent_60%)]" />
                <div className="grid-lines absolute inset-0 opacity-60" />
                <motion.div
                  className="absolute -right-10 -top-10 size-48 rounded-full border border-volt/25"
                  animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.85, 0.5] }}
                  transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute -bottom-16 -left-10 size-56 rounded-full border border-chrome/10"
                  animate={{ scale: [1, 1.12, 1] }}
                  transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="relative flex h-full flex-col justify-between p-6">
                  <span className="font-mono text-[0.625rem] tracking-[0.2em] text-ash-dim uppercase">
                    Portrait slot
                  </span>
                  <div className="flex flex-col gap-2">
                    <span className="font-display text-[2rem] leading-none tracking-[-0.03em] text-chrome">
                      {siteConfig.name.full}
                    </span>
                    <span className="font-mono text-[0.625rem] tracking-[0.18em] text-volt uppercase">
                      {siteConfig.role}
                    </span>
                    <span className="font-mono text-[0.5625rem] tracking-[0.16em] text-ash-dim uppercase">
                      Drop a photo at public/images/portrait.jpg and swap this block
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
