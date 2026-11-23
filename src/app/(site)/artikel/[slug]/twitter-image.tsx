import { renderOgImage } from "@/components/og/renderOgImage";
import { getArticleBySlug, getArticleSlugs } from "@/services/articleService";

export const alt = "Sampul artikel panduan dari Sandang Nusa Tekstil";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  return renderOgImage({
    title: article?.title ?? "Panduan Kain dan Tekstil",
    subtitle: "Ditulis oleh Tim Sandang Nusa Tekstil",
  });
}
