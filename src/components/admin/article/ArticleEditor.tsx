"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { saveArticleAction } from "@/app/admin/actions/articles";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { DeleteArticleButton } from "@/components/admin/DeleteArticleButton";
import { FaqEditor } from "@/components/admin/article/FaqEditor";
import { ImageUploadField } from "@/components/admin/article/ImageUploadField";
import { MarkdownEditor } from "@/components/admin/article/MarkdownEditor";
import { QualityPanel } from "@/components/admin/article/QualityPanel";
import { SerpPreview } from "@/components/admin/article/SerpPreview";
import { cardClass, labelClass, secondaryButtonClass, sectionHeadingClass, tapLinkClass } from "@/components/admin/adminStyles";
import { AdminForm } from "@/components/admin/form/AdminForm";
import { TextAreaField, TextField } from "@/components/admin/form/FormFields";
import { SubmitButton } from "@/components/admin/form/SubmitButton";
import type { ArticleContent, ArticleStatus, ManagedArticle } from "@/domain/article";
import { initialFormState } from "@/domain/formState";
import type { FormState } from "@/domain/formState";
import { checkArticleQuality, getMetaTitleLimit, qualityRules } from "@/lib/articleQuality";
import { defaultAuthorId, defaultImageSize, parseArticleForm } from "@/lib/articleForm";
import { slugify } from "@/lib/slug";

interface RelatedOption {
  slug: string;
  title: string;
}

interface ArticleEditorProps {
  article: ManagedArticle | null;
  relatedOptions: RelatedOption[];
  // Pesan awal setelah artikel baru dibuat (dari parameter ?hasil=).
  notice?: "draf" | "terbit";
}

const fieldLabels: Record<string, string> = {
  title: "Judul artikel",
  slug: "Alamat artikel",
  imageUrl: "Gambar utama",
  imageAlt: "Teks pengganti gambar",
  body: "Isi artikel",
  faqs: "Tanya jawab",
  metaTitle: "Judul di Google",
  metaDescription: "Deskripsi di Google",
};

const noticeMessages = {
  draf: "Draf tersimpan. Kamu sekarang berada di halaman pengeditan artikel.",
  terbit: "Artikel sudah terbit di situs.",
} as const;

function emptyContent(): ArticleContent {
  return {
    slug: "",
    title: "",
    metaTitle: "",
    metaDescription: "",
    keyword: "",
    summary: "",
    lead: "",
    body: "",
    faqHeading: "Apa lagi yang sering ditanyakan?",
    faqs: [],
    closingHeading: "Langkah praktis berikutnya",
    closing: "",
    image: { src: "", alt: "", caption: "", ...defaultImageSize },
    authorId: defaultAuthorId,
    relatedSlugs: [],
  };
}

function Section({ number, title, children, id }: { number: number; title: string; children: ReactNode; id: string }) {
  return (
    <section aria-labelledby={id} className={`${cardClass} space-y-5`}>
      <h2 id={id} className={sectionHeadingClass}>
        <span className="mr-2 inline-flex size-8 items-center justify-center rounded-full bg-nila text-base text-benang" aria-hidden="true">
          {number}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export function ArticleEditor({ article, relatedOptions, notice }: ArticleEditorProps) {
  const initial: ArticleContent = article ?? emptyContent();
  const everPublished = Boolean(article?.publishedAt);

  const initialState: FormState = notice
    ? { status: "success", message: noticeMessages[notice], fieldErrors: {}, submissionId: 1 }
    : initialFormState;
  const [state, dispatch, pending] = useActionState(saveArticleAction, initialState);

  const formRef = useRef<HTMLFormElement | null>(null);
  const publishSubmitRef = useRef<HTMLButtonElement>(null);
  const unpublishSubmitRef = useRef<HTMLButtonElement>(null);
  const suggestionsDialogRef = useRef<HTMLDialogElement>(null);
  const unpublishDialogRef = useRef<HTMLDialogElement>(null);
  const unlockDialogRef = useRef<HTMLDialogElement>(null);
  const recomputeTimer = useRef<number | undefined>(undefined);

  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  const [slugTouched, setSlugTouched] = useState(Boolean(article));
  const [slugUnlocked, setSlugUnlocked] = useState(false);
  const [version, setVersion] = useState(article?.version ?? "");
  const [status, setStatus] = useState<ArticleStatus>(article?.status ?? "draft");
  const [savedSlug, setSavedSlug] = useState(article?.slug ?? "");
  const [dirty, setDirty] = useState(false);
  const [content, setContent] = useState<ArticleContent>(initial);

  const report = checkArticleQuality(content);
  const slugLocked = everPublished && !slugUnlocked;
  const metaTitleLimit = getMetaTitleLimit();

  // Hitung ulang cek kualitas setelah pengguna berhenti mengetik sebentar, bukan di setiap ketukan.
  const scheduleRecompute = () => {
    window.clearTimeout(recomputeTimer.current);
    recomputeTimer.current = window.setTimeout(() => {
      if (formRef.current) {
        setContent(parseArticleForm(new FormData(formRef.current)).content);
      }
    }, 350);
  };

  const handleInput = () => {
    setDirty(true);
    scheduleRecompute();
  };

  useEffect(() => () => window.clearTimeout(recomputeTimer.current), []);

  // Setelah berhasil menyimpan: pakai versi baru untuk simpan berikutnya dan anggap tidak ada perubahan tertunda.
  // Disesuaikan saat render (bukan di effect) sesuai panduan React untuk state turunan dari jawaban action.
  const [handledState, setHandledState] = useState(state);
  if (state !== handledState) {
    setHandledState(state);
    if (state.status === "success" && state.data) {
      setVersion(state.data.version);
      setStatus(state.data.status === "published" ? "published" : "draft");
      setSavedSlug(state.data.slug);
      setDirty(false);
    }
  }

  useEffect(() => {
    if (!dirty) {
      return;
    }
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const submitWith = (button: HTMLButtonElement | null) => {
    if (formRef.current && button) {
      formRef.current.requestSubmit(button);
    }
  };

  const handlePublish = () => {
    const form = formRef.current;
    if (!form || !form.reportValidity()) {
      return;
    }
    const current = checkArticleQuality(parseArticleForm(new FormData(form)).content);
    // Kalau ada yang wajib kurang, kirim saja: server menandai isian yang kurang dengan pesan jelas.
    if (current.missingRequired.length > 0 || current.openSuggestions.length === 0) {
      submitWith(publishSubmitRef.current);
      return;
    }
    suggestionsDialogRef.current?.showModal();
  };

  const isPublished = status === "published";
  const publicUrl = savedSlug ? `/artikel/${savedSlug}` : "";

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
      <div className="min-w-0">
        <AdminForm
          action={dispatch}
          state={state}
          pending={pending}
          fieldLabels={fieldLabels}
          onInput={handleInput}
          formRef={formRef}
          aria-labelledby="editor-title"
        >
          <input type="hidden" name="id" value={article?.id ?? ""} />
          <input type="hidden" name="version" value={version} />
          <input type="hidden" name="authorId" value={initial.authorId} />
          <input type="hidden" name="slugUnlocked" value={slugUnlocked ? "1" : "0"} />
          <button ref={publishSubmitRef} type="submit" name="intent" value="publish" hidden tabIndex={-1} aria-hidden="true" />
          <button ref={unpublishSubmitRef} type="submit" name="intent" value="unpublish" hidden tabIndex={-1} aria-hidden="true" />

          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <Link href="/admin/artikel" className={tapLinkClass}>
                &larr; Kembali ke daftar artikel
              </Link>
              <h1 id="editor-title" className="mt-2 font-display text-3xl font-extrabold leading-tight md:text-4xl">
                {article ? "Ubah artikel" : "Tulis artikel baru"}
              </h1>
            </div>
            <p className="text-[0.9375rem] font-bold">
              {isPublished ? (
                <span className="text-berhasil">Status: terbit</span>
              ) : (
                <span>Status: draf (belum tampil di situs)</span>
              )}
            </p>
          </div>

          <details className={`${cardClass} mb-6 lg:hidden`}>
            <summary className="min-h-11 cursor-pointer font-display text-lg font-extrabold">
              Cek kualitas ({report.missingRequired.length} wajib kurang, {report.openSuggestions.length} saran)
            </summary>
            <div className="mt-4">
              <QualityPanel report={report} headingId="quality-mobile" />
            </div>
          </details>

          <div className="space-y-6">
            <Section number={1} title="Judul dan alamat" id="section-title">
              <TextField
                name="title"
                label="Judul artikel"
                required
                maxLength={200}
                value={title}
                onValueChange={(next) => {
                  setTitle(next);
                  if (!slugTouched && !slugLocked) {
                    setSlug(slugify(next));
                  }
                }}
                error={state.fieldErrors.title}
                errorText="Isi judul artikel."
              />
              <div>
                <TextField
                  name="slug"
                  label="Alamat artikel"
                  hint={
                    <>
                      Bagian akhir alamat halaman: <strong>/artikel/{slug || "alamat-artikel"}</strong>. Dibuat otomatis dari judul.
                    </>
                  }
                  value={slug}
                  readOnly={slugLocked}
                  maxLength={100}
                  inputMode="text"
                  spellCheck={false}
                  onValueChange={(next) => {
                    setSlugTouched(true);
                    setSlug(next);
                  }}
                  error={state.fieldErrors.slug}
                  errorText="Pakai huruf kecil, angka, dan tanda hubung saja."
                />
                {slugLocked ? (
                  <p className="mt-2 text-[0.9375rem] leading-snug">
                    Alamat dikunci karena artikel sudah pernah terbit dan mungkin sudah dibagikan.{" "}
                    <button
                      type="button"
                      onClick={() => unlockDialogRef.current?.showModal()}
                      className="font-bold underline underline-offset-4"
                    >
                      Buka kunci alamat
                    </button>
                  </p>
                ) : null}
              </div>
            </Section>

            <Section number={2} title="Gambar utama" id="section-image">
              <ImageUploadField
                initial={initial.image}
                errors={{ imageUrl: state.fieldErrors.imageUrl, imageAlt: state.fieldErrors.imageAlt }}
                onChange={handleInput}
              />
            </Section>

            <Section number={3} title="Isi artikel" id="section-body">
              <TextAreaField
                name="lead"
                label="Paragraf pembuka"
                hint="Jawab pertanyaan utama pembaca langsung di sini, dalam 50 sampai 100 kata."
                rows={4}
                maxLength={2000}
                defaultValue={initial.lead}
                counter={{ unit: "kata", ...qualityRules.leadWords }}
              />
              <MarkdownEditor
                name="body"
                label="Isi artikel"
                hint="Gunakan tombol di bawah untuk judul bagian, tebal, tautan, daftar, dan tabel. Klik Pratinjau untuk melihat hasilnya."
                defaultValue={initial.body}
                error={state.fieldErrors.body}
              />
              <TextField name="closingHeading" label="Judul bagian penutup" maxLength={200} defaultValue={initial.closingHeading} />
              <TextAreaField
                name="closing"
                label="Paragraf penutup"
                hint="Ringkas langkah berikutnya untuk pembaca, dalam 50 sampai 100 kata."
                rows={4}
                maxLength={2000}
                defaultValue={initial.closing}
                counter={{ unit: "kata", ...qualityRules.closingWords }}
              />
            </Section>

            <Section number={4} title="Tanya jawab" id="section-faq">
              <TextField name="faqHeading" label="Judul bagian tanya jawab" maxLength={200} defaultValue={initial.faqHeading} />
              <FaqEditor initialFaqs={initial.faqs} error={state.fieldErrors.faqs} onChange={handleInput} />
            </Section>

            <Section number={5} title="Tampil di Google" id="section-seo">
              <TextField
                name="metaTitle"
                label="Judul di Google"
                hint="Nama situs ditambahkan otomatis di belakangnya."
                required
                maxLength={120}
                defaultValue={initial.metaTitle}
                counter={{ unit: "karakter", max: metaTitleLimit }}
                error={state.fieldErrors.metaTitle}
                errorText="Isi judul di Google."
              />
              <TextAreaField
                name="metaDescription"
                label="Deskripsi di Google"
                hint="Satu atau dua kalimat yang mengajak orang membuka artikel."
                rows={3}
                maxLength={300}
                defaultValue={initial.metaDescription}
                counter={{ unit: "karakter", ...qualityRules.metaDescription }}
                error={state.fieldErrors.metaDescription}
                errorText="Isi deskripsi di Google."
              />
              <TextField
                name="keyword"
                label="Kata kunci utama"
                hint="Frasa yang paling mungkin diketik orang untuk mencari artikel ini."
                maxLength={120}
                defaultValue={initial.keyword}
              />
              <TextAreaField
                name="summary"
                label="Ringkasan satu kalimat"
                hint="Tampil di kartu artikel dan ringkasan situs. Kalau kosong, memakai deskripsi di Google."
                rows={2}
                maxLength={300}
                defaultValue={initial.summary}
              />
              <SerpPreview metaTitle={content.metaTitle} metaDescription={content.metaDescription} slug={slug} />
            </Section>

            <Section number={6} title="Artikel terkait" id="section-related">
              {relatedOptions.length === 0 ? (
                <p className="text-base text-nila/80">Belum ada artikel terbit lain yang bisa ditautkan.</p>
              ) : (
                <fieldset>
                  <legend className={labelClass}>Pilih artikel yang cocok dibaca setelah ini</legend>
                  <div className="mt-2 space-y-1">
                    {relatedOptions.map((option) => (
                      <label key={option.slug} className="flex min-h-12 items-center gap-3 text-base font-semibold">
                        <input
                          type="checkbox"
                          name="relatedSlugs"
                          value={option.slug}
                          defaultChecked={initial.relatedSlugs.includes(option.slug)}
                          className="size-5 accent-nila"
                        />
                        {option.title}
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}
            </Section>
          </div>

          <div className="sticky bottom-0 z-10 -mx-4 mt-8 border-t border-nila/15 bg-benang/95 px-4 py-4 backdrop-blur md:mx-0 md:rounded-3xl md:border">
            <div className="flex flex-wrap items-center gap-3">
              <SubmitButton name="intent" value="save" variant="secondary">
                {isPublished ? "Simpan perubahan" : "Simpan draf"}
              </SubmitButton>
              {isPublished ? (
                <button type="button" onClick={() => unpublishDialogRef.current?.showModal()} className={secondaryButtonClass}>
                  Batalkan terbit
                </button>
              ) : (
                <button
                  type="button"
                  disabled={pending}
                  onClick={handlePublish}
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-nila px-6 py-3 font-display text-base font-bold text-benang transition-colors hover:bg-nila/85 disabled:cursor-wait disabled:opacity-60"
                >
                  {pending ? "Menyimpan..." : "Terbitkan"}
                </button>
              )}
              <p className="text-[0.9375rem]" aria-hidden={!dirty}>
                {dirty ? "Ada perubahan yang belum disimpan." : ""}
              </p>
              {isPublished && publicUrl ? (
                <Link href={publicUrl} target="_blank" rel="noopener" className={`${tapLinkClass} ml-auto`}>
                  Lihat di situs<span className="sr-only"> (tab baru)</span>
                </Link>
              ) : article ? (
                <Link
                  href={`/admin/artikel/${article.id}/pratinjau`}
                  target="_blank"
                  rel="noopener"
                  className={`${tapLinkClass} ml-auto`}
                >
                  Pratinjau halaman<span className="sr-only"> (tab baru)</span>
                </Link>
              ) : null}
            </div>
          </div>
        </AdminForm>

        {article ? (
          <section className={`${cardClass} mt-8`} aria-labelledby="danger-zone">
            <h2 id="danger-zone" className={sectionHeadingClass}>
              Hapus artikel
            </h2>
            <p className="mt-2 max-w-[60ch] text-base text-nila/80">
              Menghapus artikel juga menghapus gambar utamanya dan tidak bisa dibatalkan.
            </p>
            <div className="mt-4">
              <DeleteArticleButton id={article.id} title={article.title} isPublished={isPublished} />
            </div>
          </section>
        ) : null}

        <ConfirmDialog
          dialogRef={suggestionsDialogRef}
          title="Masih ada saran SEO. Tetap terbitkan?"
          confirmLabel="Tetap terbitkan"
          cancelLabel="Kembali memperbaiki"
          onConfirm={() => submitWith(publishSubmitRef.current)}
          description={
            <>
              <p>Artikel sudah memenuhi syarat wajib, tetapi {report.openSuggestions.length} saran berikut belum terpenuhi:</p>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                {report.openSuggestions.map((check) => (
                  <li key={check.id}>
                    {check.label}. <span className="text-nila/75">{check.detail}</span>
                  </li>
                ))}
              </ul>
            </>
          }
        />
        <ConfirmDialog
          dialogRef={unpublishDialogRef}
          title="Batalkan terbit?"
          confirmLabel="Ya, batalkan terbit"
          cancelLabel="Tetap terbit"
          onConfirm={() => submitWith(unpublishSubmitRef.current)}
          description="Artikel akan disembunyikan dari situs dan kembali menjadi draf. Isinya tetap tersimpan, dan bisa diterbitkan lagi kapan saja."
        />
        <ConfirmDialog
          dialogRef={unlockDialogRef}
          title="Buka kunci alamat artikel?"
          confirmLabel="Ya, buka kunci"
          cancelLabel="Tetap dikunci"
          tone="danger"
          onConfirm={() => {
            setSlugUnlocked(true);
            setSlugTouched(true);
          }}
          description="Kalau alamat diganti, tautan lama ke artikel ini (di Google, media sosial, atau pesan yang sudah dibagikan) akan mati. Tidak ada pengalihan otomatis."
        />
      </div>

      <aside aria-label="Cek kualitas artikel" className={`${cardClass} hidden lg:sticky lg:top-6 lg:block lg:max-h-[calc(100dvh-3rem)] lg:overflow-y-auto`}>
        <QualityPanel report={report} headingId="quality-desktop" />
      </aside>
    </div>
  );
}
