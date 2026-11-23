import { Logo } from "@/components/brand/Logo";
import { SiteNav } from "@/components/layout/SiteNav";
import { Container } from "@/components/ui/Container";
import { mainNavigation } from "@/data/navigation";

export function SiteHeader() {
  return (
    <header className="site-header border-b border-nila/15 bg-kapas">
      <Container className="flex items-center justify-between gap-6 py-3">
        <Logo />
        <SiteNav links={mainNavigation} />
      </Container>
    </header>
  );
}
