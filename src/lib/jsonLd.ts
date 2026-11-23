import { siteConfig } from "@/data/site";
import type { Article } from "@/domain/article";
import type { Author } from "@/domain/author";
import type { FaqItem } from "@/domain/faq";
import { toDate } from "@/lib/date";
import { resolveTokens } from "@/lib/tokens";
import { absoluteUrl } from "@/lib/url";

export type JsonLdObject = Record<string, unknown>;

export interface BreadcrumbItem {
  name: string;
  path: string;
}

const schemaContext = "https://schema.org";
const organizationId = `${siteConfig.url}/#organization`;
const websiteId = `${siteConfig.url}/#website`;

export function buildOrganizationJsonLd(logoUrl?: string | null): JsonLdObject {
  return {
    "@context": schemaContext,
    "@type": "Organization",
    "@id": organizationId,
    name: siteConfig.name,
    url: absoluteUrl("/"),
    logo: {
      "@type": "ImageObject",
      url: logoUrl || absoluteUrl("/icon-512.png"),
      width: 512,
      height: 512,
    },
    description: siteConfig.description,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: siteConfig.telephone,
        contactType: "customer service",
        availableLanguage: ["id"],
      },
    ],
    publishingPrinciples: absoluteUrl("/kebijakan-editorial"),
    ...(siteConfig.profiles.length > 0 ? { sameAs: siteConfig.profiles } : {}),
  };
}

export function buildWebsiteJsonLd(): JsonLdObject {
  return {
    "@context": schemaContext,
    "@type": "WebSite",
    "@id": websiteId,
    url: absoluteUrl("/"),
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: siteConfig.language,
    publisher: { "@id": organizationId },
  };
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]): JsonLdObject {
  return {
    "@context": schemaContext,
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildAuthorJsonLd(author: Author): JsonLdObject {
  if (author.kind === "person") {
    return {
      "@type": "Person",
      name: author.name,
      jobTitle: author.jobTitle,
      url: absoluteUrl("/tentang"),
      worksFor: { "@id": organizationId },
      ...(author.profiles && author.profiles.length > 0 ? { sameAs: author.profiles } : {}),
    };
  }
  return {
    "@type": "Organization",
    name: author.name,
    url: absoluteUrl("/tentang"),
  };
}

export function buildArticleJsonLd(article: Article, author: Author): JsonLdObject {
  const articleUrl = absoluteUrl(`/artikel/${article.slug}`);
  return {
    "@context": schemaContext,
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    image: [absoluteUrl(article.image.src)],
    datePublished: toDate(article.publishedAt).toISOString(),
    dateModified: toDate(article.updatedAt).toISOString(),
    author: buildAuthorJsonLd(author),
    publisher: { "@id": organizationId },
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    inLanguage: siteConfig.language,
  };
}

export function buildFaqJsonLd(faqs: FaqItem[]): JsonLdObject {
  return {
    "@context": schemaContext,
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: resolveTokens(faq.answer),
      },
    })),
  };
}
