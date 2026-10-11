"use client";

import { ArrowUpRight, Link2Off } from "lucide-react";

import { cn, isPlaceholderUrl, prettyUrl } from "@/lib/utils";

/**
 * Honest link rendering.
 *
 * If a URL is missing or still a placeholder (`your-handle`, `example.com`…)
 * this renders a clearly-marked, non-interactive chip instead of a broken
 * anchor. Nothing on the site ever links to a fabricated or dead destination.
 */
export function PlaceholderLink({
  url,
  label,
  handle,
  className,
  showUrl = false,
  tone = "default",
}: {
  url: string | null;
  label: string;
  handle?: string;
  className?: string;
  showUrl?: boolean;
  tone?: "default" | "compact";
}) {
  const isPlaceholder = isPlaceholderUrl(url);

  if (isPlaceholder || !url) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-2 border border-line px-3 py-1.5 font-mono text-[0.6875rem] tracking-[0.14em] text-ash-dim uppercase",
          className,
        )}
        title={`${label} — add your real URL in data/site-config.ts or data/projects.ts`}
      >
        <Link2Off className="size-3.5 shrink-0" aria-hidden="true" />
        {label} · add link
      </span>
    );
  }

  return (
    <a
      href={url}
      target={url.startsWith("mailto:") ? undefined : "_blank"}
      rel={url.startsWith("mailto:") ? undefined : "noopener noreferrer"}
      className={cn(
        "group inline-flex items-center gap-2 border border-line-strong px-3 py-1.5 font-mono text-[0.6875rem] tracking-[0.14em] text-chrome uppercase transition-colors duration-300 hover:border-volt/60 hover:text-volt",
        tone === "compact" && "px-2.5 py-1",
        className,
      )}
    >
      <span className="truncate">{showUrl ? prettyUrl(url) : (handle ?? label)}</span>
      <ArrowUpRight
        className="size-3.5 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </a>
  );
}
