import { cardClass, pageTitleClass } from "@/components/admin/adminStyles";

const steps = [
  "Buat project di supabase.com dan pilih region Singapore.",
  "Buka SQL Editor, tempel isi file supabase/migrations/0001_cms.sql, lalu klik Run. Setelah itu tempel isi supabase/seed.sql dan Run untuk memindahkan tiga artikel yang sudah ada.",
  "Buka Authentication, Users, Add user. Isi email dan kata sandi admin, lalu centang auto-confirm. Di pengaturan Sign In, matikan Allow new users to sign up.",
  "Daftarkan email itu sebagai admin dengan satu baris SQL (ada di docs/cms-setup.md).",
  "Buka Project Settings, API Keys. Salin Project URL dan Publishable key ke file .env.local, lalu jalankan ulang npm run dev.",
];

export function AdminSetupGuide() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <div className={cardClass}>
        <h1 className={pageTitleClass}>Hubungkan Supabase dulu</h1>
        <p className="mt-4 max-w-[60ch] text-lg leading-relaxed">
          Panel admin belum bisa dipakai karena situs belum tersambung ke Supabase. Situs publik tetap berjalan normal dari
          data bawaan. Ikuti langkah berikut sekali saja.
        </p>
        <ol className="mt-6 list-decimal space-y-3 pl-6 text-lg leading-relaxed marker:font-bold marker:text-nila">
          {steps.map((step) => (
            <li key={step} className="pl-2">
              {step}
            </li>
          ))}
        </ol>
        <p className="mt-6 rounded-2xl bg-kunyit/25 p-4 text-base leading-relaxed">
          Isi <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code> dan{" "}
          <code className="font-mono">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> di <code className="font-mono">.env.local</code>.
          Jangan pernah menempel kunci secret atau service role. CMS ini tidak membutuhkannya.
        </p>
      </div>
    </main>
  );
}
