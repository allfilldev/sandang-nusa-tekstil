"use client";

import { useActionState } from "react";
import { changePasswordAction } from "@/app/admin/actions/auth";
import { AdminForm } from "@/components/admin/form/AdminForm";
import { PasswordField } from "@/components/admin/form/FormFields";
import { SubmitButton } from "@/components/admin/form/SubmitButton";
import { initialFormState } from "@/domain/formState";

const fieldLabels = { password: "Kata sandi baru", passwordConfirmation: "Ulangi kata sandi baru" };

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changePasswordAction, initialFormState);

  return (
    <AdminForm
      // Setelah berhasil, form dibuat ulang supaya kolom kata sandi kosong lagi.
      key={state.status === "success" ? state.submissionId : "form"}
      action={formAction}
      state={state}
      pending={pending}
      fieldLabels={fieldLabels}
      aria-labelledby="password-title"
    >
      <div className="space-y-5">
        <PasswordField
          name="password"
          label="Kata sandi baru"
          autoComplete="new-password"
          minLength={8}
          hint="Minimal 8 karakter. Kalimat panjang yang mudah kamu ingat lebih aman daripada satu kata."
          errorText="Kata sandi baru minimal 8 karakter."
          error={state.fieldErrors.password}
        />
        <PasswordField
          name="passwordConfirmation"
          label="Ulangi kata sandi baru"
          autoComplete="new-password"
          minLength={8}
          errorText="Ulangi kata sandi baru yang sama."
          error={state.fieldErrors.passwordConfirmation}
        />
      </div>
      <div className="mt-6">
        <SubmitButton>Simpan kata sandi</SubmitButton>
      </div>
    </AdminForm>
  );
}
