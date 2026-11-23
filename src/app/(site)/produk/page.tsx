import type { Metadata } from "next";
import { ProductSwatches } from "@/components/product/ProductSwatches";
import { StructureTable } from "@/components/product/StructureTable";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { ContentSheet } from "@/components/ui/ContentSheet";
import { FaqSection } from "@/components/ui/FaqSection";
import { fabricStructures, productCategories, productFaqs, productPage } from "@/data/products";
import { buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/lib/jsonLd";
import type { BreadcrumbItem } from "@/lib/jsonLd";
import { buildPageMetadata } from "@/lib/metadata";
import { whatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = buildPageMetadata({
  title: productPage.heading,
  description: productPage.metaDescription,
  path: "/produk",
});

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Beranda", path: "/" },
  { name: "Produk", path: "/produk" },
];

const h2Class = "heading-thread mt-14 font-display text-[clamp(1.875rem,1.4rem+1.8vw,2.75rem)] font-bold leading-tight";

export default function ProductPage() {
  return (
    <Container className="py-8 md:py-12">
      <Breadcrumbs items={breadcrumbs} />
      <ContentSheet className="mt-6">
        <h1 className="break-words font-display text-[clamp(2rem,1.3rem+3.2vw,3.5rem)] font-extrabold font-stretch-expanded leading-none tracking-tight">
          {productPage.heading}
        </h1>
        <p className="mt-6 max-w-[60ch] text-xl leading-relaxed">{productPage.lead}</p>

        <h2 className={h2Class}>{productPage.categoriesHeading}</h2>
        <div className="mt-8">
          <ProductSwatches categories={productCategories} withDetails />
        </div>

        <h2 className={h2Class}>{productPage.structuresHeading}</h2>
        <p className="mt-4 max-w-[68ch]">{productPage.structuresIntro}</p>
        <div className="mt-6">
          <StructureTable
            structures={fabricStructures}
            caption={productPage.structuresCaption}
            captionId="structure-table-caption"
          />
        </div>

        <h2 className={h2Class}>{productPage.requestHeading}</h2>
        <ul className="mt-4 max-w-[68ch] list-disc space-y-2 pl-6 marker:text-nila">
          {productPage.requestItems.map((item) => (
            <li key={item} className="pl-1">
              {item}
            </li>
          ))}
        </ul>

        <FaqSection heading={productPage.faqHeading} faqs={productFaqs} />

        <div className="mt-12">
          <ButtonLink href={whatsAppUrl} external>
            Minta sampel lewat WhatsApp
          </ButtonLink>
        </div>
      </ContentSheet>
      <JsonLd data={[buildBreadcrumbJsonLd(breadcrumbs), buildFaqJsonLd(productFaqs)]} />
    </Container>
  );
}
