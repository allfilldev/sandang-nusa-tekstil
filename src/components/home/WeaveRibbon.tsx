import type { CSSProperties } from "react";

const ribbonRows = [0, 1, 2];

export function WeaveRibbon() {
  return (
    <div className="ribbon w-full max-w-sm" aria-hidden="true">
      {ribbonRows.map((row) => (
        <span
          key={row}
          className="ribbon-weft"
          style={{ "--row": row, "--from": row % 2 === 0 ? "-100%" : "100%" } as CSSProperties}
        />
      ))}
      <span className="ribbon-over" />
    </div>
  );
}
