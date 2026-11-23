import type { ReactNode } from "react";
import { SiteShell } from "@/components/layout/SiteShell";

// Pratinjau memakai bingkai situs publik (header, footer) tanpa gaya panel admin.
export default function AdminPreviewLayout({ children }: { children: ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
