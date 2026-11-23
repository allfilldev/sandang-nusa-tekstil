import { siteConfig } from "@/data/site";

interface SerpPreviewProps {
  metaTitle: string;
  metaDescription: string;
  slug: string;
}

// Perkiraan tampilan artikel di hasil pencarian Google. Hanya gambaran: Google bisa menulis ulang judul dan deskripsi.
export function SerpPreview({ metaTitle, metaDescription, slug }: SerpPreviewProps) {
  const title = `${metaTitle.trim() || "Judul artikel"} | ${siteConfig.name}`;
  const host = siteConfig.url.replace(/^https?:\/\//, "");

  return (
    <div className="rounded-2xl border border-nila/15 bg-kapas p-4" aria-label="Contoh tampilan di Google" role="group">
      <p className="text-sm text-nila/70">Contoh tampilan di Google</p>
      <p className="mt-2 break-all text-sm text-nila/80">
        {host} &rsaquo; artikel &rsaquo; {slug || "alamat-artikel"}
      </p>
      <p className="mt-1 break-words font-display text-xl font-bold leading-snug text-[#1a0dab]">{title}</p>
      <p className="mt-1 break-words text-[0.9375rem] leading-snug text-nila/85">
        {metaDescription.trim() || "Deskripsi artikel akan tampil di sini."}
      </p>
    </div>
  );
}
