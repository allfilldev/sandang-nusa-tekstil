"use client";

import type { ReactNode } from "react";
import { accentButtonClass, dangerButtonClass, primaryButtonClass, secondaryButtonClass } from "@/components/admin/adminStyles";
import { useFormPending } from "@/components/admin/form/FormPending";

type SubmitVariant = "primary" | "secondary" | "danger" | "accent";

interface SubmitButtonProps {
  children: ReactNode;
  pendingLabel?: string;
  variant?: SubmitVariant;
  name?: string;
  value?: string;
  className?: string;
}

const variantClasses: Record<SubmitVariant, string> = {
  primary: primaryButtonClass,
  secondary: secondaryButtonClass,
  danger: dangerButtonClass,
  accent: accentButtonClass,
};

// Tombol kirim tidak dimatikan sebelum diklik, supaya isian yang salah tetap bisa disorot.
// Baru setelah kirim yang valid tombol dimatikan agar tidak terkirim dua kali.
export function SubmitButton({
  children,
  pendingLabel = "Menyimpan...",
  variant = "primary",
  name,
  value,
  className = "",
}: SubmitButtonProps) {
  const pending = useFormPending();

  return (
    <button
      type="submit"
      name={name}
      value={value}
      disabled={pending}
      className={`${variantClasses[variant]} ${className}`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
