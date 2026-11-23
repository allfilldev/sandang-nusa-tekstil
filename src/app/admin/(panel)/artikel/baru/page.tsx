import type { Metadata } from "next";
import { ArticleEditor } from "@/components/admin/article/ArticleEditor";
import { requireAdminPage } from "@/lib/supabase/adminSession";
import { listArticleSummaries } from "@/repositories/adminArticleRepository";

export const metadata: Metadata = { title: "Tulis artikel baru" };

export default async function NewArticlePage() {
  const session = await requireAdminPage();
  const summaries = await listArticleSummaries(session.db);
  const relatedOptions = summaries
    .filter((article) => article.status === "published")
    .map((article) => ({ slug: article.slug, title: article.title }));

  return <ArticleEditor article={null} relatedOptions={relatedOptions} />;
}
