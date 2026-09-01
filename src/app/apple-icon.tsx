import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 72,
          background: "#09090b",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#f4f4f5",
          fontWeight: 800,
          fontFamily: "system-ui, sans-serif",
          borderRadius: "36px",
          border: "4px solid #27272a",
        }}
      >
        H
      </div>
    ),
    {
      ...size,
    }
  );
}
