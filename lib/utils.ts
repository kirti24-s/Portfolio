import type { ClassValue } from "@/lib/types";

/**
 * Tiny className joiner — no runtime dependency needed.
 */
export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === "string") out.push(input);
    else if (Array.isArray(input)) out.push(cn(...input));
    else if (typeof input === "object") {
      for (const [key, value] of Object.entries(input)) if (value) out.push(key);
    }
  }
  return out.join(" ");
}

export function clamp(value: number, min = 0, max = 1): number {
  return Math.min(Math.max(value, min), max);
}

export function lerp(from: number, to: number, amount: number): number {
  return from + (to - from) * amount;
}

/** Frames-per-second independent lerp (used inside rAF / useFrame loops). */
export function damp(from: number, to: number, smoothing: number, dt: number): number {
  return lerp(from, to, 1 - Math.pow(smoothing, dt * 60));
}

/**
 * Detects the "your-username" style placeholders shipped in `data/site-config.ts`
 * so unfinished links are visibly marked in the UI instead of silently 404ing.
 */
export function isPlaceholderUrl(url: string | null | undefined): boolean {
  if (!url) return true;
  return /your-|yourdomain|example\.(com|org)|placeholder|changeme/i.test(url);
}

/** Strips protocol + trailing slash for display purposes. */
export function prettyUrl(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function padIndex(index: number, length = 2): string {
  return String(index + 1).padStart(length, "0");
}

export function prefixedPath(path: string, basePath = ""): string {
  if (!basePath) return path;
  return `${basePath.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}
