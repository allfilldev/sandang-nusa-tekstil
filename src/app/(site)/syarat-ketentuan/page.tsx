import type { Metadata } from "next";
import { LegalDocumentView } from "@/components/legal/LegalDocumentView";
import { buildPageMetadata } from "@/lib/metadata";
import { getLegalDocumentBySlug } from "@/services/legalService";

const legalDocument = getLegalDocumentBySlug("syarat-ketentuan");

export const metadata: Metadata = buildPageMetadata({
  title: legalDocument.metaTitle,
  description: legalDocument.metaDescription,
  path: legalDocument.path,
});

export default function TermsPage() {
  return <LegalDocumentView document={legalDocument} />;
}
