# Obsidian 3D Portfolio — Engineering the extraordinary.

An immersive, production-oriented developer portfolio: a metallic 3D core, orbital rings,
scroll-driven storytelling, editorial typography and a real project showcase — built on the
App Router with React Three Fiber, Framer Motion, GSAP ScrollTrigger and Locomotive Scroll.

The visual identity is deliberately narrow: **deep obsidian black**, **electric-lime accents**,
**chrome metal**, generous negative space and oversized type. Everything else is built to serve it.

```bash
npm install
npm run dev      # → http://localhost:3000
```

```bash
npm run build    # production build (type-checked, all case studies pre-rendered)
npm run start    # serve the production build
npm run typecheck
```

Node 18.18+ (developed on Node 22). No global tooling required.

---

## 1. What is in here

| Section | What it does |
| --- | --- |
| **Hero** | Custom chrome core with pointer-reactive tilt, orbital rings, atmospheric particles, animated headline, dual CTAs, scroll cue, live local clock. |
| **Selected work** | Five projects. Desktop: pinned, horizontally scrubbed sequence with oversized numbering and a sequence progress rail. Mobile: the same data as a clean vertical stack. |
| **Case studies** | Modal viewer **and** deep-linkable pages at `/work/[id]` with their own metadata — one write-up, two entry points. |
| **About** | Editorial layout: narrative, focus areas, working principles, portrait placeholder. |
| **Skills** | An interactive constellation computed from data — five groups, no fabricated percentages. |
| **Journey** | Timeline with a scroll-filled lime spine. Education, projects and self-directed learning. |
| **Contact** | Rotating orbital structure, oversized invitation, email/GitHub/LinkedIn/résumé, optional working contact form. |

Also included: Meta/OG image generated at build time, sitemap, robots, JSON-LD, 404 and error
boundaries, a loading state, a skip link and full keyboard navigation.

---

## 2. Stack

| Concern | Choice | Version |
| --- | --- | --- |
| Framework | Next.js (App Router, React 19) | 15.5 |
| Language | TypeScript (strict) | 5.9 |
| Styling | Tailwind CSS v4 (CSS-first `@theme` tokens) | 4.1 |
| UI animation | Framer Motion | 12 |
| Scroll timelines | GSAP + ScrollTrigger | 3.13 |
| Smooth scrolling | Locomotive Scroll | 4.1.4 |
| 3D | three.js + React Three Fiber + drei | 0.186 / 9.8 / 10.7 |
| Icons | Lucide React (+ two inline brand marks) | 1.55 |
| Fonts | Space Grotesk, Inter, JetBrains Mono — self-hosted via `@fontsource-variable` | 5.3 |

`npm list` is the source of truth; the versions above are what the project is developed against.

---

## 3. Structure

```
app/
  layout.tsx              metadata, fonts, JSON-LD, <noscript> reveal, AppShell
  page.tsx                the single-page composition (Server Component)
  globals.css             design tokens (@theme), components, utilities, a11y rules
  api/contact/route.ts    validated, throttled contact endpoint (server-only secrets)
  work/[id]/page.tsx      pre-rendered case-study route + metadata + prev/next
  opengraph-image.tsx     OG card generated with next/og (no committed PNG)
  sitemap.ts · robots.ts · manifest.ts · icon.svg
  not-found.tsx · error.tsx · loading.tsx

components/
  navigation/             nav (+ overlay menu), footer, preloader, scroll progress, custom cursor
  providers/              scroll engine provider, intro coordination, app shell
  sections/               hero, keyword band, work, about, skills, journey, contact
  projects/               media frame, entry, detail, modal, prev/next
  three/                  scene canvas, core object, orbital rings, particle field, fallback
  animations/             reveal primitives, split/char text reveals
  ui/                     buttons, marquee, contact form, social links, placeholder links, overlay

data/
  site-config.ts          every personal detail + nav + socials + SEO keywords
  projects.ts             the five projects: copy, stack, links, case studies
  skills.ts               capability nodes (no percentages, by design)
  journey.ts              timeline entries

hooks/                    gsap scope, media queries, pointer ref, active section
lib/                      scroll engine, gsap setup, fonts, webgl detection, types, utils
types/                    ambient types for locomotive-scroll
public/images/projects/   placeholder artwork (see §6)
```

---

## 4. Make it yours

Everything personal lives in **`data/`** — no component edits required.

1. **`data/site-config.ts`** — name, role, location, email, availability, headline, about copy,
   socials, résumé link, nav labels, SEO keywords.
   Anything still containing `your-…` or `example.com` is treated as a placeholder: the UI renders
   a clearly marked *“add link”* state instead of shipping a dead `<a href>`.
2. **`data/projects.ts`** — the five projects. `github` and `live` are `null` until a real URL
   exists; the markup switches to a working link as soon as you fill them in.
3. **`data/journey.ts`** — timeline entries. `period` and `org` are printed verbatim, so add real
   dates and your institute name here.
4. **`data/skills.ts`** — add a skill and the constellation re-lays itself out; the layout is
   computed, never hand-positioned.
5. **`app/globals.css`** — the whole palette, type scale and easing set lives in one `@theme`
   block. Change `--color-volt` and the entire site re-skins.

---

## 5. How the animation stack is wired (the part that usually breaks)

Three libraries, three clearly separated jobs — they never fight over the same property:

| Library | Owns |
| --- | --- |
| **Locomotive Scroll** | The container's `translate3d` (`transform`) and the "how far down" number. |
| **GSAP + ScrollTrigger** | Everything *inside* the container: pinned sections, scrubbed timelines, reveals. |
| **Framer Motion** | Interface state: entrances, menus, modals, hovers, layout transitions. |

The integration is in `lib/scroll-engine.ts` — one place, fully typed, fully torn down:

* **Smooth on desktop, native on touch.** Locomotive is created with `smooth: true` only for
  precise pointers on ≥1024px screens. Phones get a native-scroll Locomotive instance: no
  hijacking, no pinning, natural momentum, and ScrollTrigger stays on the window scroller.
* **`ScrollTrigger.scrollerProxy`.** While Locomotive owns the transform, `window.scrollY` never
  moves, so ScrollTrigger is told how to read the virtual scroll position, and it is told
  `pinType: "transform"` (the container is transformed, so `position: fixed` pins would be wrong).
* **Demand-driven synchronisation.** A single rAF loop mirrors Locomotive's interpolated offset
  into `ScrollTrigger.update()` while it is changing, then *stops itself* once everything settles.
  No idle loop, no double rAF, no second animation engine fighting the first.
* **Re-measurement in both directions.** `ScrollTrigger.refresh()` → Locomotive `update()`, so pin
  spacers that change the document height are reflected in Locomotive's scroll limit; web fonts
  and images trigger one more refresh after load.
* **Section anchors** go through `engine.scrollTo(...)` so they stay correct in both modes, and
  from a case-study page they route back to the home page section.
* **Reduced motion** never constructs a smooth scroller and never builds a scroll timeline at all
  (`useGsapScope` returns early); `MotionConfig reducedMotion="user"` does the same for Framer.
* **Modal / menu scrolling** pauses Locomotive and restores it on close, with focus trapped,
  Escape to close and focus returned to the trigger.

Sections never hand-roll `ScrollTrigger` — they call `useGsapScope()` (`hooks/use-gsap-scope.ts`),
which waits for the engine, creates a scoped `gsap.context()` that is reverted on unmount, and
passes the correct `scroller` for the active mode.

### 3D

`components/three/` — a displaced icosahedron with a physical chrome material (environment baked
in-scene from `Lightformer` geometry: no external HDR fetch), a wireframe shell, an emissive lime
inner ring, three tilted orbital rings with satellites and a seeded point field. Pointer movement
drives object rotation *and* camera drift on separate axes so the two motions never cancel out.
Scroll progress is piped into the camera through a ref, so scrolling the hero never re-renders React.

Quality tiers: `high` (desktop) / `medium` (tablet) / `low` (mobile) reduce geometry detail, ring
count, particle count and device pixel ratio. The canvas runs `frameloop: "never"` whenever it is
scrolled out of view.

---

## 6. Assets you should replace

* **Project media.** `public/images/projects/*.svg` are abstract, clearly labelled placeholder
  artworks. Drop a real screenshot at the same path in `data/projects.ts` (`/images/projects/<id>.png`)
  and update `width`/`height`; non-SVG formats are optimised by `next/image` automatically
  (SVGs are served `unoptimized` so the optimizer never rasterises them).
* **Portrait.** `public/images/portrait.jpg`, then swap the placeholder block in
  `components/sections/about.tsx`.
* **Résumé.** Set `resumeUrl` in `data/site-config.ts` to a hosted PDF.
* **OG image.** Generated from `app/opengraph-image.tsx` — edit the copy there.

No screenshots, metrics, dates or links were invented anywhere in this codebase. Where a fact is
unknown the UI says so.

---

## 7. Contact form (optional)

The form posts to `/api/contact`, which validates server-side, throttles by IP (3 per 10 minutes),
and ignores honeypot submissions. It works in two modes and is honest about the third:

```bash
cp .env.example .env.local
```

* **Resend** — set `RESEND_API_KEY`, `CONTACT_TO_EMAIL` (and optionally `CONTACT_FROM_EMAIL`).
* **Webhook** — set `CONTACT_WEBHOOK_URL` to any endpoint accepting a JSON `POST`.
* **Nothing configured** — the route returns an explicit “not connected” state and the UI surfaces
  the `mailto:` fallback. The form never pretends to have sent a message it did not send.

Server variables are read only in the route handler; nothing secret reaches the browser bundle.
Set `NEXT_PUBLIC_SITE_URL` to your production domain so canonical URLs, the sitemap and Open Graph
tags resolve absolutely.

---

## 8. Accessibility & performance

* Semantic landmarks, one `h1`, `aria-labelledby` on every section, visible focus rings, a skip
  link, keyboard-operable menu/modal, `aria-live` form status, labels on every field.
* `prefers-reduced-motion` disables smooth scrolling, pins, scrubbed timelines and the custom
  cursor, and shortens Framer Motion transforms (`MotionConfig reducedMotion="user"`).
* The custom cursor is desktop/precise-pointer only and never required to navigate.
* Content is server-rendered: the page works with JavaScript disabled (a `<noscript>` rule reveals
  anything JavaScript would have animated in).
* three.js/drei are code-split and requested only after WebGL is confirmed, and there is a full
  CSS/SVG fallback scene for reduced motion, unsupported devices and lost WebGL contexts.
* No horizontal overflow on any breakpoint (`overflow-x: clip` plus a translate-only horizontal
  track), no layout shift from project media (intrinsic sizes), and marquees/rAF loops stop when
  off-screen.
* `powerPreference: "high-performance"`, per-tier DPR ceilings, and a single draw call for the
  particle field.

Measured on the production build: the home route ships ~292 kB of route JS with the 3D bundle
deferred, TTFB is static, and all case-study routes are pre-rendered.

---

## 9. Deploying

Push to a Git host and import the repository into Vercel (or any Node host):

* Build command `npm run build`, output handled by Next.js.
* Add the environment variables from §7 in the host's dashboard.
* Set `NEXT_PUBLIC_SITE_URL` to the deployed domain, then update `data/site-config.ts#url` if you
  prefer hard-coding it.

The OG image, sitemap, robots file and manifest all derive from that URL.

---

## 10. Honest limitations

* Project links are intentionally empty until you supply the real repository/demo URLs.
* LinkedIn, email and résumé are placeholders and are flagged as such in the UI.
* The timeline uses “Ongoing” / “Self-directed” rather than invented dates.
* The Crafton storefront case study describes a front-end-focused build; payments and live
  inventory are listed as *next steps*, not as features.
* Playwright/Chromium cannot run inside some sandboxed CI containers (Chromium's zygote cannot
  fork). Type-checking, the production build and a DOM-level hydration run all pass; add a browser
  test of your own if your environment allows it.
