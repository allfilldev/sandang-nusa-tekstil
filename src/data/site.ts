import type { SiteConfig } from "@/domain/site";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const siteConfig: SiteConfig = {
  name: "Sandang Nusa Tekstil",
  tagline: "Manufaktur Tekstil",
  description:
    "Sandang Nusa Tekstil memproduksi kain tenun, kain rajut, dan kain jadi untuk konveksi dan merek fesyen. Kenali jenis kain, tahapan produksi, dan cara meminta sampel.",
  url: rawSiteUrl.replace(/\/+$/, ""),
  language: "id",
  locale: "id_ID",
  themeColor: "#f3f5f8",
  allowIndexing: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
  lastUpdated: "2026-11-19",
  whatsapp: {
    phone: "62895326422692",
    displayNumber: "+62 895-3264-22692",
    message: "Halo, saya ingin konsultasi pembuatan website. Paket mana yang cocok untuk usaha saya?",
  },
  telephone: "+62895326422692",
  profiles: [],
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    bing: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || undefined,
  },
};
