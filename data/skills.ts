import type { Skill, SkillGroup } from "@/lib/types";

/**
 * Skills are declared as *capabilities*, never as invented proficiency
 * percentages. Each node is only listed if it has appeared in a real project
 * in `data/projects.ts`.
 *
 * The constellation layout is computed (see `components/sections/skills.tsx`),
 * so adding a skill here automatically places and animates it — no pixel
 * coordinates to maintain.
 */
export const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    label: "Frontend",
    accent: "#ccff00",
    description: "Interfaces, motion and 3D layers.",
  },
  {
    id: "backend",
    label: "Backend",
    accent: "#9ae6ff",
    description: "APIs, auth and server-side logic.",
  },
  {
    id: "data",
    label: "Databases",
    accent: "#c9b6ff",
    description: "Modelling, querying and persistence.",
  },
  {
    id: "ai",
    label: "AI / ML",
    accent: "#ffb86b",
    description: "Models, retrieval and computer vision.",
  },
  {
    id: "tools",
    label: "Tooling",
    accent: "#e7ecf3",
    description: "The daily workflow around the code.",
  },
];

export const skills: Skill[] = [
  // ── Frontend ────────────────────────────────────────────────────────────
  { id: "react", label: "React", group: "frontend", primary: true },
  { id: "nextjs", label: "Next.js", group: "frontend", primary: true },
  { id: "typescript", label: "TypeScript", group: "frontend", primary: true },
  { id: "tailwind", label: "Tailwind CSS", group: "frontend" },
  { id: "framer-motion", label: "Framer Motion", group: "frontend" },
  { id: "three", label: "Three.js / R3F", group: "frontend" },
  { id: "vite", label: "Vite", group: "frontend" },
  { id: "css", label: "Modern CSS", group: "frontend" },

  // ── Backend ─────────────────────────────────────────────────────────────
  { id: "node", label: "Node.js", group: "backend", primary: true },
  { id: "express", label: "Express", group: "backend", primary: true },
  { id: "rest", label: "REST API design", group: "backend", primary: true },
  { id: "jwt", label: "JWT / Auth", group: "backend" },
  { id: "validation", label: "Validation & error handling", group: "backend" },
  { id: "env", label: "Environment / secrets hygiene", group: "backend" },

  // ── Databases ───────────────────────────────────────────────────────────
  { id: "mongodb", label: "MongoDB", group: "data", primary: true },
  { id: "mongoose", label: "Mongoose", group: "data", primary: true },
  { id: "schema", label: "Schema & data modelling", group: "data" },
  { id: "queries", label: "Querying & aggregation", group: "data" },

  // ── AI / ML ─────────────────────────────────────────────────────────────
  { id: "python", label: "Python", group: "ai", primary: true },
  { id: "openrouter", label: "LLM APIs (OpenRouter)", group: "ai", primary: true },
  { id: "rag", label: "Retrieval-augmented generation", group: "ai", primary: true },
  { id: "docprocessing", label: "Document processing", group: "ai" },
  { id: "mediapipe", label: "MediaPipe", group: "ai" },
  { id: "opencv", label: "OpenCV", group: "ai" },
  { id: "pygame", label: "Pygame", group: "ai" },

  // ── Tooling ─────────────────────────────────────────────────────────────
  { id: "git", label: "Git", group: "tools", primary: true },
  { id: "github", label: "GitHub", group: "tools", primary: true },
  { id: "postman", label: "Postman", group: "tools" },
  { id: "npm", label: "npm / package tooling", group: "tools" },
  { id: "gsap", label: "GSAP + ScrollTrigger", group: "tools" },
  { id: "locomotive", label: "Locomotive Scroll", group: "tools" },
];

export function skillsByGroup(groupId: string): Skill[] {
  return skills.filter((skill) => skill.group === groupId);
}

export const skillCount = skills.length;
