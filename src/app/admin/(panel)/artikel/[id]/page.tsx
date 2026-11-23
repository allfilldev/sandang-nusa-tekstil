import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleEditor } from "@/components/admin/article/ArticleEditor";
import { requireAdminPage } from "@/lib/supabase/adminSession";
import { findManagedArticle, listArticleSummaries } from "@/repositories/adminArticleRepository";

export const metadata: Metadata = { title: "Ubah artikel" };

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ hasil?: string }>;
}

export default async function EditArticlePage({ params, searchParams }: EditArticlePageProps) {
  const [{ id }, { hasil }, session] = await Promise.all([params, searchParams, requireAdminPage()]);
  const [article, summaries] = await Promise.all([findManagedArticle(session.db, id), listArticleSummaries(session.db)]);
  if (!article) {
    notFound();
  }

  const relatedOptions = summaries
    .filter((item) => item.status === "published" && item.id !== article.id)
    .map((item) => ({ slug: item.slug, title: item.title }));
  const notice = hasil === "terbit" ? "terbit" : hasil === "draf" ? "draf" : undefined;

  return <ArticleEditor article={article} relatedOptions={relatedOptions} notice={notice} />;
}
