import type { Metadata } from "next";
import { LegalDocumentView } from "@/components/legal/LegalDocumentView";
import { buildPageMetadata } from "@/lib/metadata";
import { getLegalDocumentBySlug } from "@/services/legalService";

const legalDocument = getLegalDocumentBySlug("kebijakan-editorial");

export const metadata: Metadata = buildPageMetadata({
  title: legalDocument.metaTitle,
  description: legalDocument.metaDescription,
  path: legalDocument.path,
});

export default function EditorialPolicyPage() {
  return <LegalDocumentView document={legalDocument} />;
}
