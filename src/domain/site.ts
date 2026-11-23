export interface NavigationLink {
  label: string;
  href: string;
}

export interface LegalNavigationLink extends NavigationLink {
  rel?: string;
}

export interface WhatsAppConfig {
  phone: string;
  displayNumber: string;
  message: string;
}

export interface SiteVerification {
  google?: string;
  bing?: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  url: string;
  language: string;
  locale: string;
  themeColor: string;
  allowIndexing: boolean;
  lastUpdated: string;
  whatsapp: WhatsAppConfig;
  telephone: string;
  profiles: string[];
  verification: SiteVerification;
}
