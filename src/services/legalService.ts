import { legalDocuments } from "@/data/legal";
import type { LegalDocument } from "@/domain/legal";

export function getLegalDocuments(): LegalDocument[] {
  return legalDocuments;
}

export function getLegalDocumentBySlug(slug: string): LegalDocument {
  const document = legalDocuments.find((item) => item.slug === slug);
  if (!document) {
    throw new Error(`Legal document not found: ${slug}`);
  }
  return document;
}
