export const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const maxSlugLength = 100;

export function isValidSlug(slug: string): boolean {
  return slug.length > 0 && slug.length <= maxSlugLength && slugPattern.test(slug);
}

// Mengubah judul menjadi alamat artikel: huruf kecil, tanpa aksen, kata dipisah tanda hubung.
export function slugify(text: string, maxLength = 80): string {
  const base = text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " dan ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (base.length <= maxLength) {
    return base;
  }
  const cut = base.slice(0, maxLength);
  const lastDash = cut.lastIndexOf("-");
  return (lastDash > 20 ? cut.slice(0, lastDash) : cut).replace(/-+$/, "");
}
