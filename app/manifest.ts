import type { MetadataRoute } from "next";

import { siteConfig } from "@/data/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name.full} — ${siteConfig.role}`,
    short_name: siteConfig.name.short,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#04060a",
    theme_color: "#04060a",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
