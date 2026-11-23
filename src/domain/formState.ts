// Bentuk jawaban Server Action untuk form admin.
export interface FormState {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors: Record<string, string>;
  // Naik setiap kali form dikirim, supaya pesan yang sama tetap diumumkan ulang dan fokus dipindahkan.
  submissionId: number;
  // Data tambahan yang dibutuhkan form setelah berhasil, misalnya versi baru artikel untuk simpan berikutnya.
  data?: Record<string, string>;
}

export const initialFormState: FormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  submissionId: 0,
};

export function errorState(message: string, fieldErrors: Record<string, string> = {}): FormState {
  return { status: "error", message, fieldErrors, submissionId: Date.now() };
}

export function successState(message: string, data?: Record<string, string>): FormState {
  return { status: "success", message, fieldErrors: {}, submissionId: Date.now(), data };
}
