"use client";

import { createContext, useContext } from "react";

// Status "sedang menyimpan" untuk tombol kirim di dalam AdminForm.
// Dipakai sebagai pengganti useFormStatus karena AdminForm mengirim lewat onSubmit (supaya isian tidak di-reset otomatis).
const FormPendingContext = createContext(false);

export const FormPendingProvider = FormPendingContext.Provider;

export function useFormPending(): boolean {
  return useContext(FormPendingContext);
}
