import type { Metadata } from "next";
import { ArticleCards } from "@/components/article/ArticleCards";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { buildBreadcrumbJsonLd } from "@/lib/jsonLd";
import type { BreadcrumbItem } from "@/lib/jsonLd";
import { buildPageMetadata } from "@/lib/metadata";
import { getAllArticles } from "@/services/articleService";

const pageTitle = "Artikel Panduan Kain dan Tekstil";

export const metadata: Metadata = buildPageMetadata({
  title: pageTitle,
  description:
    "Kumpulan artikel panduan kain: beda kain tenun dan rajut, cara membaca GSM kain, dan cara memilih bahan untuk garmen dengan rujukan standar resmi.",
  path: "/artikel",
});

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Beranda", path: "/" },
  { name: "Artikel", path: "/artikel" },
];

export default async function ArticleListPage() {
  const articles = await getAllArticles();

  return (
    <Container className="py-8 md:py-12">
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="mt-8 break-words font-display text-[clamp(2rem,1.3rem+3.2vw,3.5rem)] font-extrabold font-stretch-expanded leading-none tracking-tight">
        {pageTitle}
      </h1>
      <p className="mt-5 max-w-[56ch] text-xl leading-relaxed">
        Tiap artikel menjawab satu pertanyaan dasar tentang kain dan merujuk ke standar atau sumber resmi.
      </p>
      <div className="mt-10">
        <ArticleCards articles={articles} titleAs="h2" />
      </div>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
    </Container>
  );
}
