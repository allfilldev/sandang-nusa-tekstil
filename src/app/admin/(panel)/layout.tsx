import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { signOutAction } from "@/app/admin/actions/auth";
import { AdminSetupGuide } from "@/components/admin/AdminSetupGuide";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminSurface } from "@/components/admin/AdminSurface";
import { cardClass, pageTitleClass, primaryButtonClass } from "@/components/admin/adminStyles";
import { getAdminSession } from "@/lib/supabase/adminSession";

export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  const session = await getAdminSession();

  if (session.state === "unconfigured") {
    return (
      <AdminSurface>
        <AdminSetupGuide />
      </AdminSurface>
    );
  }
  if (session.state === "anonymous") {
    redirect("/admin/masuk");
  }
  if (session.state === "forbidden") {
    return (
      <AdminSurface>
      <main className="mx-auto max-w-lg px-4 py-16">
        <div className={cardClass}>
          <h1 className={pageTitleClass}>Akun ini belum jadi admin</h1>
          <p className="mt-4 text-lg leading-relaxed">
            {session.email ? `Akun ${session.email} ` : "Akun ini "}
            sudah masuk, tetapi belum terdaftar sebagai admin situs. Minta pemilik situs mendaftarkannya, atau keluar dan
            masuk dengan akun lain.
          </p>
          <form action={signOutAction} className="mt-6">
            <button type="submit" className={primaryButtonClass}>
              Keluar
            </button>
          </form>
        </div>
      </main>
      </AdminSurface>
    );
  }

  return (
    <AdminSurface>
      <AdminShell email={session.email}>{children}</AdminShell>
    </AdminSurface>
  );
}
