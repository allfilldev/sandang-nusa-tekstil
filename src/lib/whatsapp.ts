import { siteConfig } from "@/data/site";

export function buildWhatsAppUrl(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export const whatsAppUrl = buildWhatsAppUrl(siteConfig.whatsapp.phone, siteConfig.whatsapp.message);
