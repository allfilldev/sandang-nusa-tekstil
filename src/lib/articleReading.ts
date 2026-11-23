import type { ArticleContent } from "@/domain/article";
import { estimateReadingMinutes } from "@/lib/text";

export function getArticleReadingMinutes(article: ArticleContent): number {
  const fullText = [
    article.lead,
    article.body,
    ...article.faqs.flatMap((faq) => [faq.question, faq.answer]),
    article.closing,
  ].join(" ");
  return estimateReadingMinutes(fullText);
}
