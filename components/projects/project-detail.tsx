"use client";

import { ArrowLeft, ArrowUpRight, CircleDot } from "lucide-react";

import type { Project } from "@/lib/types";
import { padIndex } from "@/lib/utils";
import { PlaceholderLink } from "@/components/ui/placeholder-link";
import { ProjectMediaFrame } from "@/components/projects/project-media";

/**
 * The case-study body. Shared by the in-page modal and the deep-linkable
 * `/work/[id]` route so there is exactly one source of truth for the write-up.
 */
export function ProjectDetail({
  project,
  onClose,
  headingLevel = "h2",
}: {
  project: Project;
  /** Rendered as a close/back control when provided (modal usage). */
  onClose?: () => void;
  headingLevel?: "h1" | "h2";
}) {
  const Heading = headingLevel;

  return (
    <article className="flex flex-col gap-10 pb-16">
      <header className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-6">
          <span className="flex items-center gap-3 font-mono text-[0.625rem] tracking-[0.24em] text-volt uppercase">
            {padIndex(project.index)}
            <span className="h-px w-10 bg-volt/40" aria-hidden="true" />
            {project.category}
          </span>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="group flex items-center gap-2 border border-line-strong px-3 py-2 font-mono text-[0.625rem] tracking-[0.18em] text-ash uppercase transition-colors hover:border-volt/60 hover:text-volt"
            >
              <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
              Back to work
            </button>
          ) : null}
        </div>

        <Heading id="case-study-heading" className="text-display-lg max-w-4xl text-chrome">
          {project.title}
        </Heading>
        <p className="text-body-lg max-w-2xl">{project.description}</p>

        <div className="flex flex-wrap items-center gap-3">
          <PlaceholderLink
            url={project.github.url}
            label={`${project.github.label} · add link`}
            handle={project.github.label}
          />
          <PlaceholderLink
            url={project.live.url}
            label={`${project.live.label} · add link`}
            handle={project.live.label}
          />
          <span className="font-mono text-[0.625rem] tracking-[0.18em] text-ash-dim uppercase">
            {project.role}
          </span>
        </div>

        <ul className="flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <li
              key={tech}
              className="border border-line px-2.5 py-1 font-mono text-[0.625rem] tracking-[0.14em] text-ash uppercase"
            >
              {tech}
            </li>
          ))}
        </ul>
      </header>

      <ProjectMediaFrame
        media={project.media}
        className="aspect-[16/10] w-full"
        interactive={false}
      />

      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="flex flex-col gap-4">
          <h3 className="eyebrow text-volt">Context</h3>
          <p className="text-body-lg">{project.caseStudy.context}</p>
        </section>

        <section className="flex flex-col gap-5">
          <h3 className="eyebrow text-volt">Approach</h3>
          <ul className="flex flex-col gap-4">
            {project.caseStudy.approach.map((paragraph, index) => (
              <li key={paragraph} className="flex gap-4">
                <span className="mt-2 font-mono text-[0.625rem] text-ash-dim">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-body-lg">{paragraph}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="flex flex-col gap-5">
        <h3 className="eyebrow text-volt">What it actually does</h3>
        <ul className="grid gap-x-10 gap-y-3 sm:grid-cols-2">
          {project.caseStudy.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-ash">
              <CircleDot className="mt-1.5 size-3.5 shrink-0 text-volt" aria-hidden="true" />
              <span className="text-[0.9375rem] leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
      </section>

      {project.caseStudy.notes ? (
        <section className="panel flex flex-col gap-3 p-6">
          <h3 className="eyebrow text-volt">Honest notes & next steps</h3>
          <p className="text-body-lg">{project.caseStudy.notes}</p>
        </section>
      ) : null}

      <footer className="flex flex-wrap items-center justify-between gap-6 border-t border-line pt-6">
        <span className="font-mono text-[0.625rem] tracking-[0.18em] text-ash-dim uppercase">
          {project.period ?? "Ongoing"} · {project.tech.length} technologies
        </span>
        {project.github.url || project.live.url ? (
          <a
            href={(project.live.url ?? project.github.url) as string}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 font-mono text-[0.6875rem] tracking-[0.18em] text-volt uppercase"
          >
            Open project
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        ) : (
          <span className="font-mono text-[0.625rem] tracking-[0.18em] text-ash-dim uppercase">
            Add repository / demo URLs in data/projects.ts
          </span>
        )}
      </footer>
    </article>
  );
}
