import { ImageResponse } from "next/og";

export const alt = "Brieflab: practice briefing AI coding agents";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brie, happy (same drawing as components/Brie.tsx), as an SVG data URI for the image renderer.
const BRIE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><path d="M32 22 H80 L100 42 V90 a12 12 0 0 1 -12 12 H32 a12 12 0 0 1 -12 -12 V34 a12 12 0 0 1 12 -12 Z" fill="#F7E36A" stroke="#14181D" stroke-width="4" stroke-linejoin="round"/><path d="M80 22 V42 H100 Z" fill="#D9BE3A" stroke="#14181D" stroke-width="4" stroke-linejoin="round"/><path d="M42 58 q6 -8 12 0 M66 58 q6 -8 12 0" fill="none" stroke="#14181D" stroke-width="4" stroke-linecap="round"/><path d="M51 69 q9 9 18 0" fill="none" stroke="#14181D" stroke-width="4" stroke-linecap="round"/><circle cx="38" cy="68" r="5" fill="#F2A93B" opacity=".45"/><circle cx="82" cy="68" r="5" fill="#F2A93B" opacity=".45"/><path d="M36 88 H70 M36 95 H58" stroke="#14181D" stroke-width="3" stroke-linecap="round" opacity=".25"/></svg>`;

export default function Image() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", gap: 56, padding: "0 90px", background: "#F4F6F7", color: "#14181D" }}>
      <img src={`data:image/svg+xml,${encodeURIComponent(BRIE)}`} width={300} height={300} alt="" />
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div style={{ display: "flex", alignItems: "center", fontSize: 92, fontWeight: 700, letterSpacing: -3 }}>
          <span style={{ background: "#F7E36A", padding: "0 18px 6px", borderRadius: 10 }}>brief</span>
          <span style={{ marginLeft: 6 }}>lab</span>
        </div>
        <div style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.15, maxWidth: 660 }}>Get the same result with fewer tokens.</div>
        <div style={{ fontSize: 28, color: "#58626D" }}>Practice briefing AI coding agents on real code.</div>
      </div>
    </div>,
    size,
  );
}
