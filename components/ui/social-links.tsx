"use client";

import { FileText, Mail, type LucideIcon } from "lucide-react";

import { siteConfig } from "@/data/site-config";
import { cn, isPlaceholderUrl } from "@/lib/utils";
import { GithubMark, LinkedinMark } from "@/components/ui/brand-icons";

/** Brand marks are inline SVG; everything else comes from Lucide. */
function GithubIcon({ className }: { className?: string }) {
  return <GithubMark className={className} />;
}

function LinkedinIcon({ className }: { className?: string }) {
  return <LinkedinMark className={className} />;
}

const ICONS: Record<string, LucideIcon | typeof GithubIcon> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  mail: Mail,
  file: FileText,
};

/** Icon strip used by the nav, the contact section and the footer. */
export function SocialIcons({
  className,
  size = "md",
  includeResume = true,
}: {
  className?: string;
  size?: "sm" | "md";
  includeResume?: boolean;
}) {
  const items = [
    ...siteConfig.socials,
    ...(includeResume && siteConfig.resumeUrl
      ? [
          {
            id: "resume",
            label: "Résumé",
            url: siteConfig.resumeUrl,
            handle: "PDF",
            icon: "file" as const,
          },
        ]
      : []),
  ];

  return (
    <ul className={cn("flex items-center gap-2", className)}>
      {items.map((item) => {
        const Icon = ICONS[item.icon] ?? Mail;
        const placeholder = isPlaceholderUrl(item.url);
        const box = cn(
          "grid place-items-center border transition-colors duration-300",
          size === "sm" ? "size-9" : "size-11",
          placeholder
            ? "border-line text-ash-dim"
            : "border-line-strong text-chrome hover:border-volt/70 hover:text-volt",
        );

        return (
          <li key={item.id}>
            {placeholder ? (
              <span
                className={box}
                title={`${item.label} — add your real URL in data/site-config.ts`}
              >
                <Icon className={size === "sm" ? "size-4" : "size-[1.15rem]"} aria-hidden="true" />
                <span className="sr-only">
                  {item.label} link not configured yet — add it in data/site-config.ts
                </span>
              </span>
            ) : (
              <a
                href={item.url}
                target={item.url.startsWith("mailto:") ? undefined : "_blank"}
                rel={item.url.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                className={box}
                aria-label={item.label}
                data-cursor-label={item.label}
              >
                <Icon className={size === "sm" ? "size-4" : "size-[1.15rem]"} aria-hidden="true" />
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/** Full-width social rows with handles — contact section + footer. */
export function SocialList({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-col divide-y divide-line border-y border-line", className)}>
      {siteConfig.socials.map((social) => {
        const Icon = ICONS[social.icon] ?? Mail;
        const placeholder = isPlaceholderUrl(social.url);

        return (
          <li key={social.id}>
            {placeholder ? (
              <span className="flex items-center justify-between gap-4 py-4 text-ash-dim">
                <span className="flex items-center gap-3">
                  <Icon className="size-4" aria-hidden="true" />
                  <span className="font-display text-lg">{social.label}</span>
                </span>
                <span className="font-mono text-[0.625rem] tracking-[0.18em] uppercase">
                  add url in site-config
                </span>
              </span>
            ) : (
              <a
                href={social.url}
                target={social.url.startsWith("mailto:") ? undefined : "_blank"}
                rel={social.url.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                className="group flex items-center justify-between gap-4 py-4 transition-colors"
                data-cursor-label={social.label}
              >
                <span className="flex items-center gap-3 text-chrome transition-colors group-hover:text-volt">
                  <Icon className="size-4" aria-hidden="true" />
                  <span className="font-display text-lg">{social.label}</span>
                </span>
                <span className="font-mono text-[0.625rem] tracking-[0.18em] text-ash-dim uppercase transition-colors group-hover:text-volt">
                  {social.handle}
                </span>
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}
