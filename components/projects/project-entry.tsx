"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Maximize2 } from "lucide-react";

import type { Project } from "@/lib/types";
import { cn, padIndex } from "@/lib/utils";
import { PlaceholderLink } from "@/components/ui/placeholder-link";
import { ProjectMediaFrame } from "@/components/projects/project-media";

/**
 * One project in the showcase.
 *
 * `variant="wide"` is the desktop horizontal panel (alternating vertical
 * offset, oversized numbering, 70vw media); `variant="stack"` is the mobile /
 * tablet card. Same data, one component, two compositions — which is why the
 * horizontal sequence stays consistent with the vertical one.
 */
export function ProjectEntry({
  project,
  variant = "stack",
  onOpen,
  priority = false,
}: {
  project: Project;
  variant?: "wide" | "stack";
  onOpen: (project: Project) => void;
  priority?: boolean;
}) {
  const wide = variant === "wide";
  const offset = wide && project.index % 2 === 0;

  return (
    <motion.article
      data-panel
      className={cn(
        "group relative flex flex-col",
        wide
          ? "w-[74vw] shrink-0 xl:w-[68vw]"
          : "w-full border-b border-line pb-12 last:border-b-0",
        wide && (offset ? "lg:mt-24" : "lg:-mt-8"),
      )}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <button
        type="button"
        onClick={() => onOpen(project)}
        className="flex w-full flex-col text-left"
        aria-label={`Open the ${project.title} case study`}
        data-cursor-label="Case study"
      >
        <div className="flex items-end justify-between gap-6 pb-4">
          <div className="flex items-baseline gap-4">
            <span
              className={cn(
                "font-display leading-none tracking-[-0.04em] text-ash-dim/40 transition-colors duration-700 group-hover:text-volt",
                wide ? "text-[clamp(3rem,6vw,5.5rem)]" : "text-[2.5rem]",
              )}
            >
              {padIndex(project.index)}
            </span>
            <span className="flex flex-col gap-1">
              <span className="font-mono text-[0.625rem] tracking-[0.22em] text-volt uppercase">
                {project.category}
              </span>
              <span className="font-mono text-[0.625rem] tracking-[0.18em] text-ash-dim uppercase">
                {project.role}
              </span>
            </span>
          </div>

          <span className="hidden items-center gap-2 border border-line-strong px-3 py-2 font-mono text-[0.625rem] tracking-[0.18em] text-ash uppercase transition-colors duration-500 group-hover:border-volt/60 group-hover:text-volt sm:flex">
            <Maximize2 className="size-3.5" aria-hidden="true" />
            Case study
          </span>
        </div>

        <ProjectMediaFrame
          media={project.media}
          priority={priority}
          className={cn(
            "w-full",
            wide ? "aspect-[16/9]" : "aspect-[16/10]",
          )}
        />

        <div className="flex flex-col gap-5 pt-6">
          <h3
            className={cn(
              "font-display leading-[1.02] tracking-[-0.035em] text-chrome transition-colors duration-500 group-hover:text-volt",
              wide ? "text-display-md" : "text-[1.9rem] sm:text-[2.4rem]",
            )}
          >
            {project.title}
          </h3>
          <p className="max-w-2xl text-[0.9375rem] leading-relaxed text-ash">
            {project.description}
          </p>
        </div>
      </button>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-6">
        <ul className="flex flex-wrap gap-2">
          {project.tech.slice(0, wide ? 6 : 5).map((tech) => (
            <li
              key={tech}
              className="border border-line px-2.5 py-1 font-mono text-[0.5625rem] tracking-[0.16em] text-ash-dim uppercase transition-colors duration-500 group-hover:border-line-strong group-hover:text-ash"
            >
              {tech}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {project.github.url ? (
            <a
              href={project.github.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group/gh inline-flex items-center gap-1.5 border border-line-strong px-3 py-1.5 font-mono text-[0.625rem] tracking-[0.16em] text-chrome uppercase transition-colors hover:border-volt/60 hover:text-volt"
            >
              GitHub
              <ArrowUpRight className="size-3.5 transition-transform group-hover/gh:-translate-y-0.5 group-hover/gh:translate-x-0.5" />
            </a>
          ) : (
            <PlaceholderLink url={null} label="GitHub" tone="compact" />
          )}
          {project.live.url ? (
            <a
              href={project.live.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group/live inline-flex items-center gap-1.5 border border-volt/50 bg-volt/5 px-3 py-1.5 font-mono text-[0.625rem] tracking-[0.16em] text-volt uppercase transition-colors hover:bg-volt hover:text-obsidian"
            >
              Live
              <ArrowUpRight className="size-3.5 transition-transform group-hover/live:-translate-y-0.5 group-hover/live:translate-x-0.5" />
            </a>
          ) : (
            <PlaceholderLink url={null} label="Live demo" tone="compact" />
          )}
        </div>
      </div>
    </motion.article>
  );
}
