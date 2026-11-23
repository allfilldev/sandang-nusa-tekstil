import { createBrowserSupabase } from "@/lib/supabase/browser";
import { MEDIA_BUCKET } from "@/lib/supabase/env";

// Mengunggah berkas ke bucket "media" dari browser dengan sesi admin. Aturan siapa yang boleh menulis
// dijaga oleh kebijakan Storage di database (supabase/migrations/0001_cms.sql), bukan oleh kode ini.

export async function uploadMedia(path: string, blob: Blob): Promise<string> {
  const supabase = createBrowserSupabase();
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, blob, {
    contentType: blob.type,
    cacheControl: "31536000",
    upsert: false,
  });

  if (error) {
    // Nama berkas memuat hash isinya, jadi berkas yang sudah ada isinya sama persis.
    const status = (error as { statusCode?: string | number }).statusCode;
    const alreadyExists = String(status) === "409" || /already exists/i.test(error.message);
    if (!alreadyExists) {
      throw new Error("Gambar belum bisa diunggah. Periksa koneksi internet, atau masuk ulang lalu coba lagi.");
    }
  }

  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}
