"use client";

import { useId } from "react";
import type { ReactNode, RefObject } from "react";
import { dangerButtonClass, primaryButtonClass, secondaryButtonClass } from "@/components/admin/adminStyles";

interface ConfirmDialogProps {
  dialogRef: RefObject<HTMLDialogElement | null>;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: "danger" | "primary";
  // Mode 1: tombol konfirmasi biasa.
  onConfirm?: () => void;
  // Mode 2: tombol konfirmasi mengirim form ke Server Action.
  action?: (formData: FormData) => void | Promise<void>;
  hiddenFields?: Record<string, string>;
  children?: ReactNode;
}

// Dialog konfirmasi memakai <dialog> bawaan browser yang dibuka dengan showModal(): halaman di belakangnya
// otomatis tidak bisa diklik, fokus terkunci di dalam dialog, Esc menutup, dan fokus kembali ke tombol pemicu.
// Tombol aman (Batal) berada pertama dan mendapat fokus awal.
export function ConfirmDialog({
  dialogRef,
  title,
  description,
  confirmLabel,
  cancelLabel = "Batal",
  tone = "primary",
  onConfirm,
  action,
  hiddenFields = {},
  children,
}: ConfirmDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const confirmClass = tone === "danger" ? dangerButtonClass : primaryButtonClass;
  const close = () => dialogRef.current?.close();

  const cancelButton = (
    <button type="button" autoFocus onClick={close} className={secondaryButtonClass}>
      {cancelLabel}
    </button>
  );

  return (
    <dialog ref={dialogRef} aria-labelledby={titleId} aria-describedby={descriptionId} className="admin-dialog">
      <h2 id={titleId} className="font-display text-2xl font-extrabold leading-tight">
        {title}
      </h2>
      <div id={descriptionId} className="mt-3 text-base leading-relaxed">
        {description}
      </div>
      {children}
      {action ? (
        <form action={action} className="mt-6 flex flex-wrap justify-end gap-3">
          {Object.entries(hiddenFields).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))}
          {cancelButton}
          <button type="submit" className={confirmClass}>
            {confirmLabel}
          </button>
        </form>
      ) : (
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          {cancelButton}
          <button
            type="button"
            className={confirmClass}
            onClick={() => {
              close();
              onConfirm?.();
            }}
          >
            {confirmLabel}
          </button>
        </div>
      )}
    </dialog>
  );
}
