import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { updateSession } from "@/lib/supabase/session";

const loginPath = "/admin/masuk";

function redirectWithCookies(request: NextRequest, source: NextResponse, pathname: string): NextResponse {
  const target = request.nextUrl.clone();
  target.pathname = pathname;
  target.search = "";
  const redirect = NextResponse.redirect(target);
  source.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  redirect.headers.set("Cache-Control", "private, no-store");
  return redirect;
}

// Hanya berjalan di /admin. Halaman publik tidak tersentuh, jadi tetap statis dan bisa di-cache.
// Proxy ini hanya menyegarkan sesi dan mengarahkan pengguna; izin menulis dijaga oleh RLS dan Server Action.
export async function proxy(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.next();
  }

  const { response, signedIn } = await updateSession(request);
  const { pathname } = request.nextUrl;
  const onLoginPage = pathname === loginPath;

  if (!signedIn && !onLoginPage) {
    return redirectWithCookies(request, response, loginPath);
  }
  if (signedIn && onLoginPage) {
    return redirectWithCookies(request, response, "/admin");
  }

  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
