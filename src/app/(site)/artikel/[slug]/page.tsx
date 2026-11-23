import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/article/ArticleView";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildArticleJsonLd, buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/lib/jsonLd";
import type { BreadcrumbItem } from "@/lib/jsonLd";
import { buildArticleMetadata } from "@/lib/metadata";
import { getArticleBySlug, getArticleSlugs, getRelatedArticles } from "@/services/articleService";
import { getAuthorById } from "@/services/authorService";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

// Artikel yang baru diterbitkan lewat CMS dirender saat pertama dibuka, lalu di-cache.
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) {
    return {};
  }
  return buildArticleMetadata(article, getAuthorById(article.authorId).name);
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) {
    notFound();
  }

  const author = getAuthorById(article.authorId);
  const relatedArticles = await getRelatedArticles(article);
  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Beranda", path: "/" },
    { name: "Artikel", path: "/artikel" },
    { name: article.title, path: `/artikel/${article.slug}` },
  ];

  return (
    <ArticleView article={article} author={author} relatedArticles={relatedArticles} breadcrumbs={breadcrumbs}>
      <JsonLd
        data={[buildBreadcrumbJsonLd(breadcrumbs), buildArticleJsonLd(article, author), buildFaqJsonLd(article.faqs)]}
      />
    </ArticleView>
  );
}
