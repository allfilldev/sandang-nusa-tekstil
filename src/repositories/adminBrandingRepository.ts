import type { SupabaseClient } from "@supabase/supabase-js";
import type { SiteBranding } from "@/domain/branding";
import { defaultBranding } from "@/domain/branding";
import { SITE_SETTINGS_COLUMNS, rowToBranding } from "@/repositories/brandingRepository";
import type { SiteSettingsRow } from "@/repositories/brandingRepository";

// Dibaca dengan sesi admin sehingga tidak lewat cache publik: halaman logo selalu menampilkan keadaan terbaru.
export async function readBrandingForAdmin(db: SupabaseClient): Promise<SiteBranding> {
  const { data, error } = await db
    .from("site_settings")
    .select(SITE_SETTINGS_COLUMNS)
    .eq("id", 1)
    .maybeSingle<SiteSettingsRow>();
  if (error) {
    throw new Error(`Gagal membaca pengaturan logo: ${error.message}`);
  }
  return data ? rowToBranding(data) : defaultBranding;
}

export interface LogoSettingsPatch {
  logo_alt?: string;
  show_brand_name?: boolean;
  logo_url?: string | null;
  logo_width?: number | null;
  logo_height?: number | null;
  favicon_url?: string | null;
  apple_icon_url?: string | null;
  icon_192_url?: string | null;
  icon_512_url?: string | null;
  logo_folder?: string | null;
}

export async function updateSiteSettings(db: SupabaseClient, patch: LogoSettingsPatch): Promise<void> {
  const { data, error } = await db.from("site_settings").update(patch).eq("id", 1).select("id");
  if (error) {
    throw new Error(`Gagal menyimpan pengaturan logo: ${error.message}`);
  }
  if (data.length === 0) {
    throw new Error("Baris pengaturan situs tidak ditemukan. Jalankan ulang supabase/migrations/0001_cms.sql.");
  }
}
