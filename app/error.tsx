"use client";

import { useEffect } from "react";

/**
 * Route error boundary.
 *
 * Keeps the dark shell intact and offers the two useful actions: retry, or read
 * the project list while the error is investigated.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Replace with your monitoring sink (Sentry, Axiom…) if you add one.
    console.error("[obsidian] Unhandled error:", error);
  }, [error]);

  return (
    <section className="shell flex min-h-[80svh] flex-col justify-center py-32">
      <span className="eyebrow text-volt">Runtime error</span>
      <h1 className="mt-6 max-w-3xl font-display text-[clamp(2.25rem,6vw,5rem)] leading-[0.95] tracking-[-0.045em] text-chrome">
        Something broke — but only this view.
      </h1>
      <p className="text-body-lg mt-6 max-w-xl">
        An error occurred while rendering this section. Retrying usually resolves it; if it does
        not, the rest of the site still works.
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-12 items-center gap-3 bg-volt px-6 text-sm font-medium text-obsidian transition-colors hover:bg-volt-soft"
        >
          Try again
        </button>
        <a
          href="/"
          className="inline-flex h-12 items-center gap-3 border border-line-strong px-6 text-sm font-medium text-chrome transition-colors hover:border-volt/60 hover:text-volt"
        >
          Back to the home page
        </a>
      </div>

      {error.digest ? (
        <p className="mt-8 font-mono text-[0.625rem] tracking-[0.18em] text-ash-dim uppercase">
          Digest · {error.digest}
        </p>
      ) : null}
    </section>
  );
}
