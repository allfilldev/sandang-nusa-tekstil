import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireSupabaseEnv } from "@/lib/supabase/env";

// Hanya dipakai di komponen browser admin untuk mengunggah gambar langsung ke Storage (dilindungi RLS).
export function createBrowserSupabase(): SupabaseClient {
  const env = requireSupabaseEnv();
  return createBrowserClient(env.url, env.publishableKey);
}
