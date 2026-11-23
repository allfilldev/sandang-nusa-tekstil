import type { Metadata } from "next";
import { siteConfig } from "@/data/site";
import type { Article } from "@/domain/article";
import { toDate } from "@/lib/date";
import { absoluteUrl } from "@/lib/url";

const feedAlternate = { "application/rss+xml": absoluteUrl("/feed.xml") };

interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
}

export function buildPageMetadata({ title, description, path }: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = `${title} | ${siteConfig.name}`;

  return {
    title,
    description,
    alternates: { canonical: url, types: feedAlternate },
    openGraph: {
      type: "website",
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

export function buildArticleMetadata(article: Article, authorName: string): Metadata {
  const url = absoluteUrl(`/artikel/${article.slug}`);
  const fullTitle = `${article.metaTitle} | ${siteConfig.name}`;

  return {
    title: article.metaTitle,
    description: article.metaDescription,
    alternates: { canonical: url, types: feedAlternate },
    authors: [{ name: authorName, url: absoluteUrl("/tentang") }],
    openGraph: {
      type: "article",
      title: fullTitle,
      description: article.metaDescription,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      publishedTime: toDate(article.publishedAt).toISOString(),
      modifiedTime: toDate(article.updatedAt).toISOString(),
      authors: [authorName],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: article.metaDescription,
    },
  };
}
