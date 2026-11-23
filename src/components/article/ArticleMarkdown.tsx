import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { resolveTokens } from "@/lib/tokens";

const linkClassName = "font-semibold text-nila underline decoration-nila/40 underline-offset-4 hover:decoration-nila";

const markdownComponents: Components = {
  h2: ({ children }) => (
    <h2 className="mb-4 mt-12 font-display text-3xl font-bold leading-tight">{children}</h2>
  ),
  h3: ({ children }) => <h3 className="mb-3 mt-8 font-display text-xl font-bold leading-snug">{children}</h3>,
  p: ({ node, children }) => {
    const [firstChild] = node?.children ?? [];
    const containsOnlyImage =
      node?.children.length === 1 && firstChild?.type === "element" && firstChild.tagName === "img";
    if (containsOnlyImage) {
      return <>{children}</>;
    }
    return <p className="my-4 max-w-[68ch]">{children}</p>;
  },
  ul: ({ children }) => <ul className="my-4 max-w-[68ch] list-disc space-y-2 pl-6 marker:text-nila">{children}</ul>,
  ol: ({ children }) => (
    <ol className="my-4 max-w-[68ch] list-decimal space-y-2 pl-6 marker:font-bold marker:text-nila">{children}</ol>
  ),
  li: ({ children }) => <li className="pl-1">{children}</li>,
  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
  a: ({ href, children }) => {
    const url = href ?? "";
    if (url.startsWith("/")) {
      return (
        <Link href={url} className={linkClassName}>
          {children}
        </Link>
      );
    }
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={linkClassName}>
        {children}
      </a>
    );
  },
  table: ({ children }) => (
    <div tabIndex={0} role="region" aria-label="Tabel perbandingan" className="table-wrapper my-6">
      <table className="data-table min-w-[30rem]">{children}</table>
    </div>
  ),
  img: ({ src, alt, title }) => {
    if (typeof src !== "string") {
      return null;
    }
    return (
      <figure className="my-8">
        <Image
          src={src}
          alt={alt ?? ""}
          width={1200}
          height={675}
          sizes="(min-width: 1024px) 640px, 100vw"
          className="squircle h-auto w-full rounded-photo"
        />
        {title ? <figcaption className="mt-3 text-base text-nila/80">{title}</figcaption> : null}
      </figure>
    );
  },
};

interface ArticleMarkdownProps {
  content: string;
}

export function ArticleMarkdown({ content }: ArticleMarkdownProps) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
      {resolveTokens(content)}
    </ReactMarkdown>
  );
}
