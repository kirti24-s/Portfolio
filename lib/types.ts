/**
 * Shared domain types. Keeping these in one place keeps the data files,
 * the React components and the API route in sync.
 */

export type ClassValue =
  | string
  | number
  | null
  | false
  | undefined
  | ClassValue[]
  | Record<string, boolean | null | undefined>;

export type ProjectCategory =
  | "AI Tooling"
  | "Full-Stack"
  | "Backend"
  | "Machine Learning"
  | "Commerce";

export type ProjectLink = {
  /** Absolute URL, or `null` when the link does not exist yet. */
  url: string | null;
  /** Shown next to the link in the UI (e.g. "GitHub", "Live demo"). */
  label: string;
};

export type ProjectMedia = {
  src: string;
  alt: string;
  /** Intrinsic size of the asset — used by next/image to avoid layout shift. */
  width: number;
  height: number;
  /** Shown under the media in the case study view. */
  caption?: string;
};

export type Project = {
  /** Stable id, also used as the DOM id for deep links (#work-ai-code-reviewer). */
  id: string;
  /** Ordered showcase number, e.g. 1 → "01". */
  index: number;
  title: string;
  category: ProjectCategory;
  /** One-line role/positioning, e.g. "Full-stack · API design". */
  role: string;
  /** Short teaser used in the showcase list. */
  description: string;
  /** Longer, honest narrative used by the case-study view. */
  caseStudy: {
    context: string;
    approach: string[];
    /** What the project actually does, derived from the implemented stack. */
    features: string[];
    /** Notes on what was learned / what is next. Never invented metrics. */
    notes?: string;
  };
  /** Every entry here must be verifiable from the real repository. */
  tech: string[];
  media: ProjectMedia;
  github: ProjectLink;
  live: ProjectLink;
  /** Timeline label — omit rather than invent a date. */
  period?: string;
  /** Marks a project that is still in progress in the UI. */
  status?: "shipped" | "in-progress" | "private";
  /** Renders first / larger in the asymmetric grid. */
  featured?: boolean;
};

export type SkillGroupId = "frontend" | "backend" | "data" | "ai" | "tools";

export type Skill = {
  id: string;
  label: string;
  group: SkillGroupId;
  /** Primary skills render as larger, brighter constellation nodes. */
  primary?: boolean;
  /** Optional short note surfaced on hover. */
  note?: string;
};

export type SkillGroup = {
  id: SkillGroupId;
  label: string;
  /** Tailwind-ready colour token used by both SVG and DOM layers. */
  accent: string;
  description: string;
};

export type JourneyEntry = {
  id: string;
  /** "Ongoing", "2024 — Present", … Only states what is known. */
  period: string;
  title: string;
  org: string;
  kind: "education" | "project" | "learning" | "work";
  description: string;
  points: string[];
};

export type SocialLink = {
  id: string;
  label: string;
  url: string;
  handle: string;
  icon: "github" | "linkedin" | "mail" | "file";
};

export type SiteConfig = {
  name: {
    full: string;
    short: string;
    initials: string;
  };
  role: string;
  location: string;
  availability: string;
  /** Canonical production URL — used by metadata, sitemap and JSON-LD. */
  url: string;
  email: string;
  resumeUrl: string | null;
  description: string;
  headline: {
    line1: string;
    line2: string;
  };
  subheadline: string;
  about: {
    intro: string;
    paragraphs: string[];
    focus: { label: string; detail: string }[];
    principles: string[];
  };
  socials: SocialLink[];
  nav: { id: string; label: string }[];
  seo: {
    keywords: string[];
    twitter?: string;
  };
};
