import { siteConfig } from "@/data/site";

export function absoluteUrl(path: string): string {
  if (path === "/" || path === "") {
    return `${siteConfig.url}/`;
  }
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${normalizedPath}`;
}
