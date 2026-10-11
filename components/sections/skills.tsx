"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import { skillGroups, skills } from "@/data/skills";
import type { SkillGroupId } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Reveal, SectionLabel } from "@/components/animations/reveal";

const CENTER = 50;
const CLUSTER_RADIUS = 32;
const VIEWBOX = 100;

type Node = {
  id: string;
  label: string;
  x: number;
  y: number;
  primary: boolean;
  group: SkillGroupId;
};

/**
 * SKILLS — an interactive constellation.
 *
 * The layout is *computed* from the data: each group becomes a cluster placed on
 * a ring around the hub, and each skill orbits its cluster. Adding a skill to
 * `data/skills.ts` places and animates it automatically.
 *
 * Honesty rules enforced by the design: no percentages, no progress bars, no
 * "9/10" — a technology is either in the constellation (because it appears in a
 * real project) or it is not.
 *
 * Accessibility: the SVG is decorative (`aria-hidden`) and pointer-only; the
 * grouped list beside it is the real, keyboard-accessible interface and both
 * stay in sync through the same `activeGroup` state.
 */
export function Skills() {
  const [activeGroup, setActiveGroup] = useState<SkillGroupId | null>(null);

  const layout = useMemo(() => {
    const groupCount = skillGroups.length;

    const clusters = skillGroups.map((group, groupIndex) => {
      const angle = (-90 + (360 / groupCount) * groupIndex) * (Math.PI / 180);
      const cx = CENTER + Math.cos(angle) * CLUSTER_RADIUS;
      const cy = CENTER + Math.sin(angle) * CLUSTER_RADIUS;

      const groupSkills = skills.filter((skill) => skill.group === group.id);
      const ringRadius = 8.5 + groupSkills.length * 0.55;

      const nodes: Node[] = groupSkills.map((skill, index) => {
        const nodeAngle =
          (-90 + (360 / groupSkills.length) * index + groupIndex * 18) * (Math.PI / 180);
        return {
          id: skill.id,
          label: skill.label,
          group: skill.group,
          primary: Boolean(skill.primary),
          x: cx + Math.cos(nodeAngle) * ringRadius,
          y: cy + Math.sin(nodeAngle) * (ringRadius * 0.78),
        };
      });

      return { group, cx, cy, nodes, ringRadius };
    });

    return { clusters };
  }, []);

  const isDimmed = (groupId: SkillGroupId) => activeGroup !== null && activeGroup !== groupId;

  return (
    <section id="skills" aria-labelledby="skills-heading" className="relative py-24 sm:py-32">
      <div className="shell">
        <SectionLabel index="03" label="Skills & stack" />

        <div className="mt-10 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="flex flex-col gap-6">
            <Reveal>
              <h2 id="skills-heading" className="text-display-lg max-w-xl text-chrome">
                Everything here shipped in a real project.
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="text-body-lg max-w-lg">
                No percentage bars, no invented proficiency scores. Hover a constellation cluster —
                or filter by group — to see where each technology has actually been used.
              </p>
            </Reveal>

            {/* Constellation (pointer enhancement, decorative for AT) */}
            <div className="relative mt-2 hidden aspect-square w-full max-w-[36rem] md:block">
              <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(204,255,0,0.07),transparent_70%)]" />
              <svg
                viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
                className="absolute inset-0 h-full w-full"
                aria-hidden="true"
              >
                <defs>
                  <radialGradient id="node-core">
                    <stop offset="0%" stopColor="#ccff00" />
                    <stop offset="100%" stopColor="#ccff00" stopOpacity="0.1" />
                  </radialGradient>
                </defs>

                {/* orbital guides */}
                <circle
                  cx={CENTER}
                  cy={CENTER}
                  r={CLUSTER_RADIUS}
                  fill="none"
                  stroke="rgba(231,236,243,0.08)"
                  strokeWidth="0.15"
                  strokeDasharray="0.8 1.4"
                />

                {/* hub → cluster spokes */}
                {layout.clusters.map(({ group, cx, cy }) => (
                  <line
                    key={`spoke-${group.id}`}
                    x1={CENTER}
                    y1={CENTER}
                    x2={cx}
                    y2={cy}
                    stroke={activeGroup === group.id ? group.accent : "rgba(231,236,243,0.16)"}
                    strokeWidth="0.2"
                    strokeDasharray="1.2 1.2"
                  />
                ))}

                {/* cluster rings + cluster → skill links */}
                {layout.clusters.map(({ group, cx, cy, ringRadius, nodes }) => (
                  <g key={`cluster-${group.id}`}>
                    <ellipse
                      cx={cx}
                      cy={cy}
                      rx={ringRadius * 1.18}
                      ry={ringRadius * 0.95}
                      fill="none"
                      stroke={group.accent}
                      strokeOpacity={activeGroup === group.id ? 0.4 : 0.14}
                      strokeWidth="0.16"
                    />
                    {nodes.map((node) => (
                      <line
                        key={`link-${node.id}`}
                        x1={cx}
                        y1={cy}
                        x2={node.x}
                        y2={node.y}
                        stroke={group.accent}
                        strokeOpacity={isDimmed(node.group) ? 0.05 : 0.3}
                        strokeWidth="0.14"
                      />
                    ))}
                  </g>
                ))}

                {/* hub */}
                <circle cx={CENTER} cy={CENTER} r="2.4" fill="url(#node-core)" />
                <circle cx={CENTER} cy={CENTER} r="1.1" fill="#ccff00" />
              </svg>

              {/* pointer targets & labels */}
              {layout.clusters.map(({ group, cx, cy, nodes }) => (
                <div key={`hot-${group.id}`}>
                  <button
                    type="button"
                    tabIndex={-1}
                    aria-hidden="true"
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                    style={{ left: `${cx}%`, top: `${cy}%` }}
                    onMouseEnter={() => setActiveGroup(group.id)}
                    onMouseLeave={() => setActiveGroup(null)}
                    onClick={() =>
                      setActiveGroup((current) => (current === group.id ? null : group.id))
                    }
                  >
                    <span
                      className={cn(
                        "block size-3 rounded-full transition-all duration-500",
                        isDimmed(group.id) ? "scale-75 opacity-30" : "opacity-100",
                      )}
                      style={{ backgroundColor: group.accent }}
                    />
                    <span
                      className={cn(
                        "absolute left-1/2 top-4 -translate-x-1/2 whitespace-nowrap font-mono text-[0.625rem] tracking-[0.22em] uppercase transition-colors duration-500",
                        isDimmed(group.id) ? "text-ash-dim/50" : "text-chrome",
                      )}
                    >
                      {group.label}
                    </span>
                  </button>

                  {nodes.map((node) => (
                    <motion.span
                      key={node.id}
                      className={cn(
                        "pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[0.5625rem] tracking-[0.1em] uppercase transition-colors duration-500",
                        isDimmed(node.group) ? "text-ash-dim/40" : "text-ash",
                        node.primary && !isDimmed(node.group) && "text-chrome",
                      )}
                      style={{ left: `${node.x}%`, top: `${node.y}%` }}
                      animate={{
                        opacity: isDimmed(node.group) ? 0.25 : 1,
                        scale: node.primary ? 1 : 0.94,
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      <span
                        className="mr-1.5 inline-block size-1 rounded-full align-middle"
                        style={{
                          backgroundColor: isDimmed(node.group)
                            ? "rgba(95,104,117,0.5)"
                            : group.accent,
                        }}
                      />
                      {node.label}
                    </motion.span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Accessible list / filter */}
          <div className="flex flex-col gap-8">
            <Reveal>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveGroup(null)}
                  aria-pressed={activeGroup === null}
                  className={cn(
                    "border px-3 py-1.5 font-mono text-[0.625rem] tracking-[0.18em] uppercase transition-colors",
                    activeGroup === null
                      ? "border-volt/60 bg-volt/10 text-volt"
                      : "border-line text-ash hover:border-line-strong hover:text-chrome",
                  )}
                >
                  All ({skills.length})
                </button>
                {skillGroups.map((group) => {
                  const count = skills.filter((skill) => skill.group === group.id).length;
                  const isActive = activeGroup === group.id;
                  return (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() =>
                        setActiveGroup((current) => (current === group.id ? null : group.id))
                      }
                      aria-pressed={isActive}
                      className={cn(
                        "border px-3 py-1.5 font-mono text-[0.625rem] tracking-[0.18em] uppercase transition-colors",
                        isActive
                          ? "text-obsidian"
                          : "border-line text-ash hover:border-line-strong hover:text-chrome",
                      )}
                      style={isActive ? { backgroundColor: group.accent, borderColor: group.accent } : undefined}
                    >
                      {group.label} ({count})
                    </button>
                  );
                })}
              </div>
            </Reveal>

            <div className="flex flex-col divide-y divide-line border-y border-line">
              {skillGroups.map((group) => {
                const groupSkills = skills.filter((skill) => skill.group === group.id);
                const dimmed = isDimmed(group.id);

                return (
                  <div
                    key={group.id}
                    className={cn(
                      "flex flex-col gap-3 py-5 transition-opacity duration-500",
                      dimmed && "opacity-35",
                    )}
                    onMouseEnter={() => setActiveGroup(group.id)}
                    onMouseLeave={() => setActiveGroup(null)}
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="flex items-center gap-3">
                        <span
                          className="size-1.5 rounded-full"
                          style={{ backgroundColor: group.accent }}
                          aria-hidden="true"
                        />
                        <span className="font-display text-lg text-chrome">{group.label}</span>
                      </span>
                      <span className="font-mono text-[0.5625rem] tracking-[0.18em] text-ash-dim uppercase">
                        {group.description}
                      </span>
                    </div>

                    <ul className="flex flex-wrap gap-2">
                      {groupSkills.map((skill) => (
                        <li key={skill.id}>
                          <button
                            type="button"
                            onClick={() => setActiveGroup(group.id)}
                            className={cn(
                              "border border-line px-2.5 py-1 font-mono text-[0.625rem] tracking-[0.12em] uppercase transition-colors hover:border-volt/50 hover:text-volt",
                              skill.primary ? "text-chrome" : "text-ash-dim",
                            )}
                          >
                            {skill.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            <Reveal>
              <p className="font-mono text-[0.625rem] leading-relaxed tracking-[0.14em] text-ash-dim uppercase">
                Currently learning · system design fundamentals, testing practices and deeper
                machine-learning theory
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
