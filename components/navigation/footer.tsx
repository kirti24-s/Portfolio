"use client";

import { ArrowUp } from "lucide-react";

import { siteConfig } from "@/data/site-config";
import { useAnchorScroll } from "@/components/providers/scroll-provider";
import { SocialIcons } from "@/components/ui/social-links";

const STACK = [
  "Next.js",
  "TypeScript",
  "React Three Fiber",
  "Framer Motion",
  "GSAP ScrollTrigger",
  "Locomotive Scroll",
  "Tailwind CSS",
];

/** Footer: identity, stack credits, back-to-top and the socials. */
export function Footer() {
  const anchor = useAnchorScroll();
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-line">
      <div className="shell flex flex-col gap-10 py-12">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="flex flex-col gap-3">
            <span className="font-display text-3xl leading-none tracking-[-0.03em] text-chrome">
              {siteConfig.name.full}
              <span className="text-volt">.</span>
            </span>
            <span className="font-mono text-[0.625rem] tracking-[0.2em] text-ash-dim uppercase">
              {siteConfig.role}
            </span>
          </div>

          <SocialIcons />
        </div>

        <div className="rule" />

        <div className="flex flex-wrap items-center justify-between gap-6">
          <p className="font-mono text-[0.5625rem] tracking-[0.16em] text-ash-dim uppercase">
            © {year} {siteConfig.name.full} · Built from scratch with {STACK.slice(0, 3).join(", ")}
            {" · "}
            {STACK.slice(3).join(", ")}
          </p>

          <button
            type="button"
            onClick={(event) => anchor(event, "#top")}
            className="group inline-flex items-center gap-2 font-mono text-[0.625rem] tracking-[0.18em] text-ash uppercase transition-colors hover:text-volt"
          >
            Back to top
            <span className="grid size-7 place-items-center border border-line-strong transition-colors group-hover:border-volt/60">
              <ArrowUp className="size-3.5 transition-transform group-hover:-translate-y-0.5" />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
