import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { CMS_CACHE_TAG, getSupabaseEnv } from "@/lib/supabase/env";

// Klien tanpa cookie untuk halaman publik. Hanya bisa membaca apa yang diizinkan RLS untuk pengunjung.
// Tidak membaca cookie, jadi halaman publik tetap bisa di-cache. Hasil fetch diberi tag agar Server Action
// admin bisa memperbaruinya seketika (updateTag), dengan jaring pengaman 1 jam.
const cachedFetch: typeof fetch = (input, init) =>
  fetch(input, {
    ...init,
    cache: "force-cache",
    next: { revalidate: 3600, tags: [CMS_CACHE_TAG] },
  });

export function createPublicSupabase(): SupabaseClient | null {
  const env = getSupabaseEnv();
  if (!env) {
    return null;
  }
  return createClient(env.url, env.publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: cachedFetch },
  });
}
