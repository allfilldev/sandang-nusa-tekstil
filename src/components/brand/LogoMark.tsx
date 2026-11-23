interface LogoMarkProps {
  className?: string;
  tone?: "dark" | "light";
}

const weftColor = "#E3A21A";

export function LogoMark({ className = "h-9 w-9", tone = "dark" }: LogoMarkProps) {
  const warpColor = tone === "light" ? "#C9D2EA" : "#1F2D5C";

  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className={className}>
      <rect x="6" y="12" width="52" height="14" rx="3" fill={weftColor} />
      <rect x="6" y="38" width="52" height="14" rx="3" fill={weftColor} />
      <rect x="12" y="6" width="14" height="52" rx="3" fill={warpColor} />
      <rect x="38" y="6" width="14" height="52" rx="3" fill={warpColor} />
      <rect x="38" y="12" width="14" height="14" fill={weftColor} />
      <rect x="12" y="38" width="14" height="14" fill={weftColor} />
    </svg>
  );
}
