import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSupabaseEnv } from "@/lib/supabase/env";

export interface SessionResult {
  response: NextResponse;
  signedIn: boolean;
}

// Menyegarkan token sesi yang hampir habis dan meneruskan cookie baru ke browser.
// Pemeriksaan sungguhan (login dan status admin) tetap dilakukan ulang di setiap Server Action
// dan di database lewat RLS. Jangan jadikan proxy satu-satunya penjaga.
export async function updateSession(request: NextRequest): Promise<SessionResult> {
  let response = NextResponse.next({ request });
  const env = getSupabaseEnv();
  if (!env) {
    return { response, signedIn: false };
  }

  const supabase = createServerClient(env.url, env.publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  return { response, signedIn: Boolean(data?.claims) };
}
