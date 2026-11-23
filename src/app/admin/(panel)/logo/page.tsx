import type { Metadata } from "next";
import { LogoManager } from "@/components/admin/logo/LogoManager";
import { pageTitleClass } from "@/components/admin/adminStyles";
import { siteConfig } from "@/data/site";
import { requireAdminPage } from "@/lib/supabase/adminSession";
import { readBrandingForAdmin } from "@/repositories/adminBrandingRepository";

export const metadata: Metadata = { title: "Logo" };

interface LogoPageProps {
  searchParams: Promise<{ hasil?: string }>;
}

export default async function AdminLogoPage({ searchParams }: LogoPageProps) {
  const [{ hasil }, session] = await Promise.all([searchParams, requireAdminPage()]);
  const branding = await readBrandingForAdmin(session.db);

  return (
    <>
      <h1 className={pageTitleClass}>Logo situs</h1>
      {hasil === "direset" || hasil === "tersimpan" ? (
        <p role="status" className="mt-6 rounded-2xl bg-berhasil/10 p-4 font-bold text-berhasil">
          {hasil === "direset" ? "Logo dikembalikan ke bawaan." : "Logo tersimpan dan sudah tampil di situs."}
        </p>
      ) : null}
      <div className="mt-8">
        {/* key memuat ulang state form kalau logo berubah, supaya pilihan lama tidak menempel */}
        <LogoManager key={branding.version} branding={branding} siteName={siteConfig.name} />
      </div>
    </>
  );
}
