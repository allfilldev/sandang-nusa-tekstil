import Link from "next/link";
import type { Article } from "@/domain/article";
import { getArticleReadingMinutes } from "@/lib/articleReading";

type LedgerTitleTag = "h2" | "h3" | "p";

interface ArticleLedgerProps {
  articles: Article[];
  titleAs?: LedgerTitleTag;
}

export function ArticleLedger({ articles, titleAs = "h3" }: ArticleLedgerProps) {
  const Title = titleAs;

  return (
    <ul className="border-b border-dashed border-nila/30">
      {articles.map((article) => (
        <li key={article.slug} className="relative border-t border-dashed border-nila/30 py-6">
          <div className="grid gap-2 md:grid-cols-[1fr_auto] md:items-baseline md:gap-8">
            <div>
              <Title className="font-display text-2xl font-bold leading-snug">
                <Link
                  href={`/artikel/${article.slug}`}
                  className="underline-offset-4 decoration-nila decoration-2 after:absolute after:inset-0 hover:underline"
                >
                  {article.title}
                </Link>
              </Title>
              <p className="mt-1 max-w-[60ch] text-base text-nila/80">{article.summary}</p>
            </div>
            <p className="text-base font-semibold text-nila">{getArticleReadingMinutes(article)} menit baca</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
