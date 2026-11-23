import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/article/ArticleView";
import type { Article } from "@/domain/article";
import type { BreadcrumbItem } from "@/lib/jsonLd";
import { requireAdminPage } from "@/lib/supabase/adminSession";
import { findManagedArticle } from "@/repositories/adminArticleRepository";
import { getAuthorById } from "@/services/authorService";
import { getAllArticles } from "@/services/articleService";

export const metadata: Metadata = { title: "Pratinjau artikel", robots: { index: false, follow: false } };

interface PreviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function ArticlePreviewPage({ params }: PreviewPageProps) {
  const { id } = await params;
  const session = await requireAdminPage();
  const managed = await findManagedArticle(session.db, id);
  if (!managed) {
    notFound();
  }

  const today = new Date().toISOString().slice(0, 10);
  const article: Article = {
    ...managed,
    title: managed.title || "Judul artikel",
    publishedAt: managed.publishedAt ?? today,
    updatedAt: managed.updatedAt,
  };
  const published = await getAllArticles();
  const relatedArticles = published.filter((item) => article.relatedSlugs.includes(item.slug));
  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Beranda", path: "/" },
    { name: "Artikel", path: "/artikel" },
    { name: article.title, path: `/artikel/${article.slug}` },
  ];

  return (
    <>
      <div className="sticky top-0 z-40 border-b-2 border-kunyit bg-kunyit px-4 py-3 text-center font-display text-base font-bold text-nila">
        Pratinjau: {managed.status === "published" ? "artikel ini sudah terbit." : "artikel ini belum terbit."}{" "}
        <Link href={`/admin/artikel/${managed.id}`} className="underline underline-offset-4">
          Kembali ke editor
        </Link>
      </div>
      <ArticleView
        article={article}
        author={getAuthorById(article.authorId)}
        relatedArticles={relatedArticles}
        breadcrumbs={breadcrumbs}
      />
    </>
  );
}
