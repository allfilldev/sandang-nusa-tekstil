import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import fabricRolls from "../../../../public/images/gulungan-kain.webp";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { ContentSheet } from "@/components/ui/ContentSheet";
import { authors } from "@/data/authors";
import { buildBreadcrumbJsonLd } from "@/lib/jsonLd";
import type { BreadcrumbItem } from "@/lib/jsonLd";
import { buildPageMetadata } from "@/lib/metadata";
import { whatsAppUrl } from "@/lib/whatsapp";

const pageTitle = "Profil Perusahaan Manufaktur Tekstil";
const linkClassName = "font-semibold text-nila underline decoration-nila/40 underline-offset-4 hover:decoration-nila";
const h2Class = "heading-thread mt-14 font-display text-[clamp(1.875rem,1.4rem+1.8vw,2.75rem)] font-bold leading-tight";

export const metadata: Metadata = buildPageMetadata({
  title: pageTitle,
  description:
    "Profil Sandang Nusa Tekstil, perusahaan manufaktur kain tenun, rajut, dan kain jadi, serta cara kami menulis panduan dan menerima permintaan sampel.",
  path: "/tentang",
});

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Beranda", path: "/" },
  { name: "Tentang", path: "/tentang" },
];

export default function AboutPage() {
  return (
    <Container className="py-8 md:py-12">
      <Breadcrumbs items={breadcrumbs} />
      <ContentSheet className="mt-6">
        <h1 className="break-words font-display text-[clamp(2rem,1.3rem+3.2vw,3.5rem)] font-extrabold font-stretch-expanded leading-none tracking-tight">
          {pageTitle}
        </h1>
        <p className="mt-6 max-w-[60ch] text-xl leading-relaxed">
          Sandang Nusa Tekstil adalah perusahaan manufaktur tekstil yang memproduksi kain tenun, kain rajut, dan kain
          jadi untuk konveksi dan merek fesyen.
        </p>
        <p className="mt-4 max-w-[68ch]">
          Tahun berdiri, lokasi pabrik, kapasitas produksi, dan sertifikasi tidak dicantumkan di situs ini. Informasi
          itu dikonfirmasi langsung lewat WhatsApp.
        </p>
        <figure className="mt-8">
          <Image
            src={fabricRolls}
            alt="Ilustrasi AI gulungan kain nila, putih gading, biru pudar, dan kunyit bertumpuk di rak penyimpanan"
            width={1200}
            height={675}
            sizes="(min-width: 1024px) 60rem, 100vw"
            className="squircle h-auto w-full rounded-photo"
          />
          <figcaption className="mt-3 text-base text-nila/80">
            Gulungan kain di rak penyimpanan, bukan dokumentasi pabrik perusahaan.
          </figcaption>
        </figure>

        <h2 className={h2Class}>Siapa yang menulis panduan di situs ini?</h2>
        <p className="mt-4 max-w-[68ch]">
          Semua artikel ditulis oleh tim berikut. Profil singkat yang sama tampil di kotak Tentang penulis pada setiap
          artikel.
        </p>
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          {authors.map((author) => (
            <div key={author.id} className="border-t-4 border-nila pt-4">
              <h3 className="font-display text-xl font-bold leading-snug">{author.name}</h3>
              <p className="text-base text-nila/80">{author.jobTitle}</p>
              <p className="mt-3 text-base">{author.bio}</p>
              {author.stats?.yearsOfExperience !== undefined ? (
                <p className="mt-3 text-base font-semibold">{author.stats.yearsOfExperience} tahun pengalaman</p>
              ) : null}
              {author.stats?.completedProjects !== undefined ? (
                <p className="text-base font-semibold">{author.stats.completedProjects} proyek selesai</p>
              ) : null}
              {author.profiles && author.profiles.length > 0 ? (
                <ul className="mt-3 space-y-1 text-base">
                  {author.profiles.map((profile) => (
                    <li key={profile}>
                      <a href={profile} target="_blank" rel="me noopener noreferrer" className={linkClassName}>
                        {profile}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>

        <h2 className={h2Class}>Bagaimana panduan di sini disusun?</h2>
        <ul className="mt-4 max-w-[68ch] list-disc space-y-2 pl-6 marker:text-nila">
          <li className="pl-1">Standar dan istilah teknis dirujuk ke sumber resmi yang ditautkan di dalam artikel.</li>
          <li className="pl-1">Setiap artikel menampilkan tanggal terbit dan tanggal diperbarui.</li>
          <li className="pl-1">Contoh perhitungan diberi keterangan, dan gambar di situs ini adalah ilustrasi buatan AI, bukan dokumentasi pabrik.</li>
        </ul>
        <p className="mt-4 max-w-[68ch]">
          Aturan lengkapnya ada di{" "}
          <Link href="/kebijakan-editorial" className={linkClassName}>
            kebijakan editorial
          </Link>
          .
        </p>

        <h2 className={h2Class}>Bagaimana cara bekerja sama?</h2>
        <p className="mt-4 max-w-[68ch]">
          Kirim pesan lewat WhatsApp untuk meminta sampel, spesifikasi, atau penawaran. Informasi lengkap ada di halaman{" "}
          <Link href="/kontak" className={linkClassName}>
            kontak
          </Link>
          .
        </p>
        <div className="mt-6">
          <ButtonLink href={whatsAppUrl} external>
            Hubungi via WhatsApp
          </ButtonLink>
        </div>
      </ContentSheet>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
    </Container>
  );
}
