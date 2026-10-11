import type { Metadata, Viewport } from "next";

import "@/lib/fonts";
import "./globals.css";

import { siteConfig, siteUrl } from "@/data/site-config";
import { projects } from "@/data/projects";
import { AppShell } from "@/components/providers/app-shell";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.name.full} — ${siteConfig.role}`,
    template: `%s · ${siteConfig.name.full}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.seo.keywords,
  authors: [{ name: siteConfig.name.full }],
  creator: siteConfig.name.full,
  applicationName: `${siteConfig.name.full} — Portfolio`,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: `${siteConfig.name.full} — Engineering the extraordinary.`,
    description: siteConfig.description,
    siteName: `${siteConfig.name.full} Portfolio`,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name.full} — Engineering the extraordinary.`,
    description: siteConfig.description,
    ...(siteConfig.seo.twitter ? { creator: siteConfig.seo.twitter } : {}),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#04060a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  // Locking zoom would hurt accessibility — the design stays usable at 200%.
  maximumScale: 5,
};

/** Structured data so search engines understand who this page is about. */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name.full,
  jobTitle: siteConfig.role,
  description: siteConfig.description,
  url: siteUrl,
  email: `mailto:${siteConfig.email}`,
  knowsAbout: siteConfig.seo.keywords,
  sameAs: siteConfig.socials
    .map((social) => social.url)
    .filter((url) => url.startsWith("http")),
};

const projectsJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Selected work",
  itemListElement: projects.map((project, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: project.title,
    description: project.description,
    url: `${siteUrl}/work/${project.id}`,
  })),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Reveal anything animated by JS if JS never runs (or is blocked). */}
        <noscript>
          <style>{`[data-animate],[data-hero-copy],[data-hero-hint],[data-hero-scene]{opacity:1!important;transform:none!important;clip-path:none!important}`}</style>
        </noscript>
        <script
          type="application/ld+json"
          // Static, developer-authored JSON — no user input reaches this string.
          dangerouslySetInnerHTML={{ __html: JSON.stringify([personJsonLd, projectsJsonLd]) }}
        />
      </head>
      <body className="min-h-screen bg-obsidian antialiased">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:border focus:border-volt focus:bg-obsidian focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-volt"
        >
          Skip to content
        </a>

        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
