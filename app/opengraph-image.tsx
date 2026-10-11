import { ImageResponse } from "next/og";

import { siteConfig } from "@/data/site-config";

/**
 * Open Graph card generated at build time with `next/og` — no external service,
 * no committed PNG, and it stays in sync with `data/site-config.ts`.
 */
export const alt = `${siteConfig.name.full} — ${siteConfig.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#04060a",
          backgroundImage:
            "radial-gradient(120% 90% at 50% 0%, #0b0f16 0%, #04060a 60%), radial-gradient(60% 60% at 78% 30%, rgba(204,255,0,0.22), transparent 60%)",
          padding: "72px",
          color: "#e7ecf3",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              border: "1px solid rgba(204,255,0,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ccff00",
              fontSize: 20,
            }}
          >
            {siteConfig.name.initials}
          </div>
          <div style={{ fontSize: 22, letterSpacing: 6, textTransform: "uppercase", color: "#99a2b0" }}>
            {siteConfig.name.full}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 88, lineHeight: 1, letterSpacing: -3 }}>
            {siteConfig.headline.line1}
          </div>
          <div
            style={{
              fontSize: 88,
              lineHeight: 1,
              letterSpacing: -3,
              fontStyle: "italic",
              color: "#ccff00",
            }}
          >
            {siteConfig.headline.line2}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(231,236,243,0.14)",
            paddingTop: 26,
            fontSize: 20,
            color: "#99a2b0",
          }}
        >
          <span>Full-stack · Backend · AI integration</span>
          <span style={{ color: "#ccff00" }}>{siteConfig.location}</span>
        </div>
      </div>
    ),
    size,
  );
}
