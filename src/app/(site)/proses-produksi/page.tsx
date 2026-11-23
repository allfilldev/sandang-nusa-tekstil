import type { Metadata } from "next";
import { ProcessThread } from "@/components/product/ProcessThread";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { ContentSheet } from "@/components/ui/ContentSheet";
import { processPage, processSteps } from "@/data/process";
import { buildBreadcrumbJsonLd } from "@/lib/jsonLd";
import type { BreadcrumbItem } from "@/lib/jsonLd";
import { buildPageMetadata } from "@/lib/metadata";
import { whatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = buildPageMetadata({
  title: processPage.heading,
  description: processPage.metaDescription,
  path: "/proses-produksi",
});

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Beranda", path: "/" },
  { name: "Proses produksi", path: "/proses-produksi" },
];

const h2Class = "heading-thread mt-14 font-display text-[clamp(1.875rem,1.4rem+1.8vw,2.75rem)] font-bold leading-tight";

export default function ProcessPage() {
  return (
    <Container className="py-8 md:py-12">
      <Breadcrumbs items={breadcrumbs} />
      <ContentSheet className="mt-6">
        <h1 className="break-words font-display text-[clamp(2rem,1.3rem+3.2vw,3.5rem)] font-extrabold font-stretch-expanded leading-none tracking-tight">
          {processPage.heading}
        </h1>
        <p className="mt-6 max-w-[60ch] text-xl leading-relaxed">{processPage.lead}</p>

        <h2 className={h2Class}>{processPage.stepsHeading}</h2>
        <ProcessThread steps={processSteps} />

        <h2 className={h2Class}>{processPage.qualityHeading}</h2>
        <p className="mt-4 max-w-[68ch]">{processPage.qualityIntro}</p>
        <ul className="mt-4 max-w-[68ch] list-disc space-y-2 pl-6 marker:text-nila">
          {processPage.qualityItems.map((item) => (
            <li key={item} className="pl-1">
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-12 border-t-4 border-nila pt-6">
          <p className="max-w-[56ch]">{processPage.contactText}</p>
          <div className="mt-5">
            <ButtonLink href={whatsAppUrl} external variant="accent">
              Tanya tahapan produksi
            </ButtonLink>
          </div>
        </div>
      </ContentSheet>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
    </Container>
  );
}
