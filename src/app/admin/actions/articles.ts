"use server";

import { redirect } from "next/navigation";
import { errorState, successState } from "@/domain/formState";
import type { FormState } from "@/domain/formState";
import { parseArticleForm } from "@/lib/articleForm";
import { refreshArticlePages } from "@/lib/cmsCache";
import { getActiveAdmin } from "@/lib/supabase/adminSession";
import { deleteArticle, saveArticle } from "@/services/adminArticleService";

const successMessages = {
  save: { draft: "Draf tersimpan.", published: "Perubahan tersimpan dan sudah tampil di situs." },
  publish: "Artikel sudah terbit di situs.",
  unpublish: "Artikel disembunyikan dari situs dan kembali menjadi draf.",
} as const;

export async function saveArticleAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const admin = await getActiveAdmin();
  if (!admin) {
    redirect("/admin/masuk");
  }

  const input = parseArticleForm(formData);
  const allowSlugChange = formData.get("slugUnlocked") === "1";
  const outcome = await saveArticle(admin.db, input, { allowSlugChange });

  switch (outcome.kind) {
    case "invalid":
      return errorState(outcome.message, outcome.fieldErrors);
    case "conflict":
      return errorState("Artikel ini diubah di tempat lain sejak kamu membukanya. Muat ulang halaman supaya perubahan terbaru tidak tertimpa.");
    case "missing":
      return errorState("Artikel ini sudah tidak ada. Mungkin sudah dihapus dari tab lain.");
    case "ok":
      break;
  }

  const { article, previousSlug } = outcome;
  refreshArticlePages([article.slug, previousSlug ?? ""]);

  if (!input.id) {
    redirect(`/admin/artikel/${article.id}?hasil=${article.status === "published" ? "terbit" : "draf"}`);
  }

  const message =
    input.intent === "publish"
      ? successMessages.publish
      : input.intent === "unpublish"
        ? successMessages.unpublish
        : successMessages.save[article.status];

  return successState(message, {
    id: article.id,
    version: article.version,
    status: article.status,
    slug: article.slug,
  });
}

export async function deleteArticleAction(formData: FormData): Promise<void> {
  const admin = await getActiveAdmin();
  if (!admin) {
    redirect("/admin/masuk");
  }

  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    redirect("/admin/artikel");
  }

  const deleted = await deleteArticle(admin.db, id);
  if (deleted) {
    refreshArticlePages([deleted.slug]);
  }
  redirect(`/admin/artikel?hasil=${deleted ? "dihapus" : "tidak-ada"}`);
}
