import type { ReactNode } from "react";

interface ContentSheetProps {
  children: ReactNode;
  className?: string;
}

export function ContentSheet({ children, className = "" }: ContentSheetProps) {
  return (
    <div
      className={`squircle rounded-sheet border border-nila/10 bg-benang px-5 py-8 shadow-[0_18px_48px_-28px_rgba(31,45,92,0.4)] md:px-10 md:py-12 ${className}`}
    >
      {children}
    </div>
  );
}
