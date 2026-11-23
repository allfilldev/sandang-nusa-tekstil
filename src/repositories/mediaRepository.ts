import type { SupabaseClient } from "@supabase/supabase-js";
import { MEDIA_BUCKET, getStoragePublicPrefix } from "@/lib/supabase/env";

// Mengubah URL publik Storage menjadi path di dalam bucket. Mengembalikan null untuk URL di luar bucket media
// (misalnya gambar bawaan di /images), sehingga berkas bawaan tidak pernah ikut terhapus.
export function storagePathFromUrl(url: string): string | null {
  const prefix = getStoragePublicPrefix();
  if (!prefix || !url.startsWith(prefix)) {
    return null;
  }
  const path = decodeURIComponent(url.slice(prefix.length).split("?")[0]);
  return path && !path.includes("..") ? path : null;
}

// Upaya terbaik: kegagalan hapus berkas lama tidak membatalkan penyimpanan data.
export async function removeMediaByUrls(db: SupabaseClient, urls: string[]): Promise<void> {
  const paths = urls.map(storagePathFromUrl).filter((path): path is string => path !== null);
  if (paths.length === 0) {
    return;
  }
  await db.storage.from(MEDIA_BUCKET).remove(paths);
}

// Hapus semua isi satu folder di bucket (dipakai untuk folder logo lama).
export async function removeMediaFolder(db: SupabaseClient, folder: string): Promise<void> {
  if (!folder || folder.includes("..")) {
    return;
  }
  const { data } = await db.storage.from(MEDIA_BUCKET).list(folder);
  const paths = (data ?? []).filter((item) => item.name).map((item) => `${folder}/${item.name}`);
  if (paths.length > 0) {
    await db.storage.from(MEDIA_BUCKET).remove(paths);
  }
}
