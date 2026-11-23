import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { ContentSheet } from "@/components/ui/ContentSheet";
import type { LegalDocument } from "@/domain/legal";
import { formatDate } from "@/lib/date";
import { buildBreadcrumbJsonLd } from "@/lib/jsonLd";
import type { BreadcrumbItem } from "@/lib/jsonLd";
import { resolveTokens } from "@/lib/tokens";

interface LegalDocumentViewProps {
  document: LegalDocument;
}

export function LegalDocumentView({ document }: LegalDocumentViewProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Beranda", path: "/" },
    { name: document.title, path: document.path },
  ];

  return (
    <Container className="py-8 md:py-12">
      <Breadcrumbs items={breadcrumbs} />
      <ContentSheet className="mt-6 max-w-3xl">
        <h1 className="font-display text-[clamp(2rem,1.4rem+3vw,3.25rem)] font-extrabold leading-[1.08] tracking-tight">
          {document.title}
        </h1>
        <p className="mt-4 text-base">
          <span className="text-nila/70">Diperbarui terakhir</span>{" "}
          <time dateTime={document.updatedAt} className="font-semibold">
            {formatDate(document.updatedAt)}
          </time>
        </p>
        <p className="mt-6 max-w-[68ch] text-xl font-medium leading-relaxed">{resolveTokens(document.intro)}</p>
        {document.sections.map((section) => (
          <section key={section.heading} className="mt-10">
            <h2 className="font-display text-2xl font-bold leading-tight">{section.heading}</h2>
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="mt-3 max-w-[68ch]">
                {resolveTokens(paragraph)}
              </p>
            ))}
            {section.items ? (
              <ul className="mt-3 max-w-[68ch] list-disc space-y-2 pl-6 marker:text-nila">
                {section.items.map((item) => (
                  <li key={item} className="pl-1">
                    {resolveTokens(item)}
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </ContentSheet>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
    </Container>
  );
}
