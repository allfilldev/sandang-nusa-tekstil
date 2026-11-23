import type { FaqItem } from "@/domain/faq";

export interface ArticleImage {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}

// Bagian artikel yang ditulis dan diubah lewat editor.
export interface ArticleContent {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keyword: string;
  summary: string;
  lead: string;
  body: string;
  faqHeading: string;
  faqs: FaqItem[];
  closingHeading: string;
  closing: string;
  image: ArticleImage;
  authorId: string;
  relatedSlugs: string[];
}

// Artikel terbit seperti yang dilihat pengunjung. Tanggal berformat YYYY-MM-DD.
export interface Article extends ArticleContent {
  publishedAt: string;
  updatedAt: string;
}

export type ArticleStatus = "draft" | "published";

// Baris ringkas untuk daftar artikel di panel admin.
export interface ManagedArticleSummary {
  id: string;
  slug: string;
  title: string;
  status: ArticleStatus;
  publishedAt: string | null;
  updatedAt: string;
}

// Artikel di panel admin: bisa masih draf dan belum lengkap.
export interface ManagedArticle extends ArticleContent {
  id: string;
  status: ArticleStatus;
  publishedAt: string | null;
  updatedAt: string;
  // Cap waktu penuh dari database, dipakai untuk mendeteksi artikel yang diubah di tempat lain.
  version: string;
}
