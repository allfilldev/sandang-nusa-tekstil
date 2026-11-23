import type { SupabaseClient } from "@supabase/supabase-js";
import { authors } from "@/data/authors";
import type { ArticleContent, ArticleStatus, ManagedArticle } from "@/domain/article";
import { checkArticleQuality } from "@/lib/articleQuality";
import { defaultAuthorId } from "@/lib/articleForm";
import type { ArticleFormInput } from "@/lib/articleForm";
import { isValidSlug, slugify } from "@/lib/slug";
import { getStoragePublicPrefix } from "@/lib/supabase/env";
import {
  deleteManagedArticle,
  findManagedArticle,
  insertManagedArticle,
  isImageUsedElsewhere,
  isSlugTaken,
  updateManagedArticle,
} from "@/repositories/adminArticleRepository";
import { removeMediaByUrls } from "@/repositories/mediaRepository";

export type SaveArticleOutcome =
  | { kind: "ok"; article: ManagedArticle; previousSlug: string | null }
  | { kind: "invalid"; message: string; fieldErrors: Record<string, string> }
  | { kind: "conflict" }
  | { kind: "missing" };

export interface SaveArticleOptions {
  // Alamat artikel yang sudah terbit dikunci kecuali admin sengaja membukanya.
  allowSlugChange: boolean;
}

// Peta dari id pemeriksaan kualitas ke nama isian di form, untuk menandai isian yang kurang.
const requiredCheckField: Record<string, string> = {
  title: "title",
  slug: "slug",
  body: "body",
  metaTitle: "metaTitle",
  metaDescription: "metaDescription",
  faqComplete: "faqs",
};

function isAllowedImageUrl(url: string): boolean {
  if (url === "") {
    return true;
  }
  const prefix = getStoragePublicPrefix();
  return (prefix !== null && url.startsWith(prefix)) || url.startsWith("/images/");
}

function targetStatus(input: ArticleFormInput, existing: ManagedArticle | null): ArticleStatus {
  if (input.intent === "publish") {
    return "published";
  }
  if (input.intent === "unpublish") {
    return "draft";
  }
  return existing?.status ?? "draft";
}

function invalid(message: string, fieldErrors: Record<string, string>): SaveArticleOutcome {
  return { kind: "invalid", message, fieldErrors };
}

export async function saveArticle(
  db: SupabaseClient,
  input: ArticleFormInput,
  options: SaveArticleOptions,
): Promise<SaveArticleOutcome> {
  const existing = input.id ? await findManagedArticle(db, input.id) : null;
  if (input.id && !existing) {
    return { kind: "missing" };
  }

  const status = targetStatus(input, existing);
  const fieldErrors: Record<string, string> = {};
  const content: ArticleContent = { ...input.content };

  if (!content.title) {
    fieldErrors.title = "Isi judul artikel dulu.";
  }

  if (!content.slug && content.title) {
    content.slug = slugify(content.title);
  }
  if (content.slug && !isValidSlug(content.slug)) {
    fieldErrors.slug = "Alamat hanya boleh huruf kecil, angka, dan tanda hubung, misalnya cara-memilih-kain.";
  } else if (!content.slug && content.title) {
    fieldErrors.slug = "Judul ini tidak bisa dijadikan alamat. Tulis alamat dengan huruf dan angka.";
  }

  if (existing?.publishedAt && existing.slug !== content.slug && !options.allowSlugChange && !fieldErrors.slug) {
    fieldErrors.slug = "Alamat artikel yang sudah terbit dikunci. Buka kuncinya dulu kalau memang ingin mengganti.";
  }

  if (!isAllowedImageUrl(content.image.src)) {
    fieldErrors.imageUrl = "Gambar harus diunggah lewat panel ini.";
  }

  if (!authors.some((author) => author.id === content.authorId)) {
    content.authorId = defaultAuthorId;
  }
  content.relatedSlugs = content.relatedSlugs.filter((slug) => slug !== content.slug);
  content.summary = content.summary || content.metaDescription;

  if (status === "published") {
    const report = checkArticleQuality(content);
    for (const check of report.missingRequired) {
      const field = check.id === "image" ? (content.image.src ? "imageAlt" : "imageUrl") : requiredCheckField[check.id];
      if (field && !fieldErrors[field]) {
        fieldErrors[field] = check.detail;
      }
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    const message =
      status === "published"
        ? "Artikel belum bisa terbit. Lengkapi bagian yang ditandai."
        : "Artikel belum bisa disimpan. Perbaiki bagian yang ditandai.";
    return invalid(message, fieldErrors);
  }

  if (await isSlugTaken(db, content.slug, existing?.id)) {
    return invalid("Alamat artikel sudah dipakai.", { slug: "Alamat ini sudah dipakai artikel lain. Ganti sedikit alamatnya." });
  }

  const result = existing
    ? await updateManagedArticle(db, existing.id, content, status, input.version)
    : await insertManagedArticle(db, content, status);

  switch (result.kind) {
    case "saved":
      if (existing && existing.image.src && existing.image.src !== content.image.src) {
        if (!(await isImageUsedElsewhere(db, existing.image.src, existing.id))) {
          await removeMediaByUrls(db, [existing.image.src]);
        }
      }
      return { kind: "ok", article: result.article, previousSlug: existing?.slug ?? null };
    case "conflict":
      return { kind: "conflict" };
    case "missing":
      return { kind: "missing" };
    case "duplicate-slug":
      return invalid("Alamat artikel sudah dipakai.", { slug: "Alamat ini sudah dipakai artikel lain. Ganti sedikit alamatnya." });
    case "rejected":
      return invalid("Database menolak data artikel. Periksa isian yang wajib.", {});
  }
}

export async function deleteArticle(db: SupabaseClient, id: string): Promise<{ slug: string } | null> {
  const existing = await findManagedArticle(db, id);
  if (!existing) {
    return null;
  }
  const deleted = await deleteManagedArticle(db, id);
  if (!deleted) {
    return null;
  }
  if (existing.image.src && !(await isImageUsedElsewhere(db, existing.image.src, id))) {
    await removeMediaByUrls(db, [existing.image.src]);
  }
  return { slug: existing.slug };
}
