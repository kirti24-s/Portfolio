"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import type { ProjectMedia } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Project media frame.
 *
 * Placeholder artwork is an SVG, which the Next image optimizer must not try to
 * rasterise — those are served `unoptimized`. Drop a `.jpg`/`.png`/`.webp` at
 * the same path and it is optimised automatically, with the intrinsic size from
 * `data/projects.ts` preventing any layout shift.
 */
export function ProjectMediaFrame({
  media,
  className,
  priority = false,
  interactive = true,
}: {
  media: ProjectMedia;
  className?: string;
  priority?: boolean;
  interactive?: boolean;
}) {
  const isSvg = media.src.endsWith(".svg");

  return (
    <figure className={cn("group/media relative overflow-hidden bg-carbon", className)}>
      <div className="absolute inset-0 z-10 bg-[radial-gradient(80%_60%_at_50%_20%,transparent_30%,rgba(4,6,10,0.55)_100%)]" />

      <motion.div
        className="relative h-full w-full"
        initial={false}
        whileHover={interactive ? { scale: 1.035 } : undefined}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <Image
          src={media.src}
          alt={media.alt}
          width={media.width}
          height={media.height}
          priority={priority}
          unoptimized={isSvg}
          sizes="(max-width: 1023px) 92vw, 70vw"
          className="h-full w-full object-cover"
        />
      </motion.div>

      {/* hover scanline — pure CSS, no JS */}
      {interactive ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-700 group-hover/media:opacity-100"
        >
          <div className="animate-scanline absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-transparent via-volt/15 to-transparent" />
        </div>
      ) : null}

      {/* corner ticks */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20">
        {[
          "left-3 top-3 border-l border-t",
          "right-3 top-3 border-r border-t",
          "left-3 bottom-3 border-l border-b",
          "right-3 bottom-3 border-r border-b",
        ].map((position) => (
          <span
            key={position}
            className={cn("absolute size-3.5 border-volt/50", position)}
          />
        ))}
      </div>

      {media.caption ? (
        <figcaption className="absolute bottom-0 left-0 z-30 max-w-full truncate bg-obsidian/80 px-3 py-1.5 font-mono text-[0.5625rem] tracking-[0.16em] text-ash-dim uppercase backdrop-blur-sm">
          {media.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
