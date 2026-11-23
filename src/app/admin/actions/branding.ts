"use server";

import { redirect } from "next/navigation";
import { errorState } from "@/domain/formState";
import type { FormState } from "@/domain/formState";
import { refreshWholeSite } from "@/lib/cmsCache";
import { getActiveAdmin } from "@/lib/supabase/adminSession";
import { resetLogoSettings, saveLogoSettings } from "@/services/adminBrandingService";
import type { LogoUploadInput } from "@/services/adminBrandingService";

function readText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function readPositiveInteger(formData: FormData, name: string): number {
  const parsed = Number.parseInt(readText(formData, name), 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function saveLogoAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const admin = await getActiveAdmin();
  if (!admin) {
    redirect("/admin/masuk");
  }

  const folder = readText(formData, "logoFolder");
  const upload: LogoUploadInput | null = folder
    ? {
        folder,
        logoUrl: readText(formData, "logoUrl"),
        faviconUrl: readText(formData, "faviconUrl"),
        appleIconUrl: readText(formData, "appleIconUrl"),
        icon192Url: readText(formData, "icon192Url"),
        icon512Url: readText(formData, "icon512Url"),
        width: readPositiveInteger(formData, "logoWidth"),
        height: readPositiveInteger(formData, "logoHeight"),
      }
    : null;

  const outcome = await saveLogoSettings(admin.db, {
    alt: readText(formData, "logoAlt"),
    showBrandName: formData.get("showBrandName") === "on",
    upload,
  });

  if (outcome.kind === "invalid") {
    return errorState(outcome.message, outcome.fieldErrors);
  }

  refreshWholeSite();
  // Muat ulang halaman logo dengan pesan berhasil, sehingga pilihan berkas lama dan pratinjau ikut dibersihkan.
  redirect("/admin/logo?hasil=tersimpan");
}

export async function resetLogoAction(): Promise<void> {
  const admin = await getActiveAdmin();
  if (!admin) {
    redirect("/admin/masuk");
  }
  await resetLogoSettings(admin.db);
  refreshWholeSite();
  redirect("/admin/logo?hasil=direset");
}
