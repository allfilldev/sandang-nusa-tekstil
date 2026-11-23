// Membuat supabase/seed.sql dari artikel statis di src/data/articles.
// Jalankan: node scripts/generate-seed.mjs
// Hasilnya aman dijalankan berulang (on conflict do nothing).
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import ts from "typescript";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const articlesDir = join(root, "src", "data", "articles");

function loadArticle(file) {
  const source = readFileSync(join(articlesDir, file), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  const shim = { exports: {} };
  vm.runInNewContext(outputText, { module: shim, exports: shim.exports, require: () => ({}) });
  const exported = Object.values(shim.exports);
  if (exported.length !== 1) {
    throw new Error(`${file}: harus mengekspor tepat satu artikel`);
  }
  return exported[0];
}

function dollar(value, tag) {
  const text = String(value ?? "");
  if (text.includes(`$${tag}$`)) {
    throw new Error(`Teks mengandung pembatas $${tag}$`);
  }
  return `$${tag}$${text}$${tag}$`;
}

function sqlText(value) {
  return dollar(value, "t");
}

function sqlArray(values) {
  if (values.length === 0) {
    return "'{}'::text[]";
  }
  return `array[${values.map((value) => sqlText(value)).join(", ")}]::text[]`;
}

const files = readdirSync(articlesDir).filter((file) => file.endsWith(".ts") && file !== "index.ts");
const articles = files.map(loadArticle);

const rows = articles.map((article) => {
  const values = [
    sqlText(article.slug),
    sqlText(article.title),
    sqlText(article.metaTitle),
    sqlText(article.metaDescription),
    sqlText(article.keyword),
    sqlText(article.summary),
    sqlText(article.lead),
    sqlText(article.body),
    sqlText(article.faqHeading),
    `${dollar(JSON.stringify(article.faqs), "j")}::jsonb`,
    sqlText(article.closingHeading),
    sqlText(article.closing),
    sqlText(article.image.src),
    sqlText(article.image.alt),
    sqlText(article.image.caption),
    String(article.image.width),
    String(article.image.height),
    sqlText(article.authorId),
    sqlArray(article.relatedSlugs),
    "'published'",
    `'${article.publishedAt}'::date`,
    `'${article.updatedAt}'::date`,
  ];
  return `  (${values.join(",\n   ")})`;
});

const columns = [
  "slug",
  "title",
  "meta_title",
  "meta_description",
  "keyword",
  "summary",
  "lead",
  "body",
  "faq_heading",
  "faqs",
  "closing_heading",
  "closing",
  "image_url",
  "image_alt",
  "image_caption",
  "image_width",
  "image_height",
  "author_id",
  "related_slugs",
  "status",
  "published_on",
  "updated_on",
].join(", ");

const sql = [
  "-- Dibuat otomatis oleh scripts/generate-seed.mjs dari src/data/articles. Jangan diedit tangan.",
  "-- Jalankan di Supabase Dashboard > SQL Editor SETELAH 0001_cms.sql. Aman dijalankan berulang.",
  "",
  `insert into public.articles (${columns})`,
  "values",
  rows.join(",\n"),
  "on conflict (slug) do nothing;",
  "",
].join("\n");

const outputFile = join(root, "supabase", "seed.sql");
mkdirSync(dirname(outputFile), { recursive: true });
writeFileSync(outputFile, sql, "utf8");
console.log(`seed.sql dibuat: ${articles.length} artikel (${articles.map((article) => article.slug).join(", ")})`);
