import Link from "next/link";
import type { ReactNode } from "react";
import { signOutAction } from "@/app/admin/actions/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { secondaryButtonClass } from "@/components/admin/adminStyles";

interface AdminShellProps {
  email: string;
  children: ReactNode;
}

export function AdminShell({ email, children }: AdminShellProps) {
  return (
    <>
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-nila focus:px-5 focus:py-3 focus:font-bold focus:text-benang"
      >
        Lewati ke isi halaman
      </a>
      <header className="border-b border-nila/15 bg-benang">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-3">
          <Link href="/admin" className="font-display text-lg font-extrabold">
            Panel Admin
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <AdminNav />
            <Link
              href="/"
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-11 items-center rounded-full px-4 font-display text-base font-bold text-nila underline decoration-nila/40 underline-offset-4 hover:decoration-nila"
            >
              Lihat situs<span className="sr-only"> (tab baru)</span>
            </Link>
            <form action={signOutAction}>
              <button type="submit" className={`${secondaryButtonClass} min-h-11 px-4 py-2`}>
                Keluar
              </button>
            </form>
          </div>
        </div>
      </header>
      <main id="admin-main" className="mx-auto max-w-6xl px-4 py-8 md:py-10">
        {children}
        <p className="mt-12 text-[0.9375rem] text-nila/70">Masuk sebagai {email || "admin"}.</p>
      </main>
    </>
  );
}
