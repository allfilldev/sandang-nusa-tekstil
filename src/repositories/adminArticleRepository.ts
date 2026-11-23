import type { SupabaseClient } from "@supabase/supabase-js";
import type { ArticleContent, ArticleStatus, ManagedArticle, ManagedArticleSummary } from "@/domain/article";
import { ARTICLE_COLUMNS, contentToRow, rowToManagedArticle } from "@/repositories/articleMapper";
import type { ArticleRow } from "@/repositories/articleMapper";

// Semua fungsi di sini menerima klien dengan sesi admin. Hak akses yang sebenarnya dijaga oleh RLS di database.

const SUMMARY_COLUMNS = "id, slug, title, status, published_on, updated_on, updated_at";

interface SummaryRow {
  id: string;
  slug: string;
  title: string;
  status: string;
  published_on: string | null;
  updated_on: string;
  updated_at: string;
}

export type WriteResult =
  | { kind: "saved"; article: ManagedArticle }
  | { kind: "conflict" }
  | { kind: "missing" }
  | { kind: "duplicate-slug" }
  | { kind: "rejected"; message: string };

interface PostgrestFailure {
  code?: string;
  message: string;
}

function toFailure(error: PostgrestFailure): WriteResult {
  if (error.code === "23505") {
    return { kind: "duplicate-slug" };
  }
  if (error.code === "23514" || error.code === "22P02") {
    return { kind: "rejected", message: error.message };
  }
  throw new Error(`Database menolak permintaan: ${error.message}`);
}

export async function listArticleSummaries(db: SupabaseClient): Promise<ManagedArticleSummary[]> {
  const { data, error } = await db
    .from("articles")
    .select(SUMMARY_COLUMNS)
    .order("updated_at", { ascending: false })
    .overrideTypes<SummaryRow[], { merge: false }>();
  if (error) {
    throw new Error(`Gagal membaca daftar artikel: ${error.message}`);
  }
  return data.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    status: row.status === "published" ? "published" : "draft",
    publishedAt: row.published_on,
    updatedAt: row.updated_on,
  }));
}

export async function findManagedArticle(db: SupabaseClient, id: string): Promise<ManagedArticle | null> {
  const { data, error } = await db.from("articles").select(ARTICLE_COLUMNS).eq("id", id).maybeSingle<ArticleRow>();
  if (error) {
    // Id yang bukan uuid dianggap tidak ditemukan.
    if (error.code === "22P02") {
      return null;
    }
    throw new Error(`Gagal membaca artikel: ${error.message}`);
  }
  return data ? rowToManagedArticle(data) : null;
}

export async function isSlugTaken(db: SupabaseClient, slug: string, exceptId?: string): Promise<boolean> {
  let query = db.from("articles").select("id").eq("slug", slug).limit(1);
  if (exceptId) {
    query = query.neq("id", exceptId);
  }
  const { data, error } = await query;
  if (error) {
    throw new Error(`Gagal memeriksa alamat artikel: ${error.message}`);
  }
  return data.length > 0;
}

// Dipakai sebelum menghapus berkas gambar lama: gambar yang sama bisa dipakai artikel lain.
export async function isImageUsedElsewhere(db: SupabaseClient, imageUrl: string, exceptId: string): Promise<boolean> {
  const { data, error } = await db.from("articles").select("id").eq("image_url", imageUrl).neq("id", exceptId).limit(1);
  if (error) {
    // Kalau tidak bisa memastikan, anggap masih dipakai supaya berkas tidak terhapus keliru.
    return true;
  }
  return data.length > 0;
}

export async function insertManagedArticle(
  db: SupabaseClient,
  content: ArticleContent,
  status: ArticleStatus,
): Promise<WriteResult> {
  const { data, error } = await db
    .from("articles")
    .insert({ ...contentToRow(content), status })
    .select(ARTICLE_COLUMNS)
    .single<ArticleRow>();
  if (error) {
    return toFailure(error);
  }
  return { kind: "saved", article: rowToManagedArticle(data) };
}

// Menyimpan hanya kalau artikel belum diubah di tempat lain sejak dimuat (version cocok dengan updated_at).
export async function updateManagedArticle(
  db: SupabaseClient,
  id: string,
  content: ArticleContent,
  status: ArticleStatus,
  version: string,
): Promise<WriteResult> {
  const { data, error } = await db
    .from("articles")
    .update({ ...contentToRow(content), status })
    .eq("id", id)
    .eq("updated_at", version)
    .select(ARTICLE_COLUMNS)
    .overrideTypes<ArticleRow[], { merge: false }>();
  if (error) {
    return toFailure(error);
  }
  if (data.length > 0) {
    return { kind: "saved", article: rowToManagedArticle(data[0]) };
  }
  const existing = await findManagedArticle(db, id);
  return existing ? { kind: "conflict" } : { kind: "missing" };
}

export async function changeManagedArticleStatus(
  db: SupabaseClient,
  id: string,
  status: ArticleStatus,
): Promise<WriteResult> {
  const { data, error } = await db
    .from("articles")
    .update({ status })
    .eq("id", id)
    .select(ARTICLE_COLUMNS)
    .overrideTypes<ArticleRow[], { merge: false }>();
  if (error) {
    return toFailure(error);
  }
  return data.length > 0 ? { kind: "saved", article: rowToManagedArticle(data[0]) } : { kind: "missing" };
}

export async function deleteManagedArticle(db: SupabaseClient, id: string): Promise<boolean> {
  const { data, error } = await db.from("articles").delete().eq("id", id).select("id");
  if (error) {
    throw new Error(`Gagal menghapus artikel: ${error.message}`);
  }
  return data.length > 0;
}
