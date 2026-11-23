import { articles as staticArticles } from "@/data/articles";
import type { Article } from "@/domain/article";
import { createPublicSupabase } from "@/lib/supabase/public";
import { ARTICLE_COLUMNS, rowToArticle } from "@/repositories/articleMapper";
import type { ArticleRow } from "@/repositories/articleMapper";

// Sumber artikel untuk halaman publik: Supabase kalau sudah disambungkan, kalau belum memakai data statis.
export async function listPublishedArticles(): Promise<Article[]> {
  const supabase = createPublicSupabase();
  if (!supabase) {
    return [...staticArticles].sort((first, second) => second.publishedAt.localeCompare(first.publishedAt));
  }

  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_COLUMNS)
    .eq("status", "published")
    .order("published_on", { ascending: false })
    .order("created_at", { ascending: false })
    .overrideTypes<ArticleRow[], { merge: false }>();

  if (error) {
    throw new Error(`Gagal membaca artikel dari Supabase: ${error.message}`);
  }
  return data.map(rowToArticle);
}

export async function findPublishedArticle(slug: string): Promise<Article | undefined> {
  const supabase = createPublicSupabase();
  if (!supabase) {
    return staticArticles.find((article) => article.slug === slug);
  }

  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_COLUMNS)
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle<ArticleRow>();

  if (error) {
    throw new Error(`Gagal membaca artikel dari Supabase: ${error.message}`);
  }
  return data ? rowToArticle(data) : undefined;
}
