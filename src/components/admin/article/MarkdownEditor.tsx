"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { hintClass, labelClass, primaryButtonClass, secondaryButtonClass } from "@/components/admin/adminStyles";
import { ArticleMarkdown } from "@/components/article/ArticleMarkdown";
import { compressPhoto, shortHash, validateImageFile, acceptedImageTypes } from "@/lib/imageResize";
import { headingEdit, imageEdit, linkEdit, listEdit, tableEdit, wrapEdit } from "@/lib/markdownEdit";
import type { TextEdit } from "@/lib/markdownEdit";
import { uploadMedia } from "@/lib/storageUpload";

interface MarkdownEditorProps {
  name: string;
  label: string;
  hint?: ReactNode;
  defaultValue: string;
  rows?: number;
  error?: string;
}

type EditMaker = (value: string, start: number, end: number) => TextEdit;

const toolButtonClass =
  "inline-flex min-h-11 items-center rounded-full border-2 border-nila/30 bg-benang px-4 font-display text-[0.9375rem] font-bold text-nila transition-colors hover:border-nila hover:bg-nila-pudar/50";

export function MarkdownEditor({ name, label, hint, defaultValue, rows = 18, error }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState(defaultValue);
  const [mode, setMode] = useState<"write" | "preview">("write");
  const [imageDialog, setImageDialog] = useState<{ start: number; end: number } | null>(null);
  const hintId = hint ? `${name}-hint` : undefined;
  const errorId = `${name}-error`;

  // Menerapkan perubahan lewat execCommand supaya tombol Urungkan (Ctrl+Z) browser tetap bekerja.
  const applyEdit = (make: EditMaker, selection?: { start: number; end: number }) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }
    textarea.focus();
    const start = selection?.start ?? textarea.selectionStart;
    const end = selection?.end ?? textarea.selectionEnd;
    const edit = make(textarea.value, start, end);
    textarea.setSelectionRange(edit.start, edit.end);
    const inserted = document.execCommand("insertText", false, edit.replacement);
    if (!inserted) {
      textarea.setRangeText(edit.replacement, edit.start, edit.end, "end");
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
    }
    textarea.setSelectionRange(edit.selectStart, edit.selectEnd);
  };

  const tools: { label: string; accessibleName: string; make: EditMaker }[] = [
    { label: "H2 Judul bagian", accessibleName: "Jadikan baris ini judul bagian (H2)", make: (v, s, e) => headingEdit(v, s, e, 2) },
    { label: "H3 Anak judul", accessibleName: "Jadikan baris ini anak judul (H3)", make: (v, s, e) => headingEdit(v, s, e, 3) },
    { label: "Tebal", accessibleName: "Tebalkan teks terpilih", make: (v, s, e) => wrapEdit(v, s, e, "**", "teks tebal") },
    { label: "Tautan", accessibleName: "Buat tautan dari teks terpilih", make: linkEdit },
    { label: "Poin", accessibleName: "Jadikan daftar poin", make: (v, s, e) => listEdit(v, s, e, false) },
    { label: "Nomor", accessibleName: "Jadikan daftar bernomor", make: (v, s, e) => listEdit(v, s, e, true) },
    { label: "Tabel", accessibleName: "Sisipkan tabel", make: tableEdit },
  ];

  return (
    <div className="field-group">
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
      {hint ? (
        <span id={hintId} className={hintClass}>
          {hint}
        </span>
      ) : null}

      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="Alat format teks" className="flex flex-wrap gap-2">
          {tools.map((tool) => (
            <button
              key={tool.label}
              type="button"
              aria-label={tool.accessibleName}
              disabled={mode === "preview"}
              onClick={() => applyEdit(tool.make)}
              className={`${toolButtonClass} disabled:opacity-50`}
            >
              {tool.label}
            </button>
          ))}
          <button
            type="button"
            disabled={mode === "preview"}
            onClick={() => {
              const textarea = textareaRef.current;
              setImageDialog({ start: textarea?.selectionStart ?? 0, end: textarea?.selectionEnd ?? 0 });
            }}
            className={`${toolButtonClass} disabled:opacity-50`}
          >
            Gambar
          </button>
        </div>
        <div role="group" aria-label="Mode tampilan isi" className="flex gap-2">
          <button
            type="button"
            aria-pressed={mode === "write"}
            onClick={() => setMode("write")}
            className={`${toolButtonClass} ${mode === "write" ? "border-nila bg-nila text-benang hover:bg-nila" : ""}`}
          >
            Tulis
          </button>
          <button
            type="button"
            aria-pressed={mode === "preview"}
            onClick={() => setMode("preview")}
            className={`${toolButtonClass} ${mode === "preview" ? "border-nila bg-nila text-benang hover:bg-nila" : ""}`}
          >
            Pratinjau
          </button>
        </div>
      </div>

      <textarea
        ref={textareaRef}
        id={name}
        name={name}
        rows={rows}
        hidden={mode === "preview"}
        defaultValue={defaultValue}
        onChange={(event) => setValue(event.currentTarget.value)}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={[hintId, error ? errorId : null].filter(Boolean).join(" ") || undefined}
        data-error={errorId}
        data-server-error={error ? "" : undefined}
        spellCheck
        className="field-control mt-3 font-mono text-[0.9375rem] leading-relaxed"
      />

      {mode === "preview" ? (
        <div className="mt-3 rounded-2xl border border-nila/20 bg-benang p-5 font-serif text-[1.1875rem] leading-[1.7]">
          {value.trim() ? <ArticleMarkdown content={value} /> : <p className="text-nila/70">Belum ada isi untuk ditampilkan.</p>}
        </div>
      ) : null}

      <span id={errorId} className="field-error" data-default="Isi artikel belum sesuai." data-server={error ? "" : undefined}>
        {error ?? "Isi artikel belum sesuai."}
      </span>

      {imageDialog
        ? createPortal(
            <InsertImageDialog
              onClose={() => setImageDialog(null)}
              onInsert={(url, alt, caption) => {
                const selection = imageDialog;
                setImageDialog(null);
                // Tunggu dialog tertutup agar fokus kembali ke kotak isi sebelum teks disisipkan.
                window.setTimeout(() => applyEdit((v, s, e) => imageEdit(v, s, e, url, alt, caption), selection), 0);
              }}
            />,
            document.body,
          )
        : null}
    </div>
  );
}

interface InsertImageDialogProps {
  onClose: () => void;
  onInsert: (url: string, alt: string, caption: string) => void;
}

// Dialog di luar <form> artikel (lewat portal) supaya isiannya tidak ikut terkirim dan Enter tidak menyimpan artikel.
function InsertImageDialog({ onClose, onInsert }: InsertImageDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState("");

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const choose = (selected: File | undefined) => {
    if (!selected) {
      return;
    }
    const invalid = validateImageFile(selected);
    setProblem(invalid ?? "");
    setFile(invalid ? null : selected);
  };

  const submit = async () => {
    if (!file) {
      setProblem("Pilih gambar dulu.");
      return;
    }
    if (!alt.trim()) {
      setProblem("Isi teks pengganti gambar.");
      return;
    }
    setBusy(true);
    setProblem("");
    try {
      const resized = await compressPhoto(file);
      const hash = await shortHash(resized.blob);
      const url = await uploadMedia(`articles/${hash}.${resized.extension}`, resized.blob);
      onInsert(url, alt.trim(), caption.trim());
    } catch (error) {
      setProblem(error instanceof Error ? error.message : "Gambar belum bisa diproses. Coba berkas lain.");
      setBusy(false);
    }
  };

  return (
    <dialog ref={dialogRef} aria-labelledby="insert-image-title" onClose={onClose} className="admin-dialog">
      <h2 id="insert-image-title" className="font-display text-2xl font-extrabold leading-tight">
        Sisipkan gambar ke isi artikel
      </h2>
      <div className="mt-4 space-y-4">
        <div>
          <button type="button" onClick={() => fileInputRef.current?.click()} className={secondaryButtonClass}>
            {file ? "Ganti gambar" : "Pilih gambar"}
          </button>
          <span className="ml-3 break-all text-base">{file ? file.name : "Belum ada gambar dipilih"}</span>
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedImageTypes.join(",")}
            tabIndex={-1}
            aria-hidden="true"
            className="hidden"
            onChange={(event) => choose(event.currentTarget.files?.[0])}
          />
        </div>
        <div>
          <label htmlFor="insert-image-alt" className={labelClass}>
            Teks pengganti gambar
          </label>
          <input
            id="insert-image-alt"
            type="text"
            value={alt}
            onChange={(event) => setAlt(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void submit();
              }
            }}
            maxLength={300}
            className="field-control mt-1.5"
          />
        </div>
        <div>
          <label htmlFor="insert-image-caption" className={labelClass}>
            Keterangan (boleh dikosongkan)
          </label>
          <input
            id="insert-image-caption"
            type="text"
            value={caption}
            onChange={(event) => setCaption(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void submit();
              }
            }}
            maxLength={300}
            className="field-control mt-1.5"
          />
        </div>
        <p role="alert" className={problem ? "font-bold text-galat" : "sr-only"}>
          {problem}
        </p>
      </div>
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <button type="button" onClick={() => dialogRef.current?.close()} className={secondaryButtonClass}>
          Batal
        </button>
        <button type="button" disabled={busy} onClick={() => void submit()} className={primaryButtonClass}>
          {busy ? "Mengunggah..." : "Sisipkan gambar"}
        </button>
      </div>
    </dialog>
  );
}
