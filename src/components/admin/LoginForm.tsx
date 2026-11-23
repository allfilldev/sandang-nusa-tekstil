"use client";

import { useActionState } from "react";
import { signInAction } from "@/app/admin/actions/auth";
import { AdminForm } from "@/components/admin/form/AdminForm";
import { PasswordField, TextField } from "@/components/admin/form/FormFields";
import { SubmitButton } from "@/components/admin/form/SubmitButton";
import { initialFormState } from "@/domain/formState";

const fieldLabels = { email: "Email", password: "Kata sandi" };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signInAction, initialFormState);

  return (
    <AdminForm action={formAction} state={state} pending={pending} fieldLabels={fieldLabels} aria-labelledby="login-title">
      <div className="space-y-5">
        <TextField
          name="email"
          label="Email"
          type="email"
          required
          autoComplete="username"
          inputMode="email"
          errorText="Isi email yang benar, misalnya nama@contoh.com."
          error={state.fieldErrors.email}
        />
        <PasswordField
          name="password"
          label="Kata sandi"
          autoComplete="current-password"
          errorText="Isi kata sandi kamu."
          error={state.fieldErrors.password}
        />
      </div>
      <div className="mt-6">
        <SubmitButton pendingLabel="Memeriksa..." className="w-full">
          Masuk
        </SubmitButton>
      </div>
    </AdminForm>
  );
}
