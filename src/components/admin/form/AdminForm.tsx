"use client";

import { useEffect, useId, useImperativeHandle, useRef, useTransition } from "react";
import type { FormEvent, FormEventHandler, ReactNode, Ref } from "react";
import { installFieldValidation } from "@/components/admin/form/fieldValidation";
import { FormPendingProvider } from "@/components/admin/form/FormPending";
import type { FormState } from "@/domain/formState";

interface AdminFormProps {
  // Fungsi kirim dari useActionState.
  action: (formData: FormData) => void;
  state: FormState;
  // Dari useActionState: true selama Server Action berjalan.
  pending: boolean;
  children: ReactNode;
  className?: string;
  // Nama tampil untuk tiap isian, dipakai untuk tautan di ringkasan galat.
  fieldLabels?: Record<string, string>;
  onInput?: FormEventHandler<HTMLFormElement>;
  formRef?: Ref<HTMLFormElement>;
  "aria-labelledby"?: string;
}

// Form dikirim lewat onSubmit, bukan atribut action. Dengan atribut action, React 19 mereset semua isian
// setelah action selesai, sehingga tulisan di editor atau email di halaman masuk hilang saat ada galat.
export function AdminForm({
  action,
  state,
  pending,
  children,
  className = "",
  fieldLabels = {},
  onInput,
  formRef,
  "aria-labelledby": labelledBy,
}: AdminFormProps) {
  const internalFormRef = useRef<HTMLFormElement>(null);
  const announcerRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const summaryTitleId = useId();
  const [, startTransition] = useTransition();

  useEffect(() => {
    const form = internalFormRef.current;
    const announcer = announcerRef.current;
    if (!form || !announcer) {
      return;
    }
    return installFieldValidation(form, announcer);
  }, []);

  // Setelah kirim gagal di server, pindahkan fokus ke ringkasan galat supaya pembaca layar langsung membacanya.
  useEffect(() => {
    if (state.status === "error") {
      summaryRef.current?.focus();
    }
  }, [state.status, state.submissionId]);

  // Meneruskan elemen form ke induk (untuk requestSubmit dan membaca isian) tanpa mengubah prop.
  useImperativeHandle(formRef, () => internalFormRef.current as HTMLFormElement, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) {
      return;
    }
    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    const formData = new FormData(event.currentTarget, submitter instanceof HTMLElement ? submitter : undefined);
    startTransition(() => action(formData));
  };

  const fieldErrorEntries = Object.entries(state.fieldErrors);

  return (
    <form ref={internalFormRef} onSubmit={handleSubmit} onInput={onInput} aria-labelledby={labelledBy} className={className}>
      <FormPendingProvider value={pending}>
        {state.status === "error" && state.message ? (
          <div
            ref={summaryRef}
            role="group"
            aria-labelledby={summaryTitleId}
            tabIndex={-1}
            className="mb-6 rounded-2xl border-2 border-galat bg-galat/5 p-4"
          >
            <p id={summaryTitleId} className="font-display text-base font-bold text-galat">
              {state.message}
            </p>
            {fieldErrorEntries.length > 0 ? (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[0.9375rem]">
                {fieldErrorEntries.map(([name, message]) => (
                  <li key={name}>
                    <a href={`#${name}`} className="font-semibold underline underline-offset-4">
                      {fieldLabels[name] ?? name}
                    </a>
                    : {message}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
        <div
          role="status"
          className={
            state.status === "success"
              ? "mb-6 rounded-2xl bg-berhasil/10 p-4 font-display font-bold text-berhasil"
              : "sr-only"
          }
        >
          {state.status === "success" ? state.message : ""}
        </div>
        {children}
        <div ref={announcerRef} aria-live="polite" className="sr-only" />
      </FormPendingProvider>
    </form>
  );
}
