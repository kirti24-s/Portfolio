import type { SiteConfig } from "@/lib/types";

/**
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  EDIT ME — every personal detail on the site lives in this one file.  │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * Anything still containing `your-…` / `example.com` is treated as a
 * placeholder by the UI: links are rendered as *disabled "add link" states*
 * instead of shipping broken hrefs. Replace the values below and the UI will
 * switch to real links automatically — no component changes required.
 */
export const siteConfig: SiteConfig = {
  name: {
    full: "Kirti", // TODO(you): full name, e.g. "Kirti Sharma"
    short: "Kirti",
    initials: "K",
  },

  role: "Computer Science & Engineering Student · Full-Stack Developer",
  location: "India", // TODO(you): "City, Country"
  availability: "Open to internships & freelance",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://your-domain.com",

  /** TODO(you): your real, receiving email address. */
  email: "your-email@example.com",
  /** TODO(you): a link to a hosted PDF (Drive, Dropbox, /resume.pdf…). */
  resumeUrl: null,

  description:
    "Computer Science and Engineering student building thoughtful full-stack applications, AI-powered tools and interactive digital experiences.",

  headline: {
    line1: "Engineering",
    line2: "the extraordinary.",
  },

  subheadline:
    "I build thoughtful full-stack applications, AI-powered tools, and interactive digital experiences.",

  about: {
    intro:
      "I am a Computer Science and Engineering diploma student who likes the part of software where structure matters: the API contract, the data model, the failure path.",
    paragraphs: [
      "My work sits at the intersection of full-stack development and applied AI. I build interfaces with React and Next.js, then spend most of my time behind them — designing REST APIs with Node.js and Express, modelling data in MongoDB, and wiring up retrieval, document processing and model calls that make an application feel intelligent rather than decorative.",
      "Most of what I know comes from shipping: an AI code-review tool, a retrieval-augmented learning assistant, a secure banking API, a computer-vision-controlled game, a storefront. Each one taught me something the previous one got wrong — validation, auth, state, or the difference between a demo and something a stranger can use.",
      "Right now I am deepening my backend and machine-learning fundamentals while looking for an internship where I can contribute to real, production-facing systems.",
    ],
    focus: [
      {
        label: "Full-stack product work",
        detail: "React / Next.js interfaces on top of Express + MongoDB services.",
      },
      {
        label: "Backend engineering",
        detail: "REST API design, authentication, validation, data modelling.",
      },
      {
        label: "AI integration",
        detail: "LLM features, document processing, retrieval-augmented answers.",
      },
      {
        label: "Interactive experiences",
        detail: "Three.js, animation and computer-vision interfaces.",
      },
    ],
    principles: [
      "Read the error, not the guess.",
      "Ship the smallest honest version.",
      "Design the failure path first.",
      "Measure before rewriting.",
    ],
  },

  socials: [
    {
      id: "github",
      label: "GitHub",
      // Derived from this repository's owner. Point it wherever you like.
      url: "https://github.com/kirti24-s",
      handle: "@kirti24-s",
      icon: "github",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      // TODO(you): replace with your real LinkedIn URL.
      url: "https://www.linkedin.com/in/your-handle/",
      handle: "in/your-handle",
      icon: "linkedin",
    },
    {
      id: "email",
      label: "Email",
      // TODO(you): keep in sync with `email` above.
      url: "mailto:your-email@example.com",
      handle: "your-email@example.com",
      icon: "mail",
    },
  ],

  nav: [
    { id: "work", label: "Work" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "journey", label: "Journey" },
    { id: "contact", label: "Contact" },
  ],

  seo: {
    keywords: [
      "full-stack developer portfolio",
      "computer science student",
      "Next.js developer",
      "React Three Fiber",
      "AI integration",
      "MERN stack",
      "backend engineer",
    ],
  },
};

/** Small helpers so components never stringify URLs on their own. */
export const siteUrl = siteConfig.url.replace(/\/$/, "");
export const emailHref = `mailto:${siteConfig.email}`;
