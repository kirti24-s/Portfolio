import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getProject, getProjectIds, projects } from "@/data/projects";
import { siteUrl } from "@/data/site-config";
import { ProjectDetail } from "@/components/projects/project-detail";
import { Footer } from "@/components/navigation/footer";
import { ProjectNav } from "@/components/projects/project-nav";

/** Pre-render every case study at build time. */
export function generateStaticParams() {
  return getProjectIds().map((id) => ({ id }));
}

/**
 * Every case study is pre-rendered from `generateStaticParams`, and the param
 * set is authoritative: an unknown id must answer with a real **404 status**
 * rather than a cached page body. (Next.js logs an internal "NoFallbackError"
 * line when this happens — it is the mechanism that produces the 404, not a
 * failure.)
 */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = getProject(id);
  if (!project) return { title: "Project not found" };

  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `/work/${project.id}` },
    openGraph: {
      type: "article",
      title: `${project.title} — ${project.category}`,
      description: project.description,
      url: `${siteUrl}/work/${project.id}`,
      images: [{ url: project.media.src, width: project.media.width, height: project.media.height }],
    },
  };
}

/**
 * Deep-linkable case study.
 *
 * The same `ProjectDetail` component the modal uses — one write-up, two entry
 * points — wrapped in a real page with its own metadata, so links to individual
 * projects are shareable and indexable.
 */
export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = getProject(id);

  if (!project) notFound();

  const index = projects.findIndex((item) => item.id === project.id);
  const next = projects[(index + 1) % projects.length];
  const previous = projects[(index - 1 + projects.length) % projects.length];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    url: `${siteUrl}/work/${project.id}`,
    keywords: project.tech.join(", "),
    genre: project.category,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="shell pb-4 pt-32 sm:pt-40">
        <Link
          href="/#work"
          className="group mb-10 inline-flex items-center gap-2 font-mono text-[0.625rem] tracking-[0.2em] text-ash uppercase transition-colors hover:text-volt"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
          Back to selected work
        </Link>

        <ProjectDetail project={project} headingLevel="h1" />

        <ProjectNav
          previous={{ id: previous.id, title: previous.title }}
          next={{ id: next.id, title: next.title }}
        />
      </article>

      <Footer />
    </>
  );
}
