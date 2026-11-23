import type { ArticleStatus } from "@/domain/article";

interface StatusBadgeProps {
  status: ArticleStatus;
}

// Status dibedakan lewat teks dan tanda, tidak hanya warna.
export function StatusBadge({ status }: StatusBadgeProps) {
  if (status === "published") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-berhasil/10 px-3 py-1 text-sm font-bold text-berhasil">
        <span aria-hidden="true">&#10003;</span>
        Terbit
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-kunyit/30 px-3 py-1 text-sm font-bold text-nila">
      <span aria-hidden="true">&#9998;</span>
      Draf
    </span>
  );
}
