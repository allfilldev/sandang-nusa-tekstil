import { siteConfig } from "@/data/site";
import { toDate } from "@/lib/date";
import { absoluteUrl } from "@/lib/url";
import { getAllArticles } from "@/services/articleService";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(): Promise<Response> {
  const articles = await getAllArticles();
  const feedUrl = absoluteUrl("/feed.xml");

  const items = articles
    .map((article) => {
      const articleUrl = absoluteUrl(`/artikel/${article.slug}`);
      return [
        "<item>",
        `<title>${escapeXml(article.title)}</title>`,
        `<link>${articleUrl}</link>`,
        `<guid isPermaLink="true">${articleUrl}</guid>`,
        `<pubDate>${toDate(article.publishedAt).toUTCString()}</pubDate>`,
        `<description>${escapeXml(article.metaDescription)}</description>`,
        "</item>",
      ].join("");
    })
    .join("");

  const feed = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "<channel>",
    `<title>${escapeXml(`${siteConfig.tagline} | ${siteConfig.name}`)}</title>`,
    `<link>${absoluteUrl("/")}</link>`,
    `<description>${escapeXml(siteConfig.description)}</description>`,
    `<language>${siteConfig.language}</language>`,
    `<atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>`,
    items,
    "</channel>",
    "</rss>",
  ].join("");

  return new Response(feed, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
