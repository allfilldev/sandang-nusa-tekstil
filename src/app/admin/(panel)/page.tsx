import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cardClass, pageTitleClass, primaryButtonClass, secondaryButtonClass, sectionHeadingClass, tapLinkClass } from "@/components/admin/adminStyles";
import { LogoMark } from "@/components/brand/LogoMark";
import { requireAdminPage } from "@/lib/supabase/adminSession";
import { listArticleSummaries } from "@/repositories/adminArticleRepository";
import { getSiteBranding } from "@/services/brandingService";

export const metadata: Metadata = { title: "Beranda" };

export default async function AdminHomePage() {
  const session = await requireAdminPage();
  const [summaries, branding] = await Promise.all([listArticleSummaries(session.db), getSiteBranding()]);
  const publishedCount = summaries.filter((article) => article.status === "published").length;
  const draftCount = summaries.length - publishedCount;

  return (
    <>
      <h1 className={pageTitleClass}>Halo! Apa yang ingin kamu lakukan?</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section aria-labelledby="home-articles" className={cardClass}>
          <h2 id="home-articles" className={sectionHeadingClass}>
            Artikel
          </h2>
          <p className="mt-3 text-lg">
            <strong className="tabular-nums">{publishedCount}</strong> terbit dan <strong className="tabular-nums">{draftCount}</strong> draf
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link href="/admin/artikel/baru" className={primaryButtonClass}>
              Tulis artikel baru
            </Link>
            <Link href="/admin/artikel" className={tapLinkClass}>
              Lihat semua artikel
            </Link>
          </div>
        </section>

        <section aria-labelledby="home-logo" className={cardClass}>
          <h2 id="home-logo" className={sectionHeadingClass}>
            Logo
          </h2>
          <div className="mt-4 flex min-h-16 items-center">
            {branding.logoUrl ? (
              <Image
                src={branding.logoUrl}
                alt={branding.logoAlt || "Logo situs saat ini"}
                width={branding.logoWidth}
                height={branding.logoHeight}
                unoptimized
                className="h-14 w-auto max-w-full object-contain"
              />
            ) : (
              <div className="flex items-center gap-3">
                <LogoMark />
                <p className="text-base text-nila/80">Masih memakai logo bawaan.</p>
              </div>
            )}
          </div>
          <div className="mt-6">
            <Link href="/admin/logo" className={secondaryButtonClass}>
              Ganti logo
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
