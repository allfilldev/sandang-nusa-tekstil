"use client";

import Image from "next/image";
import { useActionState, useEffect, useRef, useState, startTransition } from "react";
import { resetLogoAction, saveLogoAction } from "@/app/admin/actions/branding";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { cardClass, hintClass, labelClass, secondaryButtonClass, sectionHeadingClass } from "@/components/admin/adminStyles";
import { AdminForm } from "@/components/admin/form/AdminForm";
import { TextField } from "@/components/admin/form/FormFields";
import { SubmitButton } from "@/components/admin/form/SubmitButton";
import { LogoMark } from "@/components/brand/LogoMark";
import type { SiteBranding } from "@/domain/branding";
import { initialFormState } from "@/domain/formState";
import { acceptedImageTypes, prepareLogoAssets, shortHash, validateImageFile } from "@/lib/imageResize";
import type { LogoAssets } from "@/lib/imageResize";
import { logoFileNames } from "@/lib/logoFiles";
import { uploadMedia } from "@/lib/storageUpload";

interface LogoManagerProps {
  branding: SiteBranding;
  siteName: string;
}

interface PreparedLogo {
  assets: LogoAssets;
  fileName: string;
  headerUrl: string;
  faviconUrl: string;
}

const fieldLabels = { logoAlt: "Teks pengganti logo" };

function LogoPreviewImage({ src, width, height }: { src: string; width: number; height: number }) {
  return (
    <Image src={src} alt="" width={width} height={height} unoptimized className="h-10 w-auto max-w-[12rem] object-contain" />
  );
}

export function LogoManager({ branding, siteName }: LogoManagerProps) {
  const [state, dispatch, pending] = useActionState(saveLogoAction, initialFormState);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resetDialogRef = useRef<HTMLDialogElement>(null);
  const [prepared, setPrepared] = useState<PreparedLogo | null>(null);
  const [showName, setShowName] = useState(branding.showBrandName);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState("");
  const [warning, setWarning] = useState("");
  const [uploadFailure, setUploadFailure] = useState("");

  // Membersihkan URL objek pratinjau saat logo diganti atau komponen ditutup.
  const preparedRef = useRef<PreparedLogo | null>(null);
  useEffect(() => {
    preparedRef.current = prepared;
  }, [prepared]);
  useEffect(
    () => () => {
      if (preparedRef.current) {
        URL.revokeObjectURL(preparedRef.current.headerUrl);
        URL.revokeObjectURL(preparedRef.current.faviconUrl);
      }
    },
    [],
  );

  const chooseFile = async (file: File | undefined) => {
    if (!file) {
      return;
    }
    const invalid = validateImageFile(file);
    if (invalid) {
      setProblem(invalid);
      return;
    }
    setBusy(true);
    setProblem("");
    setWarning("");
    try {
      const assets = await prepareLogoAssets(file);
      const next: PreparedLogo = {
        assets,
        fileName: file.name,
        headerUrl: URL.createObjectURL(assets.header.blob),
        faviconUrl: URL.createObjectURL(assets.favicon),
      };
      if (prepared) {
        URL.revokeObjectURL(prepared.headerUrl);
        URL.revokeObjectURL(prepared.faviconUrl);
      }
      setPrepared(next);
      setUploadFailure("");

      const notes: string[] = [];
      if (Math.max(assets.sourceWidth, assets.sourceHeight) < 256) {
        notes.push("Gambar ini kecil, jadi bisa tampak buram di layar tajam. Logo dengan sisi terpanjang minimal 512 piksel lebih baik.");
      }
      const ratio = assets.sourceWidth / assets.sourceHeight;
      if (ratio > 2.2 || ratio < 0.45) {
        notes.push("Bentuk logo ini sangat lebar atau tinggi. Ikon tab akan diberi ruang kosong di sisinya supaya logo tidak terpotong.");
      }
      setWarning(notes.join(" "));
    } catch (error) {
      setProblem(error instanceof Error ? error.message : "Gambar belum bisa diproses. Coba berkas lain.");
    } finally {
      setBusy(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Logo baru diunggah ke Storage saat tombol Simpan ditekan (bukan saat dipilih), lalu alamatnya dikirim ke server.
  const submitLogo = (formData: FormData) => {
    void (async () => {
      setUploadFailure("");
      if (prepared) {
        setBusy(true);
        try {
          const { assets } = prepared;
          const folder = `logo/${await shortHash(assets.header.blob)}`;
          const [logoUrl, faviconUrl, appleIconUrl, icon192Url, icon512Url] = await Promise.all([
            uploadMedia(`${folder}/header.${assets.header.extension}`, assets.header.blob),
            uploadMedia(`${folder}/${logoFileNames.favicon}`, assets.favicon),
            uploadMedia(`${folder}/${logoFileNames.appleIcon}`, assets.appleIcon),
            uploadMedia(`${folder}/${logoFileNames.icon192}`, assets.icon192),
            uploadMedia(`${folder}/${logoFileNames.icon512}`, assets.icon512),
          ]);
          formData.set("logoFolder", folder);
          formData.set("logoUrl", logoUrl);
          formData.set("faviconUrl", faviconUrl);
          formData.set("appleIconUrl", appleIconUrl);
          formData.set("icon192Url", icon192Url);
          formData.set("icon512Url", icon512Url);
          formData.set("logoWidth", String(assets.header.width));
          formData.set("logoHeight", String(assets.header.height));
        } catch (error) {
          setUploadFailure(error instanceof Error ? error.message : "Logo belum bisa diunggah. Coba lagi.");
          setBusy(false);
          return;
        }
        setBusy(false);
      }
      startTransition(() => dispatch(formData));
    })();
  };

  const currentHeaderSrc = prepared?.headerUrl ?? branding.logoUrl;
  const currentHeaderWidth = prepared?.assets.header.width ?? branding.logoWidth;
  const currentHeaderHeight = prepared?.assets.header.height ?? branding.logoHeight;
  const currentFavicon = prepared?.faviconUrl ?? branding.faviconUrl;
  const hasLogo = Boolean(currentHeaderSrc);
  const nameVisible = !hasLogo || showName;

  return (
    <div className="space-y-6">
      <section aria-labelledby="logo-now" className={cardClass}>
        <h2 id="logo-now" className={sectionHeadingClass}>
          Logo sekarang
        </h2>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          {branding.logoUrl ? (
            <Image
              src={branding.logoUrl}
              alt={branding.logoAlt || "Logo situs saat ini"}
              width={branding.logoWidth}
              height={branding.logoHeight}
              unoptimized
              className="h-14 w-auto max-w-full object-contain"
            />
          ) : (
            <div className="flex items-center gap-3">
              <LogoMark />
              <p className="text-base text-nila/80">Masih memakai logo bawaan (lambang tenunan).</p>
            </div>
          )}
          {branding.logoUrl ? (
            <button type="button" onClick={() => resetDialogRef.current?.showModal()} className={secondaryButtonClass}>
              Kembalikan ke logo bawaan
            </button>
          ) : null}
        </div>
      </section>

      <section aria-labelledby="logo-new" className={cardClass}>
        <h2 id="logo-new" className={sectionHeadingClass}>
          Unggah logo baru
        </h2>
        <AdminForm
          action={submitLogo}
          state={state}
          pending={pending || busy}
          fieldLabels={fieldLabels}
          aria-labelledby="logo-new"
          className="mt-4"
        >
          <div>
            <p className={labelClass}>Berkas logo</p>
            <p className={hintClass}>
              PNG, JPG, atau WebP. PNG dengan latar transparan paling bagus. Semua ukuran (header, footer, ikon tab, ikon
              ponsel) dibuat otomatis.
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={busy || pending}
                onClick={() => fileInputRef.current?.click()}
                className={secondaryButtonClass}
              >
                {prepared ? "Ganti pilihan" : "Pilih berkas logo"}
              </button>
              <span className="break-all text-base">{prepared ? prepared.fileName : "Belum ada berkas dipilih"}</span>
              <input
                ref={fileInputRef}
                type="file"
                accept={acceptedImageTypes.join(",")}
                tabIndex={-1}
                aria-hidden="true"
                className="hidden"
                onChange={(event) => void chooseFile(event.currentTarget.files?.[0])}
              />
            </div>
            <p role="alert" className={problem || uploadFailure ? "mt-2 font-bold text-galat" : "sr-only"}>
              {problem || uploadFailure}
            </p>
            {warning ? <p className="mt-2 rounded-2xl bg-kunyit/25 p-3 text-[0.9375rem] leading-snug">{warning}</p> : null}
          </div>

          <div className="mt-6 space-y-4">
            <label className="flex min-h-12 items-center gap-3 text-base font-semibold">
              <input
                type="checkbox"
                name="showBrandName"
                defaultChecked={branding.showBrandName}
                onChange={(event) => setShowName(event.currentTarget.checked)}
                className="size-5 accent-nila"
              />
              Tampilkan nama perusahaan di samping logo
            </label>
            <TextField
              name="logoAlt"
              label="Teks pengganti logo"
              hint="Dibaca pembaca layar kalau nama perusahaan tidak ditampilkan di samping logo."
              defaultValue={branding.logoAlt || siteName}
              maxLength={200}
              error={state.fieldErrors.logoAlt}
            />
          </div>

          <div className="mt-6">
            <h3 className="font-display text-lg font-extrabold">Pratinjau (belum disimpan)</h3>
            <div className="mt-3 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-nila/15 bg-kapas p-4">
                <p className="text-sm font-bold text-nila/70">Header</p>
                <div className="mt-3 flex items-center gap-3">
                  {currentHeaderSrc ? (
                    <LogoPreviewImage src={currentHeaderSrc} width={currentHeaderWidth} height={currentHeaderHeight} />
                  ) : (
                    <LogoMark />
                  )}
                  {nameVisible ? <span className="font-display text-lg font-extrabold leading-tight">{siteName}</span> : null}
                </div>
              </div>
              <div className="rounded-2xl bg-nila p-4 text-benang">
                <p className="text-sm font-bold text-benang/80">Footer</p>
                <div className="mt-3 flex items-center gap-3">
                  {currentHeaderSrc ? (
                    <span className="inline-flex rounded-2xl bg-benang p-2">
                      <LogoPreviewImage src={currentHeaderSrc} width={currentHeaderWidth} height={currentHeaderHeight} />
                    </span>
                  ) : (
                    <LogoMark tone="light" />
                  )}
                  {nameVisible ? <span className="font-display text-lg font-extrabold leading-tight">{siteName}</span> : null}
                </div>
              </div>
              <div className="rounded-2xl border border-nila/15 bg-benang p-4">
                <p className="text-sm font-bold text-nila/70">Tab browser</p>
                <div className="mt-3 flex items-center gap-2 rounded-t-xl bg-nila-pudar/60 px-3 py-2">
                  {currentFavicon ? (
                    <Image src={currentFavicon} alt="" width={16} height={16} unoptimized className="size-4" />
                  ) : (
                    <LogoMark className="size-4" />
                  )}
                  <span className="truncate text-sm font-bold">{siteName}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <SubmitButton pendingLabel={busy ? "Mengunggah logo..." : "Menyimpan..."}>Simpan logo</SubmitButton>
          </div>
        </AdminForm>
      </section>

      <ConfirmDialog
        dialogRef={resetDialogRef}
        title="Kembalikan ke logo bawaan?"
        confirmLabel="Ya, kembalikan"
        cancelLabel="Tetap pakai logo ini"
        tone="danger"
        action={resetLogoAction}
        description="Logo yang sekarang akan dihapus dari situs dan Storage, lalu situs memakai lambang tenunan bawaan. Kamu bisa mengunggah logo lagi kapan saja."
      />
    </div>
  );
}
