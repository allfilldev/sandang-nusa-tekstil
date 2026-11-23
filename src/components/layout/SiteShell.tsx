import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { WhatsAppFloatingButton } from "@/components/layout/WhatsAppFloatingButton";

interface SiteShellProps {
  children: ReactNode;
}

export function SiteShell({ children }: SiteShellProps) {
  return (
    <>
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-benang focus:px-4 focus:py-2 focus:font-bold"
      >
        Lewati ke konten
      </a>
      <SiteHeader />
      <main id="konten">{children}</main>
      <SiteFooter />
      <WhatsAppFloatingButton />
    </>
  );
}
