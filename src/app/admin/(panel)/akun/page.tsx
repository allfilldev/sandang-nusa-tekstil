import type { Metadata } from "next";
import { signOutAction } from "@/app/admin/actions/auth";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";
import { cardClass, pageTitleClass, secondaryButtonClass, sectionHeadingClass } from "@/components/admin/adminStyles";
import { requireAdminPage } from "@/lib/supabase/adminSession";

export const metadata: Metadata = { title: "Akun" };

export default async function AdminAccountPage() {
  const session = await requireAdminPage();

  return (
    <>
      <h1 className={pageTitleClass}>Akun</h1>
      <p className="mt-3 text-lg">Masuk sebagai {session.email || "admin"}.</p>

      <section aria-labelledby="password-title" className={`${cardClass} mt-8 max-w-xl`}>
        <h2 id="password-title" className={sectionHeadingClass}>
          Ganti kata sandi
        </h2>
        <div className="mt-5">
          <ChangePasswordForm />
        </div>
      </section>

      <section className={`${cardClass} mt-6 max-w-xl`}>
        <h2 className={sectionHeadingClass}>Keluar</h2>
        <p className="mt-2 text-base text-nila/80">Pakai ini kalau kamu memakai komputer atau HP orang lain.</p>
        <form action={signOutAction} className="mt-4">
          <button type="submit" className={secondaryButtonClass}>
            Keluar dari panel admin
          </button>
        </form>
      </section>
    </>
  );
}
