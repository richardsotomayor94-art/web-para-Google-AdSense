import { ImageResponse } from "next/og";
import { siteConfig } from "../site";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/** Plantilla común de imágenes OpenGraph dinámicas (next/og = @vercel/og). */
export function renderOg({ eyebrow, title, footer }: { eyebrow: string; title: string; footer?: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#f3f5f4",
          color: "#16201c",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#16201c",
              color: "white",
              fontSize: 28,
              fontWeight: 800,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ET
          </div>
          <div style={{ display: "flex", fontSize: 36, fontWeight: 800 }}>
            <span>ErgoTop</span>
            <span style={{ color: "#66726c", marginLeft: -9 }}>Lab</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", fontSize: 28, color: "#2f5bea", fontWeight: 700 }}>
            {eyebrow}
          </div>
          <div style={{ display: "flex", fontSize: title.length > 70 ? 54 : 66, fontWeight: 800, lineHeight: 1.1 }}>{title}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#3c4842", borderTop: "2px solid #cfd7d3", paddingTop: 24 }}>
          <span>{footer ?? siteConfig.tagline}</span>
          <span>{siteConfig.url.replace(/^https?:\/\//, "")}</span>
        </div>
      </div>
    ),
    ogSize,
  );
}
