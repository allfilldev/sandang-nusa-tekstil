import type { SupabaseClient } from "@supabase/supabase-js";
import { siteConfig } from "@/data/site";
import { logoFileNames, logoFolderPattern, logoHeaderPattern } from "@/lib/logoFiles";
import { getStoragePublicPrefix } from "@/lib/supabase/env";
import { readBrandingForAdmin, updateSiteSettings } from "@/repositories/adminBrandingRepository";
import { removeMediaFolder } from "@/repositories/mediaRepository";

export interface LogoUploadInput {
  folder: string;
  logoUrl: string;
  faviconUrl: string;
  appleIconUrl: string;
  icon192Url: string;
  icon512Url: string;
  width: number;
  height: number;
}

export interface SaveLogoInput {
  alt: string;
  showBrandName: boolean;
  // Diisi kalau admin memilih logo baru di sesi ini.
  upload: LogoUploadInput | null;
}

export type SaveLogoOutcome =
  | { kind: "ok" }
  | { kind: "invalid"; message: string; fieldErrors: Record<string, string> };

function isExpectedUrl(url: string, folder: string, fileMatches: (name: string) => boolean): boolean {
  const prefix = getStoragePublicPrefix();
  if (!prefix) {
    return false;
  }
  const expectedStart = `${prefix}${folder}/`;
  return url.startsWith(expectedStart) && fileMatches(url.slice(expectedStart.length));
}

function validateUpload(upload: LogoUploadInput): string | null {
  if (!logoFolderPattern.test(upload.folder)) {
    return "Folder logo tidak valid. Pilih ulang logonya.";
  }
  const exact = (name: string) => (candidate: string) => candidate === name;
  const valid =
    isExpectedUrl(upload.logoUrl, upload.folder, (name) => logoHeaderPattern.test(name)) &&
    isExpectedUrl(upload.faviconUrl, upload.folder, exact(logoFileNames.favicon)) &&
    isExpectedUrl(upload.appleIconUrl, upload.folder, exact(logoFileNames.appleIcon)) &&
    isExpectedUrl(upload.icon192Url, upload.folder, exact(logoFileNames.icon192)) &&
    isExpectedUrl(upload.icon512Url, upload.folder, exact(logoFileNames.icon512));
  if (!valid) {
    return "Alamat berkas logo tidak dikenali. Pilih ulang logonya.";
  }
  if (!(upload.width > 0 && upload.width <= 2000 && upload.height > 0 && upload.height <= 2000)) {
    return "Ukuran logo tidak valid. Pilih ulang logonya.";
  }
  return null;
}

export async function saveLogoSettings(db: SupabaseClient, input: SaveLogoInput): Promise<SaveLogoOutcome> {
  const alt = input.alt.trim().slice(0, 200) || siteConfig.name;

  if (input.upload) {
    const problem = validateUpload(input.upload);
    if (problem) {
      return { kind: "invalid", message: problem, fieldErrors: {} };
    }
  }

  const previous = await readBrandingForAdmin(db);
  await updateSiteSettings(db, {
    logo_alt: alt,
    show_brand_name: input.showBrandName,
    ...(input.upload
      ? {
          logo_url: input.upload.logoUrl,
          logo_width: input.upload.width,
          logo_height: input.upload.height,
          favicon_url: input.upload.faviconUrl,
          apple_icon_url: input.upload.appleIconUrl,
          icon_192_url: input.upload.icon192Url,
          icon_512_url: input.upload.icon512Url,
          logo_folder: input.upload.folder,
        }
      : {}),
  });

  if (input.upload && previous.logoFolder && previous.logoFolder !== input.upload.folder) {
    await removeMediaFolder(db, previous.logoFolder);
  }
  return { kind: "ok" };
}

export async function resetLogoSettings(db: SupabaseClient): Promise<void> {
  const previous = await readBrandingForAdmin(db);
  await updateSiteSettings(db, {
    logo_url: null,
    logo_width: null,
    logo_height: null,
    favicon_url: null,
    apple_icon_url: null,
    icon_192_url: null,
    icon_512_url: null,
    logo_folder: null,
    logo_alt: "",
    show_brand_name: true,
  });
  if (previous.logoFolder) {
    await removeMediaFolder(db, previous.logoFolder);
  }
}
