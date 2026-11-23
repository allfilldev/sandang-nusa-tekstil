export function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*|_`-]/g, " ");
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// Menghitung kata yang benar-benar dibaca pengunjung: tanda Markdown dibuang, kata bertanda hubung
// ("tenun-rajut") dihitung satu kata, dan potongan yang hanya berisi simbol (garis tabel, tanda poin) tidak dihitung.
export function countReadableWords(markdown: string): number {
  const readable = markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`|]/g, " ");
  return readable
    .split(/\s+/)
    .filter((token) => /[\p{L}\p{N}]/u.test(token)).length;
}

export function estimateReadingMinutes(text: string): number {
  return Math.max(1, Math.ceil(countWords(stripMarkdown(text)) / 200));
}
