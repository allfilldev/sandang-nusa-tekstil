import { siteConfig } from "@/data/site";
import type { ArticleContent } from "@/domain/article";
import { isValidSlug } from "@/lib/slug";
import { countReadableWords, countWords } from "@/lib/text";

// Aturan kualitas artikel. Angkanya sama dengan yang dicatat di structure.md ("Aturan konten yang dijaga kode").
// Dipakai di browser (panel Cek kualitas) dan di Server Action (syarat terbit), jadi harus tetap fungsi murni.

export type QualityLevel = "wajib" | "saran";

export interface QualityCheck {
  id: string;
  level: QualityLevel;
  ok: boolean;
  label: string;
  // Kalimat bantuan: apa yang sekarang dan apa yang perlu diubah.
  detail: string;
}

export interface QualityReport {
  checks: QualityCheck[];
  missingRequired: QualityCheck[];
  openSuggestions: QualityCheck[];
}

export const qualityRules = {
  bodyWords: { min: 800, max: 1200 },
  h2: { min: 3, max: 6 },
  h3: { max: 10 },
  leadWords: { min: 50, max: 100 },
  closingWords: { min: 50, max: 100 },
  faqs: { min: 3, max: 6 },
  internalLinks: { min: 2, max: 4 },
  externalLinks: { min: 1, max: 2 },
  metaDescription: { min: 140, max: 155 },
  // Judul tab dibatasi 60 karakter termasuk akhiran " | Nama Situs".
  metaTitleTotal: 60,
} as const;

export function getMetaTitleLimit(siteName: string = siteConfig.name): number {
  return qualityRules.metaTitleTotal - (siteName.length + 3);
}

function formatNumber(value: number): string {
  return value.toLocaleString("id-ID");
}

function rangeText(range: { min: number; max: number }): string {
  return `${formatNumber(range.min)} sampai ${formatNumber(range.max)}`;
}

function countHeadings(markdown: string): { h2: number; h3: number; deeper: number } {
  const withoutCode = markdown.replace(/```[\s\S]*?```/g, "");
  return {
    h2: (withoutCode.match(/^##[ \t]+\S/gm) ?? []).length,
    h3: (withoutCode.match(/^###[ \t]+\S/gm) ?? []).length,
    deeper: (withoutCode.match(/^#{4,6}[ \t]+\S/gm) ?? []).length,
  };
}

function collectLinkTargets(markdown: string): string[] {
  const targets: string[] = [];
  const pattern = /(?<!!)\[[^\]]*\]\(\s*([^)\s]+)[^)]*\)/g;
  for (const match of markdown.matchAll(pattern)) {
    targets.push(match[1]);
  }
  return targets;
}

function countLinks(content: ArticleContent): { internal: number; external: number } {
  const text = [content.body, content.closing, ...content.faqs.map((faq) => faq.answer)].join("\n");
  let internal = 0;
  let external = 0;
  for (const target of collectLinkTargets(text)) {
    if (target.startsWith("{{") || target.startsWith("#") || target.startsWith("mailto:") || target.startsWith("tel:")) {
      continue;
    }
    if (target.startsWith("/") || target.startsWith(siteConfig.url)) {
      internal += 1;
    } else if (/^https?:\/\//i.test(target)) {
      external += 1;
    }
  }
  return { internal, external };
}

function inRange(value: number, range: { min?: number; max: number }): boolean {
  return value <= range.max && (range.min === undefined || value >= range.min);
}

export function checkArticleQuality(content: ArticleContent): QualityReport {
  const metaTitleLimit = getMetaTitleLimit();
  // Panjang artikel dihitung dari semua bagian yang dibaca pengunjung: pembuka, isi, tanya jawab, dan penutup.
  const bodyWords = countReadableWords(
    [
      content.lead,
      content.body,
      content.faqHeading,
      ...content.faqs.flatMap((faq) => [faq.question, faq.answer]),
      content.closingHeading,
      content.closing,
    ].join(" "),
  );
  const leadWords = countWords(content.lead);
  const closingWords = countWords(content.closing);
  const headings = countHeadings(content.body);
  const links = countLinks(content);
  const faqPairs = content.faqs.filter((faq) => faq.question.trim() && faq.answer.trim());
  const partialFaqs = content.faqs.filter((faq) => Boolean(faq.question.trim()) !== Boolean(faq.answer.trim()));
  const metaTitleLength = content.metaTitle.trim().length;
  const metaDescriptionLength = content.metaDescription.trim().length;

  const checks: QualityCheck[] = [
    {
      id: "title",
      level: "wajib",
      ok: content.title.trim().length > 0,
      label: "Judul artikel terisi",
      detail: content.title.trim() ? "Judul sudah ada." : "Isi judul artikel di bagian 1.",
    },
    {
      id: "slug",
      level: "wajib",
      ok: isValidSlug(content.slug),
      label: "Alamat artikel benar",
      detail: isValidSlug(content.slug)
        ? `Alamatnya /artikel/${content.slug}.`
        : "Alamat hanya boleh huruf kecil, angka, dan tanda hubung, misalnya cara-memilih-kain.",
    },
    {
      id: "body",
      level: "wajib",
      ok: content.body.trim().length > 0,
      label: "Isi artikel terisi",
      detail: content.body.trim() ? "Isi artikel sudah ada." : "Tulis isi artikel di bagian 3.",
    },
    {
      id: "image",
      level: "wajib",
      ok: Boolean(content.image.src && content.image.alt.trim()),
      label: "Gambar utama dan teks penggantinya terisi",
      detail:
        content.image.src && content.image.alt.trim()
          ? "Gambar utama sudah lengkap."
          : "Unggah gambar utama dan isi teks pengganti (deskripsi singkat gambar) di bagian 2.",
    },
    {
      id: "metaTitle",
      level: "wajib",
      ok: metaTitleLength > 0,
      label: "Judul di Google terisi",
      detail: metaTitleLength > 0 ? "Judul di Google sudah ada." : "Isi judul di Google di bagian 5.",
    },
    {
      id: "metaDescription",
      level: "wajib",
      ok: metaDescriptionLength > 0,
      label: "Deskripsi di Google terisi",
      detail: metaDescriptionLength > 0 ? "Deskripsi sudah ada." : "Isi deskripsi di Google di bagian 5.",
    },
    {
      id: "faqComplete",
      level: "wajib",
      ok: partialFaqs.length === 0,
      label: "Setiap tanya jawab terisi lengkap",
      detail:
        partialFaqs.length === 0
          ? "Tidak ada tanya jawab yang setengah terisi."
          : `${partialFaqs.length} tanya jawab hanya terisi sebagian. Lengkapi atau hapus di bagian 4.`,
    },
    {
      id: "bodyWords",
      level: "saran",
      ok: inRange(bodyWords, qualityRules.bodyWords),
      label: `Panjang artikel ${rangeText(qualityRules.bodyWords)} kata`,
      detail: `Sekarang ${formatNumber(bodyWords)} kata (pembuka, isi, tanya jawab, dan penutup).${
        bodyWords < qualityRules.bodyWords.min ? " Tambah penjelasan atau contoh." : bodyWords > qualityRules.bodyWords.max ? " Pertimbangkan dipersingkat atau dipecah jadi dua artikel." : ""
      }`,
    },
    {
      id: "h2",
      level: "saran",
      ok: inRange(headings.h2, qualityRules.h2),
      label: `${rangeText(qualityRules.h2)} judul bagian (H2)`,
      detail: `Sekarang ${headings.h2}. Judul bagian dibuat dengan tombol H2 di isi artikel.`,
    },
    {
      id: "h3",
      level: "saran",
      ok: headings.h3 <= qualityRules.h3.max,
      label: `Anak judul (H3) maksimal ${qualityRules.h3.max}`,
      detail: `Sekarang ${headings.h3}.`,
    },
    {
      id: "deeper",
      level: "saran",
      ok: headings.deeper === 0,
      label: "Tanpa judul lebih kecil dari H3",
      detail: headings.deeper === 0 ? "Tidak ada." : `Ada ${headings.deeper} judul H4 sampai H6. Pakai H2 atau H3 saja.`,
    },
    {
      id: "leadWords",
      level: "saran",
      ok: inRange(leadWords, qualityRules.leadWords),
      label: `Paragraf pembuka ${rangeText(qualityRules.leadWords)} kata`,
      detail: `Sekarang ${leadWords} kata.`,
    },
    {
      id: "closingWords",
      level: "saran",
      ok: inRange(closingWords, qualityRules.closingWords),
      label: `Paragraf penutup ${rangeText(qualityRules.closingWords)} kata`,
      detail: `Sekarang ${closingWords} kata.`,
    },
    {
      id: "faqCount",
      level: "saran",
      ok: inRange(faqPairs.length, qualityRules.faqs),
      label: `${rangeText(qualityRules.faqs)} tanya jawab`,
      detail: `Sekarang ${faqPairs.length}.`,
    },
    {
      id: "internalLinks",
      level: "saran",
      ok: inRange(links.internal, qualityRules.internalLinks),
      label: `${rangeText(qualityRules.internalLinks)} tautan ke halaman lain di situs ini`,
      detail: `Sekarang ${links.internal}. Contoh tautan: [kain tenun](/artikel/kain-tenun-rajut).`,
    },
    {
      id: "externalLinks",
      level: "saran",
      ok: inRange(links.external, qualityRules.externalLinks),
      label: `${rangeText(qualityRules.externalLinks)} tautan keluar ke sumber resmi`,
      detail: `Sekarang ${links.external}. Pakai sumber resmi, misalnya situs standar atau lembaga.`,
    },
    {
      id: "metaTitleLength",
      level: "saran",
      ok: metaTitleLength > 0 && metaTitleLength <= metaTitleLimit,
      label: `Judul di Google maksimal ${metaTitleLimit} karakter`,
      detail: `Sekarang ${metaTitleLength}. Nama situs ditambahkan otomatis di belakangnya.`,
    },
    {
      id: "metaDescriptionLength",
      level: "saran",
      ok: metaDescriptionLength === 0 ? false : inRange(metaDescriptionLength, qualityRules.metaDescription),
      label: `Deskripsi di Google ${rangeText(qualityRules.metaDescription)} karakter`,
      detail: `Sekarang ${metaDescriptionLength}.`,
    },
  ];

  return {
    checks,
    missingRequired: checks.filter((check) => check.level === "wajib" && !check.ok),
    openSuggestions: checks.filter((check) => check.level === "saran" && !check.ok),
  };
}
