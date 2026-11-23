import type { Metadata } from "next";
import Link from "next/link";
import { DeleteArticleButton } from "@/components/admin/DeleteArticleButton";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  cardClass,
  labelClass,
  pageTitleClass,
  primaryButtonClass,
  secondaryButtonClass,
  tapLinkClass,
  textLinkClass,
} from "@/components/admin/adminStyles";
import { formatDate } from "@/lib/date";
import { requireAdminPage } from "@/lib/supabase/adminSession";
import { listArticleSummaries } from "@/repositories/adminArticleRepository";

export const metadata: Metadata = { title: "Artikel" };

interface ArticleAdminListProps {
  searchParams: Promise<{ q?: string; status?: string; hasil?: string }>;
}

const notices: Record<string, string> = {
  dihapus: "Artikel sudah dihapus.",
  "tidak-ada": "Artikel itu sudah tidak ada. Mungkin sudah dihapus dari tab lain.",
};

const statusOptions = [
  { value: "semua", label: "Semua" },
  { value: "terbit", label: "Terbit" },
  { value: "draf", label: "Draf" },
];

export default async function ArticleAdminListPage({ searchParams }: ArticleAdminListProps) {
  const session = await requireAdminPage();
  const { q = "", status = "semua", hasil } = await searchParams;
  const summaries = await listArticleSummaries(session.db);

  const query = q.trim().toLowerCase();
  const visible = summaries.filter((article) => {
    const matchesStatus =
      status === "terbit" ? article.status === "published" : status === "draf" ? article.status === "draft" : true;
    const matchesQuery = query === "" || article.title.toLowerCase().includes(query) || article.slug.includes(query);
    return matchesStatus && matchesQuery;
  });
  const notice = hasil ? notices[hasil] : undefined;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className={pageTitleClass}>Artikel</h1>
        <Link href="/admin/artikel/baru" className={primaryButtonClass}>
          Tulis artikel baru
        </Link>
      </div>

      {notice ? (
        <p role="status" className="mt-6 rounded-2xl bg-berhasil/10 p-4 font-bold text-berhasil">
          {notice}
        </p>
      ) : null}

      <search className="mt-6 block">
        <form method="get" className={`${cardClass} flex flex-wrap items-end gap-4`}>
          <div className="min-w-[14rem] flex-1">
            <label htmlFor="q" className={labelClass}>
              Cari judul atau alamat
            </label>
            <input
              id="q"
              name="q"
              type="search"
              defaultValue={q}
              autoComplete="off"
              enterKeyHint="search"
              className="field-control mt-1.5"
            />
          </div>
          <fieldset>
            <legend className={labelClass}>Tampilkan</legend>
            <div className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1">
              {statusOptions.map((option) => (
                <label key={option.value} className="inline-flex min-h-12 items-center gap-2 text-base font-semibold">
                  <input
                    type="radio"
                    name="status"
                    value={option.value}
                    defaultChecked={status === option.value || (option.value === "semua" && !["terbit", "draf"].includes(status))}
                    className="size-5 accent-nila"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>
          <button type="submit" className={secondaryButtonClass}>
            Cari
          </button>
        </form>
      </search>

      {summaries.length === 0 ? (
        <p className={`${cardClass} mt-6 text-lg`}>Belum ada artikel. Mulai dengan menulis artikel pertamamu.</p>
      ) : visible.length === 0 ? (
        <p className={`${cardClass} mt-6 text-lg`}>
          Tidak ada artikel yang cocok.{" "}
          <Link href="/admin/artikel" className={textLinkClass}>
            Tampilkan semua artikel
          </Link>
        </p>
      ) : (
        <ul className="mt-6 space-y-4" aria-label="Daftar artikel">
          {visible.map((article) => (
            <li key={article.id} className={`${cardClass} flex flex-wrap items-center justify-between gap-x-6 gap-y-4`}>
              <div className="min-w-0 flex-1 basis-72">
                <p className="break-words font-display text-lg font-bold leading-snug">{article.title || "Tanpa judul"}</p>
                <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.9375rem] text-nila/80">
                  <StatusBadge status={article.status} />
                  <span>Diubah {formatDate(article.updatedAt)}</span>
                  <span className="break-all">/artikel/{article.slug}</span>
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link href={`/admin/artikel/${article.id}`} className={`${primaryButtonClass} min-h-11 px-5 py-2`}>
                  Ubah<span className="sr-only"> artikel {article.title}</span>
                </Link>
                {article.status === "published" ? (
                  <Link href={`/artikel/${article.slug}`} target="_blank" rel="noopener" className={tapLinkClass}>
                    Lihat<span className="sr-only"> artikel {article.title} (tab baru)</span>
                  </Link>
                ) : (
                  <Link href={`/admin/artikel/${article.id}/pratinjau`} target="_blank" rel="noopener" className={tapLinkClass}>
                    Pratinjau<span className="sr-only"> artikel {article.title} (tab baru)</span>
                  </Link>
                )}
                <DeleteArticleButton id={article.id} title={article.title} isPublished={article.status === "published"} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
