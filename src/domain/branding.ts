export interface SiteBranding {
  logoUrl: string | null;
  logoWidth: number;
  logoHeight: number;
  logoAlt: string;
  faviconUrl: string | null;
  appleIconUrl: string | null;
  icon192Url: string | null;
  icon512Url: string | null;
  // Folder di Storage yang berisi semua ukuran logo, dipakai untuk membersihkan berkas lama.
  logoFolder: string | null;
  showBrandName: boolean;
  version: string;
}

export const defaultBranding: SiteBranding = {
  logoUrl: null,
  logoWidth: 0,
  logoHeight: 0,
  logoAlt: "",
  faviconUrl: null,
  appleIconUrl: null,
  icon192Url: null,
  icon512Url: null,
  logoFolder: null,
  showBrandName: true,
  version: "",
};
