import type { ReactNode } from "react";
import { SiteShell } from "@/components/layout/SiteShell";

interface SiteLayoutProps {
  children: ReactNode;
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  return <SiteShell>{children}</SiteShell>;
}
