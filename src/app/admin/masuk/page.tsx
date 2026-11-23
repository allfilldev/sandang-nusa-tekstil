import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminSetupGuide } from "@/components/admin/AdminSetupGuide";
import { AdminSurface } from "@/components/admin/AdminSurface";
import { LoginForm } from "@/components/admin/LoginForm";
import { cardClass, pageTitleClass } from "@/components/admin/adminStyles";
import { getAdminSession } from "@/lib/supabase/adminSession";

export const metadata: Metadata = { title: "Masuk" };

export default async function LoginPage() {
  const session = await getAdminSession();
  if (session.state === "unconfigured") {
    return (
      <AdminSurface>
        <AdminSetupGuide />
      </AdminSurface>
    );
  }
  if (session.state === "admin") {
    redirect("/admin");
  }

  return (
    <AdminSurface>
      <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-12">
        <div className={cardClass}>
          <h1 id="login-title" className={pageTitleClass}>
            Masuk ke panel admin
          </h1>
          <p className="mt-3 text-base leading-relaxed text-nila/80">
            Gunakan email dan kata sandi admin untuk mengelola artikel dan logo situs.
          </p>
          <div className="mt-6">
            <LoginForm />
          </div>
        </div>
      </main>
    </AdminSurface>
  );
}
