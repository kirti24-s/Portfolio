"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Mail } from "lucide-react";

import { siteConfig } from "@/data/site-config";
import { cn } from "@/lib/utils";
import { Reveal, SectionLabel } from "@/components/animations/reveal";
import { ContactForm } from "@/components/ui/contact-form";
import { SocialList } from "@/components/ui/social-links";

/**
 * CONTACT — the cinematic close.
 *
 * A rotating orbital structure frames a single oversized invitation, with the
 * email address as the primary action, a guaranteed mailto path, and an
 * optional working form (see `/api/contact`).
 */
export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="relative overflow-hidden py-24 sm:py-32">
      {/* orbital backdrop — CSS transforms only, no JS per frame */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(204,255,0,0.09),transparent_70%)]" />
        {[
          { size: "min(58vw, 46rem)", duration: 54, reverse: false, accent: true, dots: 3 },
          { size: "min(78vw, 64rem)", duration: 78, reverse: true, accent: false, dots: 2 },
          { size: "min(96vw, 82rem)", duration: 104, reverse: false, accent: false, dots: 1 },
        ].map((ring) => (
          <motion.div
            key={ring.size}
            className={cn(
              "absolute rounded-full border",
              ring.accent ? "border-volt/20" : "border-chrome/10",
            )}
            style={{ width: ring.size, height: ring.size }}
            animate={{ rotate: ring.reverse ? -360 : 360 }}
            transition={{ duration: ring.duration, ease: "linear", repeat: Infinity }}
          >
            {Array.from({ length: ring.dots }).map((_, index) => (
              <span
                key={index}
                className={cn(
                  "absolute size-2 rounded-full",
                  ring.accent ? "bg-volt" : "bg-chrome/50",
                )}
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `rotate(${(360 / ring.dots) * index}deg) translateX(calc(${ring.size} / 2)) translateY(-50%)`,
                }}
              />
            ))}
          </motion.div>
        ))}
      </div>

      <div className="shell relative">
        <SectionLabel index="05" label="Contact" />

        <div className="mt-10 grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div className="flex flex-col gap-8">
            <Reveal>
              <h2 id="contact-heading" className="text-display-lg max-w-2xl text-chrome">
                Let&apos;s build something
                <span className="italic"> extraordinary.</span>
              </h2>
            </Reveal>

            <Reveal delay={0.08}>
              <p className="text-body-lg max-w-lg">
                I&apos;m looking for an internship or a first freelance collaboration where I can
                contribute across the stack — and keep learning from people who have shipped more
                than I have.
              </p>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="flex flex-col gap-4">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="group inline-flex w-fit items-center gap-4 break-all font-display text-[clamp(1.25rem,3.4vw,2.25rem)] leading-none tracking-[-0.03em] text-chrome transition-colors hover:text-volt"
                  data-cursor-label="Copy email"
                >
                  <Mail className="size-5 shrink-0 text-volt" aria-hidden="true" />
                  {siteConfig.email}
                  <ArrowUpRight className="size-5 shrink-0 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" />
                </a>

                <SocialList className="max-w-lg" />
              </div>
            </Reveal>

            <Reveal delay={0.16}>
              <dl className="grid gap-6 sm:grid-cols-3">
                {[
                  { term: "Status", detail: siteConfig.availability },
                  { term: "Based in", detail: siteConfig.location },
                  { term: "Open to", detail: "Internships · freelance" },
                ].map((item) => (
                  <div key={item.term} className="flex flex-col gap-1">
                    <dt className="eyebrow">{item.term}</dt>
                    <dd className="font-mono text-[0.75rem] tracking-[0.06em] text-chrome">
                      {item.detail}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="panel p-6 sm:p-8">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-xl text-chrome">Send a message</h3>
                <span className="font-mono text-[0.5625rem] tracking-[0.18em] text-ash-dim uppercase">
                  Optional form
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ash">
                Prefer email? The link on the left always works. The form below is wired to a
                server route that only sends when a mail provider is configured.
              </p>
              <ContactForm className="mt-7" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
