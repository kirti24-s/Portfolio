"use client";

import { useCallback, useRef, useState } from "react";
import { ArrowRight, CornerDownRight } from "lucide-react";

import { projects } from "@/data/projects";
import type { Project } from "@/lib/types";
import { cn, padIndex } from "@/lib/utils";
import { useGsapScope } from "@/hooks/use-gsap-scope";
import { useAnchorScroll } from "@/components/providers/scroll-provider";
import { Reveal, SectionLabel } from "@/components/animations/reveal";
import { ProjectEntry } from "@/components/projects/project-entry";
import { ProjectModal } from "@/components/projects/project-modal";

/**
 * SELECTED WORK.
 *
 * Desktop  · a pinned, horizontally scrubbed sequence of oversized project
 *            panels (GSAP ScrollTrigger, `pinType: transform` so it works
 *            inside Locomotive's translated container).
 * Mobile   · the identical data as a clean vertical stack — no pinning, no
 *            horizontal hijacking, natural scrolling preserved.
 *
 * Both layouts come from the same markup; only a `gsap.matchMedia()` branch and
 * a pair of Tailwind classes differ.
 */
export function Work() {
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const anchor = useAnchorScroll();

  const scope = useGsapScope(({ gsap, scroller, scope }) => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const track = scope.querySelector<HTMLElement>("[data-track]");
      const pin = scope.querySelector<HTMLElement>("[data-pin]");
      if (!track || !pin) return;

      const distance = () => Math.max(track.scrollWidth - window.innerWidth + 96, 1);

      const horizontal = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: scope,
          // Pin the viewport-sized stage, not the whole section.
          pin,
          scrub: 1,
          start: "top top",
          end: () => `+=${distance() + window.innerHeight * 0.4}`,
          scroller,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const active = Math.min(
              projects.length,
              Math.max(1, Math.round(self.progress * (projects.length - 1)) + 1),
            );
            if (counter.current) {
              counter.current.textContent = String(active).padStart(2, "0");
            }
            if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
          },
        },
      });

      // Snappier feel: kill the interpolation while the user flings the track.
      ScrollTrigger.addEventListener("refreshInit", () => horizontal.scrollTrigger?.refresh());

      return () => {
        horizontal.scrollTrigger?.kill();
        horizontal.kill();
      };
    });

    return () => mm.revert();
  }, []);

  const handleOpen = useCallback((project: Project) => setOpenProject(project), []);
  const handleClose = useCallback(() => setOpenProject(null), []);

  return (
    <section id="work" ref={scope} aria-labelledby="work-heading" className="relative overflow-x-clip">
      {/* Section header */}
      <div className="shell pt-24 sm:pt-32">
        <SectionLabel index="01" label="Selected work" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <Reveal>
            <h2 id="work-heading" className="text-display-lg max-w-3xl text-chrome">
              Five projects,
              <br />
              <span className="text-ash-dim">one obsession with the details.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-body-lg max-w-md lg:pb-3">
              Each of these started as a gap in my own understanding — a review tool, a retrieval
              pipeline, a ledger, a camera-driven game and a storefront. Case studies describe what
              was actually built, including what is still missing.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Showcase */}
      <div className="mt-16 sm:mt-20 lg:mt-0">
        <div
          data-pin
          className="relative flex flex-col justify-center lg:h-[100svh] lg:overflow-hidden"
        >
          <div
            data-track
            className={cn(
              "flex flex-col gap-16 motion-safe:lg:flex-row motion-safe:lg:items-start motion-safe:lg:gap-12 motion-safe:lg:will-change-transform",
              "shell pb-10 motion-safe:lg:pb-0",
            )}
          >
            {/* Lead panel — sets up the horizontal sequence */}
            <div className="hidden w-[26vw] shrink-0 flex-col justify-center gap-6 pt-24 lg:flex xl:w-[22vw]">
              <span className="font-mono text-[0.625rem] tracking-[0.24em] text-volt uppercase">
                The sequence
              </span>
              <p className="text-body-lg">
                Scroll through the work. Every panel opens a full case study — context, approach and
                the honest list of what is left to do.
              </p>
              <span className="flex items-center gap-3 font-mono text-[0.625rem] tracking-[0.2em] text-ash-dim uppercase">
                <CornerDownRight className="size-4 text-volt" aria-hidden="true" />
                Drag or scroll
              </span>
            </div>

            {projects.map((project, index) => (
              <ProjectEntry
                key={project.id}
                project={project}
                variant="wide"
                onOpen={handleOpen}
                priority={index === 0}
              />
            ))}

            {/* Closing panel — hands the visitor to the contact section */}
            <div className="hidden w-[30vw] shrink-0 flex-col justify-center gap-6 pt-32 lg:flex">
              <span className="font-mono text-[0.625rem] tracking-[0.24em] text-volt uppercase">
                End of sequence
              </span>
              <p className="font-display text-[2.4rem] leading-[1.05] tracking-[-0.035em] text-chrome">
                Want the full walkthrough?
              </p>
              <a
                href="#contact"
                onClick={(event) => anchor(event, "#contact")}
                className="group inline-flex w-fit items-center gap-3 border border-volt/50 bg-volt/5 px-5 py-3 font-mono text-[0.6875rem] tracking-[0.18em] text-volt uppercase transition-colors hover:bg-volt hover:text-obsidian"
              >
                Start a conversation
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* Sequence progress — visible only where the pin exists */}
          <div className="shell pointer-events-none absolute inset-x-0 bottom-6 hidden items-center gap-6 lg:flex">
            <span className="font-mono text-[0.6875rem] tracking-[0.2em] text-chrome">
              <span ref={counter}>01</span>
              <span className="text-ash-dim">/{padIndex(projects.length - 1)}</span>
            </span>
            <div className="h-px flex-1 bg-line">
              <div ref={bar} className="h-px origin-left scale-x-0 bg-volt" />
            </div>
            <span className="font-mono text-[0.625rem] tracking-[0.2em] text-ash-dim uppercase">
              Horizontal · 01 → {padIndex(projects.length - 1)}
            </span>
          </div>
        </div>
      </div>

      <ProjectModal project={openProject} onClose={handleClose} />
    </section>
  );
}
