"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

type Extra = {
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
};

/**
 * Framer Motion redefines `onDrag*` (and the animation callbacks) with its own
 * signatures, so the DOM versions are omitted before spreading plain element
 * props onto a motion component.
 */
type DomProps<T extends keyof React.JSX.IntrinsicElements> = Omit<
  React.ComponentPropsWithoutRef<T>,
  "onDrag" | "onDragStart" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDrop" | "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration"
>;

const BASE =
  "group relative inline-flex items-center justify-center gap-2.5 overflow-hidden font-medium tracking-tight whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-50";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-volt text-obsidian hover:bg-volt-soft",
  outline: "border border-line-strong text-chrome hover:text-obsidian",
  ghost: "text-ash hover:text-chrome",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 rounded-full px-4 text-[0.8125rem]",
  md: "h-11 rounded-full px-6 text-sm",
  lg: "h-14 rounded-full px-8 text-[0.9375rem]",
};

/**
 * Shared hover/tap physics. Typed loosely on purpose: Framer Motion's
 * `HTMLMotionProps` carries a `ref` typed to one element, which conflicts when
 * the same object is spread across `<button>`, `<a>` and `<Link>`.
 */
const MOTION = {
  whileHover: { y: -2 },
  whileTap: { y: 0, scale: 0.985 },
  transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
};

/** Liquid fill that sweeps up from the bottom on hover (outline variant). */
function Sweep({ tone }: { tone: Variant }) {
  if (tone !== "outline") return null;
  return (
    <span
      aria-hidden="true"
      className="absolute inset-0 z-0 translate-y-full bg-volt transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0"
    />
  );
}

function Inner({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <span className="relative z-10 flex items-center gap-2.5">
      {children}
      {icon}
    </span>
  );
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  icon,
  ...props
}: DomProps<"button"> & Extra) {
  return (
    <motion.button
      {...MOTION}
      {...props}
      className={cn(BASE, VARIANTS[variant], SIZES[size], className)}
    >
      <Sweep tone={variant} />
      <Inner icon={icon}>{children}</Inner>
    </motion.button>
  );
}

/** Anchor styled as a button — used for in-page anchors and external links. */
export function ButtonAnchor({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  icon,
  external,
  ...props
}: DomProps<"a"> & Extra & { href: string; external?: boolean }) {
  return (
    <motion.a
      {...MOTION}
      {...props}
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(BASE, VARIANTS[variant], SIZES[size], className)}
    >
      <Sweep tone={variant} />
      <Inner icon={icon}>{children}</Inner>
    </motion.a>
  );
}

/** Internal navigation (App Router) with the same visual treatment. */
export function ButtonLink({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  icon,
  ...props
}: Omit<DomProps<"a">, "href"> & Extra & { href: string }) {
  return (
    <Link
      href={href}
      {...props}
      className={cn(BASE, VARIANTS[variant], SIZES[size], className)}
    >
      <Sweep tone={variant} />
      <Inner icon={icon}>{children}</Inner>
    </Link>
  );
}

/** Text link with an animated underline — nav, footers, case studies. */
export function TextLink({
  href,
  children,
  className,
  external = true,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "group/link relative inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.16em] text-ash uppercase transition-colors hover:text-volt",
        className,
      )}
    >
      {children}
      <span
        aria-hidden="true"
        className="absolute -bottom-1 left-0 h-px w-0 bg-volt transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/link:w-full"
      />
    </a>
  );
}
