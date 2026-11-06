import { ImageResponse } from "next/og";

/** /logo.png — logotipo rasterizado 512×512 para el JSON-LD Organization (Google no admite SVG como logo). */
export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#16201c",
          borderRadius: 112,
          color: "white",
          fontSize: 220,
          fontWeight: 800,
          fontFamily: "sans-serif",
        }}
      >
        ET
      </div>
    ),
    { width: 512, height: 512 },
  );
}
