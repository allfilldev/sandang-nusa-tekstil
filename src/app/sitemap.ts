import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";
import { toDate } from "@/lib/date";
import { absoluteUrl } from "@/lib/url";
import { getAllArticles } from "@/services/articleService";
import { getLegalDocuments } from "@/services/legalService";

const staticPaths = ["/", "/produk", "/proses-produksi", "/artikel", "/tentang", "/kontak"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getAllArticles();
  const siteLastModified = toDate(siteConfig.lastUpdated);

  const staticPages = staticPaths.map((path) => ({
    url: absoluteUrl(path),
    lastModified: siteLastModified,
  }));

  const articlePages = articles.map((article) => ({
    url: absoluteUrl(`/artikel/${article.slug}`),
    lastModified: toDate(article.updatedAt),
  }));

  const legalPages = getLegalDocuments().map((legalDocument) => ({
    url: absoluteUrl(legalDocument.path),
    lastModified: toDate(legalDocument.updatedAt),
  }));

  return [...staticPages, ...articlePages, ...legalPages];
}
