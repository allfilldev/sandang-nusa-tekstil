import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/domain/article";
import { getArticleReadingMinutes } from "@/lib/articleReading";

type CardTitleTag = "h2" | "h3";

interface ArticleCardsProps {
  articles: Article[];
  titleAs?: CardTitleTag;
}

export function ArticleCards({ articles, titleAs = "h3" }: ArticleCardsProps) {
  const Title = titleAs;

  return (
    <ul className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:scroll-px-6 sm:px-6 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0">
      {articles.map((article) => (
        <li key={article.slug} className="w-[82%] shrink-0 snap-start md:w-auto">
          <article className="photo-card squircle relative flex h-full flex-col overflow-hidden rounded-card border border-nila/10 bg-benang">
            <div className="photo-zoom aspect-video overflow-hidden">
              <Image
                src={article.image.src}
                alt={article.image.alt}
                width={article.image.width}
                height={article.image.height}
                sizes="(min-width: 768px) 360px, 82vw"
                loading="lazy"
                className="size-full object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <Title className="font-display text-xl font-bold leading-snug">
                <Link href={`/artikel/${article.slug}`} className="after:absolute after:inset-0">
                  {article.title}
                </Link>
              </Title>
              <p className="mt-2 text-base text-nila/80">{article.summary}</p>
              <p className="mt-auto pt-4">
                <span className="rounded-full bg-nila-pudar px-3 py-1 font-display text-sm font-semibold">
                  {getArticleReadingMinutes(article)} menit baca
                </span>
              </p>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
