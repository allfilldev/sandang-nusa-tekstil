import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";
import { getSiteBranding } from "@/services/brandingService";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const branding = await getSiteBranding();

  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    lang: siteConfig.language,
    start_url: "/",
    display: "standalone",
    background_color: siteConfig.themeColor,
    theme_color: siteConfig.themeColor,
    icons: [
      { src: branding.icon192Url ?? "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: branding.icon512Url ?? "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
