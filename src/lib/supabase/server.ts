import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { requireSupabaseEnv } from "@/lib/supabase/env";

// Klien dengan sesi admin (cookie). Buat baru untuk setiap permintaan, jangan disimpan di variabel global.
export async function createServerSupabase(): Promise<SupabaseClient> {
  const env = requireSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient(env.url, env.publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Dipanggil dari Server Component yang tidak boleh menulis cookie.
          // Aman diabaikan karena proxy.ts yang menyegarkan sesi.
        }
      },
    },
  });
}
