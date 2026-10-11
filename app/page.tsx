import type { Metadata } from "next";

import { siteConfig } from "@/data/site-config";
import { Hero } from "@/components/sections/hero";
import { KeywordBand } from "@/components/sections/keyword-band";
import { Work } from "@/components/sections/work";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Journey } from "@/components/sections/journey";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/navigation/footer";

export const metadata: Metadata = {
  title: `${siteConfig.name.full} — ${siteConfig.role}`,
  description: siteConfig.description,
};

/**
 * Single-page portfolio, composed as a Server Component.
 *
 * Every section is a client island that knows how to animate itself; the page
 * itself ships no JavaScript beyond those boundaries.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <KeywordBand />
      <Work />
      <About />
      <Skills />
      <Journey />
      <Contact />
      <Footer />
    </>
  );
}
