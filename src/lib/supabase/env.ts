export interface SupabaseEnv {
  url: string;
  publishableKey: string;
}

// NEXT_PUBLIC_* harus ditulis lengkap di sini agar Next.js menanamkan nilainya ke kode browser.
const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export function getSupabaseEnv(): SupabaseEnv | null {
  const url = rawUrl?.trim().replace(/\/+$/, "");
  const publishableKey = rawKey?.trim();
  if (!url || !publishableKey) {
    return null;
  }
  return { url, publishableKey };
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseEnv() !== null;
}

export function requireSupabaseEnv(): SupabaseEnv {
  const env = getSupabaseEnv();
  if (!env) {
    throw new Error(
      "Supabase belum disambungkan. Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY di .env.local.",
    );
  }
  return env;
}

export const MEDIA_BUCKET = "media";
export const CMS_CACHE_TAG = "cms";

export function getStoragePublicPrefix(): string | null {
  const env = getSupabaseEnv();
  return env ? `${env.url}/storage/v1/object/public/${MEDIA_BUCKET}/` : null;
}
