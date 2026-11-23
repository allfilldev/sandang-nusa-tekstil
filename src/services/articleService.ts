import type { Article } from "@/domain/article";
import { findPublishedArticle, listPublishedArticles } from "@/repositories/publicArticleRepository";

export async function getAllArticles(): Promise<Article[]> {
  return listPublishedArticles();
}

export async function getArticleSlugs(): Promise<string[]> {
  const articles = await listPublishedArticles();
  return articles.map((article) => article.slug);
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  return findPublishedArticle(slug);
}

export async function getRelatedArticles(article: Article): Promise<Article[]> {
  const articles = await listPublishedArticles();
  return article.relatedSlugs
    .map((slug) => articles.find((candidate) => candidate.slug === slug))
    .filter((related): related is Article => related !== undefined);
}
