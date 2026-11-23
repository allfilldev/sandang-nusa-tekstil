"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { DragEvent } from "react";
import { hintClass, labelClass, secondaryButtonClass } from "@/components/admin/adminStyles";
import { TextField } from "@/components/admin/form/FormFields";
import type { ArticleImage } from "@/domain/article";
import { formatBytes } from "@/lib/bytes";
import { acceptedImageTypes, compressPhoto, shortHash, validateImageFile } from "@/lib/imageResize";
import { uploadMedia } from "@/lib/storageUpload";

interface ImageUploadFieldProps {
  initial: ArticleImage;
  errors: { imageUrl?: string; imageAlt?: string };
  onChange: () => void;
}

export function ImageUploadField({ initial, errors, onChange }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [src, setSrc] = useState(initial.src);
  const [width, setWidth] = useState(initial.width);
  const [height, setHeight] = useState(initial.height);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [problem, setProblem] = useState("");
  const [dragging, setDragging] = useState(false);

  const processFile = async (file: File) => {
    const invalid = validateImageFile(file);
    if (invalid) {
      setProblem(invalid);
      return;
    }
    setBusy(true);
    setProblem("");
    setMessage("Mengecilkan dan mengunggah gambar...");
    try {
      const resized = await compressPhoto(file);
      const hash = await shortHash(resized.blob);
      const url = await uploadMedia(`articles/${hash}.${resized.extension}`, resized.blob);
      setSrc(url);
      setWidth(resized.width);
      setHeight(resized.height);
      setMessage(
        `Selesai. Gambar dikecilkan dari ${formatBytes(file.size)} menjadi ${formatBytes(resized.blob.size)}.${
          resized.aboveTarget ? " Ukurannya masih di atas 100 KB, pertimbangkan gambar yang lebih sederhana." : ""
        }`,
      );
      onChange();
    } catch (error) {
      setMessage("");
      setProblem(error instanceof Error ? error.message : "Gambar belum bisa diproses. Coba berkas lain.");
    } finally {
      setBusy(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    if (file && !busy) {
      void processFile(file);
    }
  };

  const clearImage = () => {
    setSrc("");
    setMessage("Gambar dilepas dari artikel. Unggah gambar baru sebelum menerbitkan.");
    onChange();
  };

  const uploadError = problem || errors.imageUrl;

  return (
    <div className="space-y-5">
      <input type="hidden" name="imageUrl" value={src} />
      <input type="hidden" name="imageWidth" value={width} />
      <input type="hidden" name="imageHeight" value={height} />

      <div id="imageUrl" tabIndex={-1} className="field-group">
        <p className={labelClass}>Gambar utama</p>
        <p className={hintClass}>
          PNG, JPG, atau WebP. Gambar otomatis dikecilkan agar situs tetap cepat, jadi tidak perlu diubah ukurannya dulu.
        </p>

        {src ? (
          <div className="mt-3">
            <Image
              src={src}
              alt="Pratinjau gambar utama artikel"
              width={width}
              height={height}
              unoptimized
              className="squircle h-auto max-h-72 w-full max-w-xl rounded-card object-cover"
            />
          </div>
        ) : null}

        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`mt-3 flex flex-wrap items-center gap-3 rounded-2xl border-2 border-dashed p-4 ${
            dragging ? "border-nila bg-nila-pudar/50" : "border-nila/40 bg-kapas"
          }`}
        >
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className={secondaryButtonClass}
          >
            {src ? "Ganti gambar" : "Pilih gambar"}
          </button>
          {src ? (
            <button
              type="button"
              disabled={busy}
              onClick={clearImage}
              className="min-h-11 rounded-full px-4 font-display text-base font-bold text-galat underline underline-offset-4 hover:bg-galat/10"
            >
              Lepas gambar
            </button>
          ) : null}
          <span className="text-base text-nila/80">atau tarik gambar ke kotak ini</span>
          <input
            ref={inputRef}
            type="file"
            accept={acceptedImageTypes.join(",")}
            tabIndex={-1}
            aria-hidden="true"
            className="hidden"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];
              if (file) {
                void processFile(file);
              }
            }}
          />
        </div>

        <p role="status" className={message ? "mt-2 text-[0.9375rem] font-bold text-berhasil" : "sr-only"}>
          {message}
        </p>
        <span className="field-error" data-server={uploadError ? "" : undefined} role={problem ? "alert" : undefined}>
          {uploadError}
        </span>
      </div>

      <TextField
        name="imageAlt"
        label="Teks pengganti gambar"
        hint="Satu kalimat yang menjelaskan isi gambar untuk pembaca layar dan Google. Contoh: Gulungan kain tenun biru di atas meja."
        defaultValue={initial.alt}
        maxLength={300}
        error={errors.imageAlt}
        errorText="Isi teks pengganti gambar."
      />
      <TextField
        name="imageCaption"
        label="Keterangan gambar (boleh dikosongkan)"
        hint="Tampil di bawah gambar."
        defaultValue={initial.caption}
        maxLength={300}
      />
    </div>
  );
}
