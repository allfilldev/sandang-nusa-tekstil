import type { ArticleContent } from "@/domain/article";
import type { FaqItem } from "@/domain/faq";

// Membaca isian form editor artikel menjadi ArticleContent. Dipakai di browser (cek kualitas langsung)
// dan di Server Action (data yang disimpan), jadi hasil keduanya selalu sama.

export type ArticleIntent = "save" | "publish" | "unpublish";

export interface ArticleFormInput {
  id: string | null;
  version: string;
  intent: ArticleIntent;
  content: ArticleContent;
}

export const defaultAuthorId = "tim-sandang-nusa";
export const defaultImageSize = { width: 1200, height: 675 };

const limits = {
  title: 200,
  slug: 100,
  metaTitle: 120,
  metaDescription: 300,
  keyword: 120,
  summary: 300,
  lead: 2000,
  body: 60000,
  heading: 200,
  closing: 2000,
  imageUrl: 600,
  imageText: 300,
  faqQuestion: 300,
  faqAnswer: 3000,
  faqCount: 12,
  related: 12,
} as const;

function readRaw(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function singleLine(formData: FormData, name: string, max: number): string {
  return readRaw(formData, name).replace(/\s+/g, " ").trim().slice(0, max);
}

function multiLine(formData: FormData, name: string, max: number): string {
  return readRaw(formData, name).replace(/\r\n?/g, "\n").trim().slice(0, max);
}

function readPositiveInteger(formData: FormData, name: string, fallback: number): number {
  const parsed = Number.parseInt(readRaw(formData, name), 10);
  return Number.isFinite(parsed) && parsed > 0 && parsed <= 10000 ? parsed : fallback;
}

function readFaqs(formData: FormData): FaqItem[] {
  const questions = formData.getAll("faqQuestion");
  const answers = formData.getAll("faqAnswer");
  const faqs: FaqItem[] = [];
  for (let index = 0; index < Math.min(questions.length, limits.faqCount); index += 1) {
    const question = typeof questions[index] === "string" ? (questions[index] as string) : "";
    const answer = typeof answers[index] === "string" ? (answers[index] as string) : "";
    const item = {
      question: question.replace(/\s+/g, " ").trim().slice(0, limits.faqQuestion),
      answer: answer.replace(/\r\n?/g, "\n").trim().slice(0, limits.faqAnswer),
    };
    if (item.question || item.answer) {
      faqs.push(item);
    }
  }
  return faqs;
}

export function parseArticleForm(formData: FormData): ArticleFormInput {
  const rawIntent = readRaw(formData, "intent");
  const intent: ArticleIntent = rawIntent === "publish" || rawIntent === "unpublish" ? rawIntent : "save";
  const id = readRaw(formData, "id").trim();

  const related = formData
    .getAll("relatedSlugs")
    .filter((value): value is string => typeof value === "string" && value.length > 0)
    .slice(0, limits.related);

  return {
    id: id || null,
    version: readRaw(formData, "version"),
    intent,
    content: {
      slug: singleLine(formData, "slug", limits.slug),
      title: singleLine(formData, "title", limits.title),
      metaTitle: singleLine(formData, "metaTitle", limits.metaTitle),
      metaDescription: singleLine(formData, "metaDescription", limits.metaDescription),
      keyword: singleLine(formData, "keyword", limits.keyword),
      summary: singleLine(formData, "summary", limits.summary),
      lead: multiLine(formData, "lead", limits.lead),
      body: multiLine(formData, "body", limits.body),
      faqHeading: singleLine(formData, "faqHeading", limits.heading),
      faqs: readFaqs(formData),
      closingHeading: singleLine(formData, "closingHeading", limits.heading),
      closing: multiLine(formData, "closing", limits.closing),
      image: {
        src: singleLine(formData, "imageUrl", limits.imageUrl),
        alt: singleLine(formData, "imageAlt", limits.imageText),
        caption: singleLine(formData, "imageCaption", limits.imageText),
        width: readPositiveInteger(formData, "imageWidth", defaultImageSize.width),
        height: readPositiveInteger(formData, "imageHeight", defaultImageSize.height),
      },
      authorId: singleLine(formData, "authorId", 60) || defaultAuthorId,
      relatedSlugs: related,
    },
  };
}
