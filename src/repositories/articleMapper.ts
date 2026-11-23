import type { Article, ArticleContent, ArticleStatus, ManagedArticle } from "@/domain/article";
import type { FaqItem } from "@/domain/faq";

export interface ArticleRow {
  id: string;
  slug: string;
  title: string;
  meta_title: string;
  meta_description: string;
  keyword: string;
  summary: string;
  lead: string;
  body: string;
  faq_heading: string;
  faqs: unknown;
  closing_heading: string;
  closing: string;
  image_url: string;
  image_alt: string;
  image_caption: string;
  image_width: number;
  image_height: number;
  author_id: string;
  related_slugs: string[] | null;
  status: string;
  published_on: string | null;
  updated_on: string;
  updated_at: string;
}

export const ARTICLE_COLUMNS =
  "id, slug, title, meta_title, meta_description, keyword, summary, lead, body, faq_heading, faqs, closing_heading, closing, image_url, image_alt, image_caption, image_width, image_height, author_id, related_slugs, status, published_on, updated_on, updated_at";

function parseFaqs(value: unknown): FaqItem[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    .map((item) => ({
      question: typeof item.question === "string" ? item.question : "",
      answer: typeof item.answer === "string" ? item.answer : "",
    }));
}

function rowToContent(row: ArticleRow): ArticleContent {
  return {
    slug: row.slug,
    title: row.title,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    keyword: row.keyword,
    summary: row.summary,
    lead: row.lead,
    body: row.body,
    faqHeading: row.faq_heading,
    faqs: parseFaqs(row.faqs),
    closingHeading: row.closing_heading,
    closing: row.closing,
    image: {
      src: row.image_url,
      alt: row.image_alt,
      caption: row.image_caption,
      width: row.image_width,
      height: row.image_height,
    },
    authorId: row.author_id,
    relatedSlugs: row.related_slugs ?? [],
  };
}

export function rowToArticle(row: ArticleRow): Article {
  return {
    ...rowToContent(row),
    publishedAt: row.published_on ?? row.updated_on,
    updatedAt: row.updated_on,
  };
}

export function rowToManagedArticle(row: ArticleRow): ManagedArticle {
  return {
    ...rowToContent(row),
    id: row.id,
    status: row.status === "published" ? "published" : "draft",
    publishedAt: row.published_on,
    updatedAt: row.updated_on,
    version: row.updated_at,
  };
}

// Kolom yang boleh ditulis oleh editor. Tanggal dan status diatur database dan Server Action.
export function contentToRow(content: ArticleContent): Record<string, unknown> {
  return {
    slug: content.slug,
    title: content.title,
    meta_title: content.metaTitle,
    meta_description: content.metaDescription,
    keyword: content.keyword,
    summary: content.summary,
    lead: content.lead,
    body: content.body,
    faq_heading: content.faqHeading,
    faqs: content.faqs,
    closing_heading: content.closingHeading,
    closing: content.closing,
    image_url: content.image.src,
    image_alt: content.image.alt,
    image_caption: content.image.caption,
    image_width: content.image.width,
    image_height: content.image.height,
    author_id: content.authorId,
    related_slugs: content.relatedSlugs,
  };
}

export function statusToRow(status: ArticleStatus): { status: ArticleStatus } {
  return { status };
}
