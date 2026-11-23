import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { footerNavigation, legalNavigation } from "@/data/navigation";
import { siteConfig } from "@/data/site";
import { whatsAppUrl } from "@/lib/whatsapp";

const footerLinkClass = "underline decoration-benang/40 underline-offset-4 hover:decoration-kunyit hover:decoration-2";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="squircle mt-20 rounded-t-panel bg-nila pb-32 pt-14 text-benang">
      <div data-nosnippet="">
        <Container className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo tone="light" />
            <p className="mt-4 max-w-[40ch] text-base">{siteConfig.description}</p>
          </div>
          <nav aria-label="Navigasi footer">
            <p className="font-display text-lg font-bold">Jelajahi</p>
            <ul className="mt-3 space-y-2 text-base">
              {footerNavigation.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={footerLinkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="font-display text-lg font-bold">Hubungi kami</p>
            <p className="mt-3 text-base">
              WhatsApp{" "}
              <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer" className={`font-semibold ${footerLinkClass}`}>
                {siteConfig.whatsapp.displayNumber}
              </a>
            </p>
          </div>
        </Container>
        <Container className="mt-10 border-t border-benang/25 pt-6">
          <nav aria-label="Informasi hukum">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-base">
              {legalNavigation.map((link) => (
                <li key={link.href + link.label}>
                  <Link href={link.href} rel={link.rel} className={footerLinkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="mt-4 text-base text-benang/85">
            Hak cipta {currentYear} {siteConfig.name}. Seluruh hak dilindungi.
          </p>
        </Container>
      </div>
    </footer>
  );
}
