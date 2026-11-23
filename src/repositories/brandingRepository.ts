import { defaultBranding } from "@/domain/branding";
import type { SiteBranding } from "@/domain/branding";
import { createPublicSupabase } from "@/lib/supabase/public";

export interface SiteSettingsRow {
  logo_url: string | null;
  logo_width: number | null;
  logo_height: number | null;
  logo_alt: string;
  favicon_url: string | null;
  apple_icon_url: string | null;
  icon_192_url: string | null;
  icon_512_url: string | null;
  logo_folder: string | null;
  show_brand_name: boolean;
  updated_at: string;
}

export const SITE_SETTINGS_COLUMNS =
  "logo_url, logo_width, logo_height, logo_alt, favicon_url, apple_icon_url, icon_192_url, icon_512_url, logo_folder, show_brand_name, updated_at";

export function rowToBranding(row: SiteSettingsRow): SiteBranding {
  return {
    logoUrl: row.logo_url,
    logoWidth: row.logo_width ?? 0,
    logoHeight: row.logo_height ?? 0,
    logoAlt: row.logo_alt,
    faviconUrl: row.favicon_url,
    appleIconUrl: row.apple_icon_url,
    icon192Url: row.icon_192_url,
    icon512Url: row.icon_512_url,
    logoFolder: row.logo_folder,
    showBrandName: row.show_brand_name,
    version: row.updated_at,
  };
}

export async function readSiteBranding(): Promise<SiteBranding> {
  const supabase = createPublicSupabase();
  if (!supabase) {
    return defaultBranding;
  }

  const { data, error } = await supabase
    .from("site_settings")
    .select(SITE_SETTINGS_COLUMNS)
    .eq("id", 1)
    .maybeSingle<SiteSettingsRow>();

  if (error) {
    throw new Error(`Gagal membaca pengaturan situs dari Supabase: ${error.message}`);
  }
  return data ? rowToBranding(data) : defaultBranding;
}
