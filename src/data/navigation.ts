import type { LegalNavigationLink, NavigationLink } from "@/domain/site";

export const mainNavigation: NavigationLink[] = [
  { label: "Produk", href: "/produk" },
  { label: "Proses", href: "/proses-produksi" },
  { label: "Artikel", href: "/artikel" },
  { label: "Tentang", href: "/tentang" },
  { label: "Kontak", href: "/kontak" },
];

export const footerNavigation: NavigationLink[] = [
  { label: "Beranda", href: "/" },
  { label: "Produk", href: "/produk" },
  { label: "Proses produksi", href: "/proses-produksi" },
  { label: "Artikel", href: "/artikel" },
  { label: "Tentang", href: "/tentang" },
  { label: "Kontak", href: "/kontak" },
];

export const legalNavigation: LegalNavigationLink[] = [
  { label: "Kebijakan privasi", href: "/privasi", rel: "privacy-policy" },
  { label: "Syarat dan ketentuan", href: "/syarat-ketentuan", rel: "terms-of-service" },
  { label: "Kebijakan editorial", href: "/kebijakan-editorial" },
  { label: "Kontak", href: "/kontak" },
];
