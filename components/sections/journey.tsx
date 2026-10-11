"use client";

import { BookOpen, Briefcase, Code2, GraduationCap } from "lucide-react";

import { journey } from "@/data/journey";
import type { JourneyEntry } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useGsapScope } from "@/hooks/use-gsap-scope";
import { Reveal, SectionLabel } from "@/components/animations/reveal";
import { SplitHeading } from "@/components/animations/text-reveal";

const ICONS: Record<JourneyEntry["kind"], typeof GraduationCap> = {
  education: GraduationCap,
  project: Code2,
  learning: BookOpen,
  work: Briefcase,
};

const KIND_LABEL: Record<JourneyEntry["kind"], string> = {
  education: "Education",
  project: "Projects",
  learning: "Self-directed",
  work: "Next",
};

/**
 * JOURNEY — animated timeline.
 *
 * The lime spine fills as you scroll: one scrubbed GSAP tween on a `scaleY`
 * (transform only, no layout writes). Entries reveal individually. Dates come
 * straight from `data/journey.ts` and are never inferred.
 */
export function Journey() {
  const scope = useGsapScope(({ gsap, scroller, scope }) => {
    const spine = scope.querySelector("[data-spine]");
    if (!spine) return;

    gsap.fromTo(
      spine,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        transformOrigin: "top center",
        scrollTrigger: {
          trigger: scope,
          start: "top 70%",
          end: "bottom 75%",
          scrub: 0.5,
          scroller,
          invalidateOnRefresh: true,
        },
      },
    );
  }, []);

  return (
    <section id="journey" ref={scope} aria-labelledby="journey-heading" className="relative py-24 sm:py-32">
      <div className="shell">
        <SectionLabel index="04" label="Journey" />

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
          <SplitHeading
            as="h2"
            id="journey-heading"
            className="text-display-lg max-w-xl text-chrome"
            text="From coursework to shipped software."
          />
          <Reveal delay={0.08}>
            <p className="text-body-lg max-w-md lg:pb-2">
              Everything below is verifiable: a formal diploma in progress, five projects in the
              open, and the specific subjects each one forced me to learn properly.
            </p>
          </Reveal>
        </div>

        <ol className="relative mt-16 flex flex-col gap-12">
          {/* timeline spine */}
          <div
            aria-hidden="true"
            className="absolute left-[11px] top-2 hidden h-[calc(100%-1rem)] w-px bg-line sm:block"
          >
            <div data-spine className="h-full w-px origin-top scale-y-0 bg-volt" />
          </div>

          {journey.map((entry, index) => {
            const Icon = ICONS[entry.kind];
            return (
              <li key={entry.id} className="relative pl-0 sm:pl-12">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1.5 hidden size-6 place-items-center rounded-full border border-line-strong bg-obsidian sm:grid"
                >
                  <Icon className="size-3 text-volt" />
                </span>

                <Reveal delay={index * 0.04} amount={0.25}>
                  <article className="panel group relative p-6 transition-colors duration-500 hover:border-line-strong">
                    <div className="flex flex-wrap items-baseline justify-between gap-4">
                      <span className="flex items-center gap-3 font-mono text-[0.625rem] tracking-[0.22em] text-volt uppercase">
                        <Icon className="size-3.5 sm:hidden" aria-hidden="true" />
                        {entry.period}
                        <span className="text-ash-dim">·</span>
                        <span className="text-ash-dim">{KIND_LABEL[entry.kind]}</span>
                      </span>
                      <span className="font-mono text-[0.5625rem] tracking-[0.18em] text-ash-dim uppercase">
                        {String(index + 1).padStart(2, "0")}/{String(journey.length).padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="mt-4 font-display text-[1.6rem] leading-tight tracking-[-0.03em] text-chrome sm:text-[2rem]">
                      {entry.title}
                    </h3>
                    <p className="mt-1 font-mono text-[0.625rem] tracking-[0.16em] text-ash-dim uppercase">
                      {entry.org}
                    </p>
                    <p className="mt-4 max-w-3xl text-[0.9375rem] leading-relaxed text-ash">
                      {entry.description}
                    </p>

                    <ul className="mt-5 flex flex-col gap-2 border-t border-line pt-4">
                      {entry.points.map((point) => (
                        <li
                          key={point}
                          className={cn(
                            "flex items-start gap-3 text-[0.875rem] leading-relaxed text-ash",
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className="mt-2 size-1 shrink-0 rounded-full bg-volt"
                          />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
