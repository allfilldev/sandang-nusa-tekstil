import type { LegalDocument } from "@/domain/legal";
import { editorialDocument } from "@/data/legal/editorial";
import { privacyDocument } from "@/data/legal/privacy";
import { termsDocument } from "@/data/legal/terms";

export const legalDocuments: LegalDocument[] = [privacyDocument, termsDocument, editorialDocument];
