import type { Metadata, Viewport } from "next";
import { Archivo, Source_Serif_4 } from "next/font/google";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/data/site";
import { buildOrganizationJsonLd, buildWebsiteJsonLd } from "@/lib/jsonLd";
import { getSiteBranding } from "@/services/brandingService";
import "./globals.css";

const displayFont = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
  axes: ["wdth"],
});

const bodyFont = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

const baseMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.tagline} | ${siteConfig.name}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  robots: siteConfig.allowIndexing
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-snippet": -1,
          "max-image-preview": "large",
          "max-video-preview": -1,
        },
      }
    : { index: false, follow: false },
  verification: {
    google: siteConfig.verification.google,
    other: siteConfig.verification.bing ? { "msvalidate.01": siteConfig.verification.bing } : undefined,
  },
  other: { "text-scale": "scale" },
};

// Ikon tab diambil dari logo yang diunggah lewat panel admin. Kalau belum ada, memakai ikon bawaan di /public.
// Ikon dideklarasikan di sini (bukan sebagai file di src/app) karena file ikon di src/app akan menimpa pengaturan ini.
export async function generateMetadata(): Promise<Metadata> {
  const branding = await getSiteBranding();
  const icons: Metadata["icons"] =
    branding.faviconUrl && branding.icon192Url && branding.appleIconUrl
      ? {
          icon: [
            { url: branding.faviconUrl, sizes: "48x48", type: "image/png" },
            { url: branding.icon192Url, sizes: "192x192", type: "image/png" },
          ],
          apple: [{ url: branding.appleIconUrl, sizes: "180x180", type: "image/png" }],
        }
      : {
          icon: [{ url: "/icon.svg", type: "image/svg+xml" }, { url: "/favicon.ico", sizes: "any" }],
          apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
        };
  return { ...baseMetadata, icons };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: siteConfig.themeColor,
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const branding = await getSiteBranding();

  return (
    <html lang={siteConfig.language} className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="min-h-screen antialiased">
        {children}
        <JsonLd data={[buildOrganizationJsonLd(branding.icon512Url), buildWebsiteJsonLd()]} />
      </body>
    </html>
  );
}
