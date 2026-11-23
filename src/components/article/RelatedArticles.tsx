import { ArticleLedger } from "@/components/article/ArticleLedger";
import type { Article } from "@/domain/article";

interface RelatedArticlesProps {
  articles: Article[];
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section data-nosnippet="" aria-label="Artikel terkait" className="mt-14">
      <p className="mb-4 font-display text-2xl font-bold">Artikel terkait</p>
      <ArticleLedger articles={articles} titleAs="p" />
    </section>
  );
}
