"use client";

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import type { Project } from "@/lib/types";
import { useIsMounted } from "@/hooks/use-active-section";
import { useScrollEngine } from "@/components/providers/scroll-provider";
import { ProjectDetail } from "@/components/projects/project-detail";

/**
 * Case-study modal.
 *
 * Rendered through a portal into `<body>` — the content sits inside Locomotive
 * Scroll's transformed container, where `position: fixed` would otherwise be
 * relative to that transform. Handle-free scrolling of the dialog, Escape to
 * close, focus trapped and restored, and the page scroll locked underneath.
 */
export function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const mounted = useIsMounted();
  const { pause, unlock } = useScrollEngine();
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const close = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    if (!project) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    pause();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        return;
      }

      // Focus trap: keep tabbing inside the dialog.
      if (event.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    const focusTimer = window.setTimeout(() => panelRef.current?.focus(), 120);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(focusTimer);
      unlock();
      previouslyFocused.current?.focus?.();
    };
  }, [close, pause, project, unlock]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {project ? (
        <motion.div
          className="fixed inset-0 z-[90] flex items-start justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div
            className="absolute inset-0 bg-obsidian/80 backdrop-blur-md"
            onClick={close}
            aria-hidden="true"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-study-heading"
            tabIndex={-1}
            className="relative z-10 h-[100svh] w-full max-w-6xl overflow-y-auto overscroll-contain border-x border-line bg-ink/95 outline-none"
            initial={{ y: 40, opacity: 0, scale: 0.99 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.995 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-line bg-ink/90 px-5 py-4 backdrop-blur-md sm:px-8">
              <span
                id="case-study-title"
                className="truncate font-mono text-[0.625rem] tracking-[0.22em] text-ash uppercase"
              >
                Case study · {project.title}
              </span>
              <button
                type="button"
                onClick={close}
                aria-label="Close case study"
                className="grid size-9 shrink-0 place-items-center border border-line-strong text-chrome transition-colors hover:border-volt/60 hover:text-volt"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="px-5 pt-10 sm:px-8 sm:pt-14">
              <ProjectDetail project={project} onClose={close} headingLevel="h2" />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
