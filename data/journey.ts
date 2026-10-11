import type { JourneyEntry } from "@/lib/types";

/**
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  TIMELINE — verified statements only.                                 │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * Nothing in this file invents an employer, a certificate, a date or a grade.
 * Where a specific date or institution is unknown the entry says so honestly
 * ("Ongoing", "Self-directed") instead of guessing.
 *
 * TODO(you): add real terms/dates and your institute's name — the timeline
 * component renders whatever you put in `period` and `org` verbatim.
 */
export const journey: JourneyEntry[] = [
  {
    id: "diploma",
    period: "Ongoing",
    title: "Diploma in Computer Science & Engineering",
    org: "Add your institute", // TODO(you)
    kind: "education",
    description:
      "Formal foundation in the subjects that keep showing up in my own projects — programming fundamentals, data structures, database systems and computer networks.",
    points: [
      "Coursework focus: programming fundamentals, data structures, DBMS, computer networks",
      "Applied the syllabus directly: every subject became a project instead of an assignment"
    ],
  },
  {
    id: "project-build-phase",
    period: "Ongoing",
    title: "Building and shipping full-stack projects",
    org: "Independent",
    kind: "project",
    description:
      "Five projects, each one chosen to attack a weak spot in my own skill set rather than to add another card to a portfolio grid.",
    points: [
      "AI Code Reviewer — React/Vite client on an Express API with OpenRouter models",
      "AI Learning Assistant — MERN document processing with retrieval-augmented answers",
      "Bank Transaction API — JWT-protected Express/MongoDB backend for accounts and transfers",
      "Touch-Free Hill Climb Game — MediaPipe hand tracking driving a Python game loop",
      "Crafton Bags — e-commerce storefront with a centralised, derived cart state",
    ],
  },
  {
    id: "backend-deep-dive",
    period: "Self-directed",
    title: "Deep dive: backend & API engineering",
    org: "Bank Transaction API, AI Code Reviewer",
    kind: "learning",
    description:
      "Learned that the interesting part of a backend is the failure path. Auth, validation and data modelling became the focus instead of route handlers.",
    points: [
      "Structured Express services with separated auth / account / transaction routes",
      "Stateless JWT authentication with per-route ownership checks",
      "Mongoose schemas designed around an append-only transaction log",
    ],
  },
  {
    id: "applied-ai",
    period: "Self-directed",
    title: "Applied AI: retrieval, documents and vision",
    org: "AI Learning Assistant, Touch-Free Hill Climb Game",
    kind: "learning",
    description:
      "Moved past prompt-and-pray: grounding answers in retrieved documents, extracting text from uploads, and translating computer-vision output into real control input.",
    points: [
      "Chunking + retrieval so answers cite the uploaded material",
      "LLM integration through a provider-agnostic gateway (OpenRouter)",
      "MediaPipe landmarks mapped to debounced, playable game input",
    ],
  },
  {
    id: "interactive-web",
    period: "Self-directed",
    title: "Interactive web: motion, shaders and 3D",
    org: "This portfolio",
    kind: "learning",
    description:
      "Built the site you are reading to understand how real-time 3D, scroll-driven animation and smooth scrolling coexist without fighting each other.",
    points: [
      "React Three Fiber scenes with pointer-reactive geometry and custom materials",
      "GSAP ScrollTrigger synchronised with Locomotive Scroll through a scroller proxy",
      "Framer Motion for interface state: menus, modals, layout transitions",
      "Performance budgets on mobile: reduced particle counts, native scrolling, no pinning",
    ],
  },
  {
    id: "next",
    period: "Next",
    title: "Looking for an internship",
    org: "Full-stack · Backend · AI integration",
    kind: "work",
    description:
      "Ready to contribute to production systems with a team: writing maintainable code, learning from review, and shipping things real people use.",
    points: [
      "Comfortable across the stack, happiest in the API and data layer",
      "Open to internships and freelance work — remote or on-site",
    ],
  },
];
