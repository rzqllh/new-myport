import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Hafizh Rizqullah Prasetya — PMO, UI/UX Designer, Web Engineer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#09090b",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
          color: "#f4f4f5",
          border: "1px solid #27272a",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "#18181b",
              border: "1px solid #3f3f46",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: 700,
            }}
          >
            H
          </div>
          <span
            style={{
              fontSize: "24px",
              fontWeight: 600,
              color: "#a1a1aa",
              letterSpacing: "-0.5px",
            }}
          >
            rzqllh-port.vercel.app
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div
            style={{
              fontSize: "64px",
              fontWeight: 800,
              letterSpacing: "-2px",
              lineHeight: 1.1,
              color: "#fafafa",
            }}
          >
            Hafizh Rizqullah Prasetya
          </div>
          <div
            style={{
              fontSize: "30px",
              fontWeight: 500,
              color: "#a1a1aa",
              letterSpacing: "-0.5px",
            }}
          >
            PMO · UI/UX Designer · Web Engineer
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
          }}
        >
          {["Project Management", "Product Design Systems", "Web Engineering"].map((tag) => (
            <div
              key={tag}
              style={{
                padding: "8px 18px",
                borderRadius: "9999px",
                background: "#18181b",
                border: "1px solid #27272a",
                fontSize: "18px",
                color: "#d4d4d8",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
