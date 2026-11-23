import type { Metadata } from "next";
import { ArticleCards } from "@/components/article/ArticleCards";
import { HeroTextileImage } from "@/components/home/HeroTextileImage";
import { WeaveRibbon } from "@/components/home/WeaveRibbon";
import { ProcessOverview } from "@/components/product/ProcessOverview";
import { ProductBento } from "@/components/product/ProductBento";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { homeContent } from "@/data/home";
import { processSteps } from "@/data/process";
import { productCategories } from "@/data/products";
import { buildPageMetadata } from "@/lib/metadata";
import { whatsAppUrl } from "@/lib/whatsapp";
import { getAllArticles } from "@/services/articleService";

export const metadata: Metadata = buildPageMetadata({
  title: homeContent.metaTitle,
  description: homeContent.metaDescription,
  path: "/",
});

const sectionHeadingClass =
  "heading-thread font-display text-[clamp(1.875rem,1.4rem+1.8vw,2.75rem)] font-bold leading-tight";

export default async function HomePage() {
  const articles = await getAllArticles();

  return (
    <>
      <section className="hero-curve relative z-10 bg-nila pb-16 pt-12 text-benang md:pt-20 lg:pb-20">
        <Container className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <h1 className="break-words font-display text-[clamp(2.25rem,1.4rem+3.6vw,4rem)] font-extrabold font-stretch-expanded leading-none tracking-tight">
              {homeContent.heading}
            </h1>
            <p className="mt-6 max-w-[48ch] text-xl leading-relaxed">{homeContent.lead}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink href="/produk" variant="accent">
                {homeContent.primaryAction}
              </ButtonLink>
              <ButtonLink href={whatsAppUrl} external variant="outlineLight">
                {homeContent.secondaryAction}
              </ButtonLink>
            </div>
          </div>
          <HeroTextileImage label={homeContent.heroLabel} caption={homeContent.heroCaption} />
        </Container>
      </section>

      <div className="relative z-20 -mt-7">
        <Container>
          <WeaveRibbon />
        </Container>
      </div>

      <section aria-labelledby="home-products" className="pb-14 pt-16 md:pb-20 md:pt-24">
        <Container>
          <h2 id="home-products" className={sectionHeadingClass}>
            {homeContent.productsHeading}
          </h2>
          <p className="mt-3 max-w-[60ch]">{homeContent.productsLead}</p>
          <div className="mt-10">
            <ProductBento categories={productCategories} />
          </div>
          <div className="mt-10">
            <ButtonLink href="/produk" variant="secondary">
              {homeContent.productsAction}
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section aria-labelledby="home-process" className="py-6 md:py-10">
        <Container>
          <div className="squircle rounded-panel bg-nila-pudar/45 p-6 md:p-12">
            <h2 id="home-process" className={sectionHeadingClass}>
              {homeContent.processHeading}
            </h2>
            <p className="mt-3 max-w-[60ch]">{homeContent.processLead}</p>
            <div className="mt-10">
              <ProcessOverview steps={processSteps} />
            </div>
            <div className="mt-10">
              <ButtonLink href="/proses-produksi">{homeContent.processAction}</ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <section aria-labelledby="home-articles" className="py-14 md:py-20">
        <Container>
          <h2 id="home-articles" className={sectionHeadingClass}>
            {homeContent.articlesHeading}
          </h2>
          <p className="mt-3 max-w-[60ch]">{homeContent.articlesLead}</p>
          <div className="mt-10">
            <ArticleCards articles={articles} titleAs="h3" />
          </div>
        </Container>
      </section>

      <section aria-labelledby="home-contact" className="pb-6">
        <Container>
          <div className="squircle grid items-center gap-6 rounded-panel bg-kunyit p-8 text-nila md:grid-cols-[1.5fr_auto] md:p-12">
            <div>
              <h2 id="home-contact" className="font-display text-3xl font-bold leading-tight md:text-4xl">
                {homeContent.contactHeading}
              </h2>
              <p className="mt-3 max-w-[56ch]">{homeContent.contactText}</p>
            </div>
            <ButtonLink href={whatsAppUrl} external variant="primary">
              {homeContent.contactAction}
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
