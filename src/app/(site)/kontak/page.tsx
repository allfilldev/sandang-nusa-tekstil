import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { ContentSheet } from "@/components/ui/ContentSheet";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { siteConfig } from "@/data/site";
import { buildBreadcrumbJsonLd } from "@/lib/jsonLd";
import type { BreadcrumbItem } from "@/lib/jsonLd";
import { buildPageMetadata } from "@/lib/metadata";

const pageTitle = "Kontak dan Permintaan Sampel Kain";
const linkClassName = "font-semibold text-nila underline decoration-nila/40 underline-offset-4 hover:decoration-nila";
const h2Class = "heading-thread mt-14 font-display text-[clamp(1.875rem,1.4rem+1.8vw,2.75rem)] font-bold leading-tight";

const firstMessageItems = [
  "Pemakaian akhir kain, misalnya kemeja, kaus, atau seragam.",
  "Jenis kain yang dicari: tenun, rajut, atau kain jadi.",
  "Perkiraan jumlah kebutuhan.",
  "Struktur, komposisi, gramasi, atau warna yang kamu inginkan, kalau sudah ada.",
];

export const metadata: Metadata = buildPageMetadata({
  title: pageTitle,
  description:
    "Hubungi Sandang Nusa Tekstil lewat WhatsApp untuk meminta sampel, spesifikasi, atau penawaran kain tenun, kain rajut, dan kain jadi untuk produksi garmen.",
  path: "/kontak",
});

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Beranda", path: "/" },
  { name: "Kontak", path: "/kontak" },
];

export default function ContactPage() {
  return (
    <Container className="py-8 md:py-12">
      <Breadcrumbs items={breadcrumbs} />
      <ContentSheet className="mt-6">
        <h1 className="break-words font-display text-[clamp(2rem,1.3rem+3.2vw,3.5rem)] font-extrabold font-stretch-expanded leading-none tracking-tight">
          {pageTitle}
        </h1>
        <p className="mt-6 max-w-[60ch] text-xl leading-relaxed">
          Cara tercepat menghubungi Sandang Nusa Tekstil adalah lewat WhatsApp. Sebutkan kebutuhan kainmu, lalu tim kami
          menjawab soal sampel, spesifikasi, dan penawaran.
        </p>
        <div className="squircle mt-8 rounded-panel bg-nila p-6 text-benang md:p-8">
          <p className="text-base text-benang/85">Nomor WhatsApp</p>
          <p className="mt-1 font-display text-3xl font-extrabold tabular-nums">{siteConfig.whatsapp.displayNumber}</p>
          <div className="mt-5">
            <WhatsAppButton compact />
          </div>
        </div>

        <h2 className={h2Class}>Apa yang sebaiknya ditulis di pesan pertama?</h2>
        <ul className="mt-4 max-w-[68ch] list-disc space-y-2 pl-6 marker:text-nila">
          {firstMessageItems.map((item) => (
            <li key={item} className="pl-1">
              {item}
            </li>
          ))}
        </ul>

        <h2 className={h2Class}>Ada koreksi untuk artikel kami?</h2>
        <p className="mt-4 max-w-[68ch]">
          Kirim lewat WhatsApp yang sama. Cara kami memeriksa dan memperbarui artikel dijelaskan di{" "}
          <Link href="/kebijakan-editorial" className={linkClassName}>
            kebijakan editorial
          </Link>
          .
        </p>
      </ContentSheet>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
    </Container>
  );
}
