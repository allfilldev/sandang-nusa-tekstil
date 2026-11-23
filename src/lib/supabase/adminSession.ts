import type { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { cache } from "react";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";

export type AdminSession =
  | { state: "unconfigured" }
  | { state: "anonymous" }
  | { state: "forbidden"; email: string }
  | { state: "admin"; db: SupabaseClient; userId: string; email: string };

export type ActiveAdminSession = Extract<AdminSession, { state: "admin" }>;

// Pemeriksaan sesi untuk halaman dan Server Action admin. Memakai getClaims() yang memverifikasi tanda tangan token,
// bukan getSession() yang hanya membaca cookie. Status admin dicek ke database lewat fungsi is_admin().
// Hasilnya di-cache per permintaan supaya layout dan halaman tidak memeriksa dua kali.
export const getAdminSession = cache(async (): Promise<AdminSession> => {
  if (!isSupabaseConfigured()) {
    return { state: "unconfigured" };
  }

  const db = await createServerSupabase();
  const { data } = await db.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub) {
    return { state: "anonymous" };
  }

  const email = typeof claims.email === "string" ? claims.email : "";
  const { data: isAdmin, error } = await db.rpc("is_admin");
  if (error || isAdmin !== true) {
    return { state: "forbidden", email };
  }

  return { state: "admin", db, userId: claims.sub, email };
});

// Untuk halaman admin: kembali ke halaman masuk kalau belum login atau belum terdaftar sebagai admin.
export async function requireAdminPage(): Promise<ActiveAdminSession> {
  const session = await getAdminSession();
  if (session.state === "admin") {
    return session;
  }
  redirect(session.state === "unconfigured" ? "/admin" : "/admin/masuk");
}

// Untuk Server Action: kembalikan null kalau tidak berhak, supaya action bisa menjawab dengan pesan ramah.
export async function getActiveAdmin(): Promise<ActiveAdminSession | null> {
  const session = await getAdminSession();
  return session.state === "admin" ? session : null;
}
