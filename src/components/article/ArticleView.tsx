import type { ReactNode } from "react";
import { ArticleFigure } from "@/components/article/ArticleFigure";
import { ArticleHeader } from "@/components/article/ArticleHeader";
import { ArticleMarkdown } from "@/components/article/ArticleMarkdown";
import { AuthorBox } from "@/components/article/AuthorBox";
import { RelatedArticles } from "@/components/article/RelatedArticles";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { FaqSection } from "@/components/ui/FaqSection";
import type { Article } from "@/domain/article";
import type { Author } from "@/domain/author";
import type { BreadcrumbItem } from "@/lib/jsonLd";

interface ArticleViewProps {
  article: Article;
  author: Author;
  relatedArticles: Article[];
  breadcrumbs: BreadcrumbItem[];
  // Dipakai halaman publik untuk menaruh JSON-LD. Pratinjau admin tidak mengisinya.
  children?: ReactNode;
}

// Tampilan halaman artikel, dipakai bersama oleh halaman publik dan pratinjau admin,
// supaya yang terlihat di pratinjau sama dengan yang akan terbit.
export function ArticleView({ article, author, relatedArticles, breadcrumbs, children }: ArticleViewProps) {
  return (
    <Container className="py-8 md:py-12">
      <Breadcrumbs items={breadcrumbs} />
      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <article className="min-w-0 border border-nila/15 bg-benang px-5 py-8 md:px-10 md:py-12">
          <ArticleHeader article={article} author={author} />
          {article.image.src ? <ArticleFigure image={article.image} /> : null}
          <ArticleMarkdown content={article.body} />
          <FaqSection heading={article.faqHeading} faqs={article.faqs} />
          <section className="mt-12">
            <h2 className="font-display text-3xl font-bold leading-tight">{article.closingHeading}</h2>
            <ArticleMarkdown content={article.closing} />
          </section>
        </article>
        <div className="lg:sticky lg:top-6">
          <AuthorBox author={author} />
        </div>
      </div>
      <RelatedArticles articles={relatedArticles} />
      {children}
    </Container>
  );
}
