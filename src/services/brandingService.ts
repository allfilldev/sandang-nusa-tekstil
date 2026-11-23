import type { SiteBranding } from "@/domain/branding";
import { readSiteBranding } from "@/repositories/brandingRepository";

export async function getSiteBranding(): Promise<SiteBranding> {
  return readSiteBranding();
}
