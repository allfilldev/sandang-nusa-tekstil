import { ImageResponse } from "next/og";

interface OgImageInput {
  title: string;
  subtitle: string;
}

const weaveCells = Array.from({ length: 25 }, (_, index) => index);
const weaveColors = ["#E3A21A", "#C9D2EA"];

export function renderOgImage({ title, subtitle }: OgImageInput): ImageResponse {
  const titleFontSize = title.length > 45 ? 60 : 72;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#1F2D5C",
          padding: 56,
          color: "#FFFFFF",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 760 }}>
          <div style={{ display: "flex", fontSize: 34, fontWeight: 800, color: "#E3A21A" }}>Sandang Nusa Tekstil</div>
          <div style={{ display: "flex", fontSize: titleFontSize, fontWeight: 800, lineHeight: 1.1 }}>{title}</div>
          <div style={{ display: "flex", fontSize: 30, color: "#C9D2EA" }}>{subtitle}</div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", width: 330, height: 330, marginLeft: 56, alignSelf: "center" }}>
          {weaveCells.map((cell) => {
            const row = Math.floor(cell / 5);
            const col = cell % 5;
            const warpOver = (row + col) % 2 === 0;
            return (
              <div
                key={cell}
                style={{
                  width: 66,
                  height: 66,
                  backgroundColor: warpOver ? "#2A3C80" : weaveColors[row % 2],
                }}
              />
            );
          })}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
