import Link from "next/link";
import type { Article } from "@/domain/article";
import type { Author } from "@/domain/author";
import { formatDate } from "@/lib/date";
import { getArticleReadingMinutes } from "@/lib/articleReading";

interface ArticleHeaderProps {
  article: Article;
  author: Author;
}

export function ArticleHeader({ article, author }: ArticleHeaderProps) {
  return (
    <header>
      <h1 className="font-display text-[clamp(2rem,1.4rem+3vw,3.25rem)] font-extrabold leading-[1.08] tracking-tight">
        {article.title}
      </h1>
      <p className="mt-5 text-base">
        Ditulis oleh{" "}
        <Link href="/tentang" rel="author" className="font-semibold underline decoration-nila/40 underline-offset-4 hover:decoration-nila">
          {author.name}
        </Link>
      </p>
      <dl className="mt-3 flex flex-wrap gap-x-8 gap-y-1 text-base">
        <div className="flex gap-2">
          <dt className="text-nila/70">Terbit</dt>
          <dd>
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-nila/70">Diperbarui</dt>
          <dd>
            <time dateTime={article.updatedAt}>{formatDate(article.updatedAt)}</time>
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-nila/70">Waktu baca</dt>
          <dd>{getArticleReadingMinutes(article)} menit</dd>
        </div>
      </dl>
      <p className="mt-6 text-xl font-medium leading-relaxed">{article.lead}</p>
    </header>
  );
}
