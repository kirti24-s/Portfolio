"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";

import { siteConfig } from "@/data/site-config";
import { cn } from "@/lib/utils";
import { useAnchorScroll, useScrollEngine } from "@/components/providers/scroll-provider";
import { useActiveSection, useIsMounted } from "@/hooks/use-active-section";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ButtonAnchor } from "@/components/ui/button";
import { SocialIcons } from "@/components/ui/social-links";

const NAV_IDS = ["home", ...siteConfig.nav.map((item) => item.id)];

/**
 * Primary navigation.
 *
 * · Hides on downward scroll, returns on upward — driven by motion values, so
 *   scrolling never triggers a React render.
 * · Lives *outside* Locomotive's transformed container (see the provider) so
 *   `position: fixed` behaves predictably.
 * · Mobile overlay menu traps nothing but does lock scrolling, close on Escape
 *   and on selection, and restores focus.
 */
export function Nav() {
  const { subscribe, pause, unlock } = useScrollEngine();
  const anchor = useAnchorScroll();
  const [open, setOpen] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const active = useActiveSection(NAV_IDS);
  const y = useMotionValue(0);
  const mounted = useIsMounted();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const hidden = useRef(false);
  const openRef = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);

  openRef.current = open;

  useEffect(
    () =>
      subscribe((state) => {
        if (openRef.current) return;

        const shouldCondense = state.y > 40;
        setCondensed((current) => (current === shouldCondense ? current : shouldCondense));

        const shouldHide = state.direction === "down" && state.y > 240;
        if (shouldHide !== hidden.current) {
          hidden.current = shouldHide;
          y.set(shouldHide ? -110 : 0);
        }
      }),
    [subscribe, y],
  );

  useEffect(() => {
    if (!open) {
      unlock();
      return;
    }
    pause();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    const focusTimer = window.setTimeout(() => panelRef.current?.focus(), 140);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(focusTimer);
    };
  }, [open, pause, unlock]);

  useEffect(() => {
    if (isDesktop) setOpen(false);
  }, [isDesktop]);

  return (
    <>
      <motion.header
        style={{ y }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,padding] duration-500",
          condensed ? "glass border-b border-line py-3" : "border-b border-transparent py-5 sm:py-7",
        )}
      >
        <nav aria-label="Primary" className="shell flex items-center justify-between gap-6">
          <a
            href="#home"
            onClick={(event) => anchor(event, "#home")}
            className="group flex items-center gap-3"
            data-cursor-label="Top"
          >
            <span className="relative grid size-9 place-items-center border border-line-strong transition-colors duration-500 group-hover:border-volt/70">
              <span className="font-display text-sm text-chrome transition-colors group-hover:text-volt">
                {siteConfig.name.initials}
              </span>
              <span className="absolute -right-px -top-px size-1.5 bg-volt opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </span>
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="font-display text-sm tracking-tight text-chrome">
                {siteConfig.name.full}
              </span>
              <span className="font-mono text-[0.5625rem] tracking-[0.22em] text-ash-dim uppercase">
                Full-stack · AI
              </span>
            </span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {siteConfig.nav.map((item, index) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(event) => anchor(event, `#${item.id}`)}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "group relative flex items-baseline gap-2 px-3 py-2 font-mono text-[0.6875rem] tracking-[0.16em] uppercase transition-colors duration-300",
                      isActive ? "text-volt" : "text-ash hover:text-chrome",
                    )}
                  >
                    <span className="text-[0.5625rem] text-ash-dim">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-x-3 bottom-0.5 h-px origin-left bg-volt transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                      )}
                    />
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3">
            <SocialIcons size="sm" includeResume={false} className="hidden lg:flex" />
            <ButtonAnchor
              href="#contact"
              size="sm"
              className="hidden sm:inline-flex"
              onClick={(event) => anchor(event, "#contact")}
              icon={<ArrowUpRight className="size-3.5" />}
            >
              Let&apos;s Connect
            </ButtonAnchor>

            <button
              type="button"
              onClick={() => setOpen((current) => !current)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid size-10 place-items-center border border-line-strong text-chrome transition-colors hover:border-volt/70 hover:text-volt lg:hidden"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-[58] flex flex-col justify-between bg-obsidian/97 px-6 pb-10 pt-28 backdrop-blur-xl outline-none lg:hidden"
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav aria-label="Mobile">
              <ul className="flex flex-col">
                {siteConfig.nav.map((item, index) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.08 + index * 0.06,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="border-b border-line"
                  >
                    <a
                      href={`#${item.id}`}
                      onClick={(event) => {
                        setOpen(false);
                        anchor(event, `#${item.id}`);
                      }}
                      className="flex items-baseline justify-between py-4"
                    >
                      <span className="font-display text-[2rem] leading-none tracking-[-0.03em] text-chrome">
                        {item.label}
                      </span>
                      <span className="font-mono text-[0.625rem] tracking-[0.2em] text-ash-dim">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <motion.div
              className="flex flex-col gap-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.36, duration: 0.6 }}
            >
              <a
                href={`mailto:${siteConfig.email}`}
                className="font-mono text-xs tracking-[0.14em] text-volt lowercase"
              >
                {mounted ? siteConfig.email : "email"}
              </a>
              <SocialIcons size="md" />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
