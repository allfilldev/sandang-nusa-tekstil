// Nama berkas turunan logo di dalam satu folder logo/<hash>. Dipakai browser (saat mengunggah)
// dan server (saat memvalidasi alamat yang akan disimpan), supaya keduanya selalu sepakat.

export const logoFolderPattern = /^logo\/[a-f0-9]{10}$/;
export const logoHeaderPattern = /^header\.(webp|png)$/;

export const logoFileNames = {
  favicon: "favicon.png",
  appleIcon: "apple-icon.png",
  icon192: "icon-192.png",
  icon512: "icon-512.png",
} as const;
