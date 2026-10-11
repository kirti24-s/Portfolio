"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { useAnchorScroll } from "@/components/providers/scroll-provider";

/** Previous / next case-study links shown at the end of a project page. */
export function ProjectNav({
  previous,
  next,
}: {
  previous: { id: string; title: string };
  next: { id: string; title: string };
}) {
  const anchor = useAnchorScroll();

  return (
    <nav
      aria-label="Other projects"
      className="mt-8 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2"
    >
      <Link
        href={`/work/${previous.id}`}
        className="group flex flex-col gap-2 bg-obsidian p-6 transition-colors hover:bg-carbon"
      >
        <span className="flex items-center gap-2 font-mono text-[0.5625rem] tracking-[0.2em] text-ash-dim uppercase">
          <ArrowLeft className="size-3 transition-transform group-hover:-translate-x-1" />
          Previous
        </span>
        <span className="font-display text-xl text-chrome transition-colors group-hover:text-volt">
          {previous.title}
        </span>
      </Link>

      <Link
        href={`/work/${next.id}`}
        className="group flex flex-col items-end gap-2 bg-obsidian p-6 text-right transition-colors hover:bg-carbon"
      >
        <span className="flex items-center gap-2 font-mono text-[0.5625rem] tracking-[0.2em] text-ash-dim uppercase">
          Next
          <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
        </span>
        <span className="font-display text-xl text-chrome transition-colors group-hover:text-volt">
          {next.title}
        </span>
      </Link>

      <div className="sm:col-span-2">
        <Link
          href="/#work"
          onClick={(event) => anchor(event, "#work")}
          className="flex items-center justify-center gap-2 bg-obsidian p-4 font-mono text-[0.625rem] tracking-[0.2em] text-ash uppercase transition-colors hover:bg-carbon hover:text-volt"
        >
          Back to the full sequence
        </Link>
      </div>
    </nav>
  );
}
