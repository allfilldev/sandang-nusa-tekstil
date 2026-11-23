"use client";

import { useRef } from "react";
import { deleteArticleAction } from "@/app/admin/actions/articles";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { secondaryButtonClass } from "@/components/admin/adminStyles";

interface DeleteArticleButtonProps {
  id: string;
  title: string;
  isPublished: boolean;
  className?: string;
}

export function DeleteArticleButton({ id, title, isPublished, className }: DeleteArticleButtonProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className={className ?? `${secondaryButtonClass} min-h-11 px-4 py-2`}
      >
        Hapus<span className="sr-only"> artikel {title || "tanpa judul"}</span>
      </button>
      <ConfirmDialog
        dialogRef={dialogRef}
        title="Hapus artikel ini?"
        tone="danger"
        confirmLabel="Hapus artikel"
        action={deleteArticleAction}
        hiddenFields={{ id }}
        description={
          <>
            <p>
              Artikel <strong>{title || "tanpa judul"}</strong> akan dihapus bersama gambar utamanya. Tindakan ini tidak bisa
              dibatalkan.
            </p>
            {isPublished ? (
              <p className="mt-3">
                Hanya ingin menyembunyikannya sementara? Buka artikelnya lalu pilih <strong>Batalkan terbit</strong>.
              </p>
            ) : null}
          </>
        }
      />
    </>
  );
}
