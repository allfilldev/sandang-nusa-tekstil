import type { Metadata } from "next";
import type { ReactNode } from "react";

// Panel admin selalu dirender per permintaan (bergantung pada sesi login), tidak pernah dibuat statis atau di-cache.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Panel Admin", template: "%s | Panel Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return children;
}
