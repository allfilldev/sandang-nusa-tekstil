import type { ReactNode } from "react";

// Pembungkus gaya panel admin: font UI rapat dan latar kapas. Tidak dipakai di halaman pratinjau,
// supaya pratinjau artikel tampil dengan tipografi situs publik yang asli.
export function AdminSurface({ children }: { children: ReactNode }) {
  return <div className="min-h-dvh bg-kapas font-display text-base leading-normal text-nila">{children}</div>;
}
