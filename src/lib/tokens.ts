import { siteConfig } from "@/data/site";
import { whatsAppUrl } from "@/lib/whatsapp";

const contentTokens: Record<string, string> = {
  brand: siteConfig.name,
  whatsappUrl: whatsAppUrl,
  whatsappNumber: siteConfig.whatsapp.displayNumber,
};

export function resolveTokens(text: string): string {
  return text.replace(/\{\{(\w+)\}\}/g, (match: string, key: string) => contentTokens[key] ?? match);
}
