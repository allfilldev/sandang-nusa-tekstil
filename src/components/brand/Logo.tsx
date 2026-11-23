import Image from "next/image";
import Link from "next/link";
import { LogoMark } from "@/components/brand/LogoMark";
import { siteConfig } from "@/data/site";
import { getSiteBranding } from "@/services/brandingService";

interface LogoProps {
  tone?: "dark" | "light";
}

// Logo situs. Memakai logo yang diunggah lewat panel admin; kalau belum ada, memakai lambang tenunan bawaan.
// Di latar gelap (footer), logo unggahan ditaruh di kapsul putih supaya logo apa pun tetap terbaca.
export async function Logo({ tone = "dark" }: LogoProps) {
  const branding = await getSiteBranding();
  const textClass = tone === "light" ? "text-benang" : "text-nila";
  const hasUploadedLogo = Boolean(branding.logoUrl);
  const showName = !hasUploadedLogo || branding.showBrandName;

  return (
    <Link href="/" className="inline-flex items-center gap-3 py-1">
      {branding.logoUrl ? (
        <span className={tone === "light" ? "inline-flex rounded-2xl bg-benang p-2" : "inline-flex"}>
          <Image
            src={branding.logoUrl}
            alt={showName ? "" : branding.logoAlt || siteConfig.name}
            width={branding.logoWidth}
            height={branding.logoHeight}
            unoptimized
            priority
            className="h-10 w-auto max-w-[12rem] object-contain"
          />
        </span>
      ) : (
        <LogoMark tone={tone} />
      )}
      {showName ? (
        <span className={`font-display text-lg font-extrabold leading-tight ${textClass}`}>{siteConfig.name}</span>
      ) : null}
      <span className="sr-only">, kembali ke beranda</span>
    </Link>
  );
}
