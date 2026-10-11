/**
 * Self-hosted variable fonts.
 *
 * Imported from `@fontsource-variable/*` instead of `next/font/google` so the
 * site builds and renders with zero network access to Google — no build-time
 * fetch, no glyph requests to a third party, no layout shift (each face is
 * `font-display: swap` with an explicit local fallback chain in globals.css).
 *
 * Only the weight axis is imported; the browser downloads a subset at most
 * because each `@font-face` declares a `unicode-range`.
 */
import "@fontsource-variable/space-grotesk/wght.css";
import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/jetbrains-mono/wght.css";
