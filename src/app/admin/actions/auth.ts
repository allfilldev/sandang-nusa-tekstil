"use server";

import { redirect } from "next/navigation";
import { errorState, successState } from "@/domain/formState";
import type { FormState } from "@/domain/formState";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";

const minimumPasswordLength = 8;

function readText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export async function signInAction(_previous: FormState, formData: FormData): Promise<FormState> {
  if (!isSupabaseConfigured()) {
    return errorState("Supabase belum disambungkan. Ikuti panduan di halaman admin.");
  }

  const email = readText(formData, "email").trim();
  const password = readText(formData, "password");
  const fieldErrors: Record<string, string> = {};
  if (!email) {
    fieldErrors.email = "Isi email kamu.";
  }
  if (!password) {
    fieldErrors.password = "Isi kata sandi kamu.";
  }
  if (Object.keys(fieldErrors).length > 0) {
    return errorState("Masih ada isian yang kosong.", fieldErrors);
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    if (error.status === 429) {
      return errorState("Terlalu banyak percobaan masuk. Tunggu beberapa menit lalu coba lagi.");
    }
    return errorState("Email atau kata sandi salah.");
  }

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (isAdmin !== true) {
    await supabase.auth.signOut();
    return errorState("Akun ini belum terdaftar sebagai admin situs. Hubungi pemilik situs.");
  }

  redirect("/admin");
}

export async function signOutAction(): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabase();
    await supabase.auth.signOut();
  }
  redirect("/admin/masuk");
}

export async function changePasswordAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const password = readText(formData, "password");
  const confirmation = readText(formData, "passwordConfirmation");

  const fieldErrors: Record<string, string> = {};
  if (password.length < minimumPasswordLength) {
    fieldErrors.password = `Kata sandi baru minimal ${minimumPasswordLength} karakter.`;
  }
  if (password !== confirmation) {
    fieldErrors.passwordConfirmation = "Kata sandi ulang tidak sama dengan kata sandi baru.";
  }
  if (Object.keys(fieldErrors).length > 0) {
    return errorState("Kata sandi belum bisa disimpan.", fieldErrors);
  }

  if (!isSupabaseConfigured()) {
    return errorState("Supabase belum disambungkan.");
  }
  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims?.sub) {
    redirect("/admin/masuk");
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return errorState(`Kata sandi belum bisa diganti. ${error.message}`);
  }
  return successState("Kata sandi sudah diganti.");
}
