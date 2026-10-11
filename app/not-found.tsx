import Link from "next/link";

import { siteConfig } from "@/data/site-config";

export const metadata = {
  title: "404 — Nothing here",
};

/** 404 within the obsidian shell: nav and scroller stay alive around it. */
export default function NotFound() {
  return (
    <section className="shell flex min-h-[80svh] flex-col justify-center py-32">
      <span className="eyebrow text-volt">Error 404</span>
      <h1 className="mt-6 max-w-3xl font-display text-[clamp(2.5rem,7vw,6rem)] leading-[0.95] tracking-[-0.045em] text-chrome">
        This page drifted out of orbit.
      </h1>
      <p className="text-body-lg mt-6 max-w-xl">
        The URL you followed does not exist. The work, the timeline and the contact details are all
        one click away.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/"
          className="inline-flex h-12 items-center gap-3 bg-volt px-6 text-sm font-medium text-obsidian transition-colors hover:bg-volt-soft"
        >
          Back to {siteConfig.name.full}&apos;s portfolio
        </Link>
        <Link
          href="/#work"
          className="inline-flex h-12 items-center gap-3 border border-line-strong px-6 text-sm font-medium text-chrome transition-colors hover:border-volt/60 hover:text-volt"
        >
          See selected work
        </Link>
      </div>
    </section>
  );
}
