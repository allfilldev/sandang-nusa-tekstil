import { revalidatePath, updateTag } from "next/cache";
import { CMS_CACHE_TAG } from "@/lib/supabase/env";

// Menyegarkan halaman publik setelah admin menyimpan sesuatu. Hanya boleh dipanggil dari Server Action
// (updateTag hanya berlaku di sana). Pengunjung langsung melihat perubahan pada permintaan berikutnya.

export function refreshArticlePages(slugs: string[]): void {
  updateTag(CMS_CACHE_TAG);
  revalidatePath("/");
  revalidatePath("/artikel");
  for (const slug of new Set(slugs.filter(Boolean))) {
    revalidatePath(`/artikel/${slug}`);
  }
  revalidatePath("/sitemap.xml");
  revalidatePath("/feed.xml");
  revalidatePath("/llms.txt");
}

// Logo tampil di setiap halaman (header, footer, ikon tab, manifest), jadi seluruh situs disegarkan.
export function refreshWholeSite(): void {
  updateTag(CMS_CACHE_TAG);
  revalidatePath("/", "layout");
  revalidatePath("/manifest.webmanifest");
}
