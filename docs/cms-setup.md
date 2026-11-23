# Panduan Menyambungkan CMS (Supabase)

Panduan sekali pasang untuk mengaktifkan panel admin di `/admin`: ganti logo dan kelola artikel. Rancangan lengkapnya ada di `docs/cms-plan.md`. Nama menu di dashboard Supabase bisa sedikit berbeda dari yang ditulis di sini karena Supabase memperbarui tampilannya.

Kalau langkah ini belum dilakukan, situs tetap berjalan normal dari data di `src/data` dan halaman `/admin` hanya menampilkan panduan singkat.

## 1. Buat project Supabase

1. Daftar atau masuk di supabase.com, lalu buat **New project**.
2. Pilih region **Singapore** (terdekat dengan Indonesia) dan simpan kata sandi database di tempat aman. Kata sandi database tidak dipakai di situs ini.
3. Tunggu sampai project selesai dibuat.

## 2. Jalankan SQL

Buka **SQL Editor** di dashboard, lalu jalankan dua file berikut **berurutan**. Untuk tiap file: buka file di VS Code, salin seluruh isinya, tempel di SQL Editor, klik **Run**.

1. `supabase/migrations/0001_cms.sql`: membuat tabel artikel, pengaturan logo, daftar admin, bucket penyimpanan gambar, dan semua aturan keamanan (RLS).
2. `supabase/seed.sql`: memindahkan tiga artikel yang sudah ada ke database.

Keduanya aman dijalankan ulang. Kalau isi `src/data/articles` berubah dan kamu ingin membuat ulang `seed.sql`:

```powershell
node scripts/generate-seed.mjs
```

## 3. Buat akun admin

1. Buka **Authentication, Users, Add user, Create new user**.
2. Isi email dan kata sandi admin. Centang **Auto Confirm User** supaya tidak perlu verifikasi email.
3. Buka pengaturan **Authentication, Sign In / Providers** dan **matikan "Allow new users to sign up"**. Ini penting: dengan begitu tidak ada orang lain yang bisa membuat akun sendiri.

## 4. Daftarkan akun itu sebagai admin

Membuat akun saja belum cukup. Akun harus didaftarkan sebagai admin. Di **SQL Editor** jalankan satu baris ini, dengan email diganti email admin tadi:

```sql
insert into public.admin_users (user_id)
select id from auth.users where email = 'email-admin@contoh.com';
```

Hasilnya harus menyebut `1 row`. Kalau `0 rows`, email salah ketik.

Untuk menambah admin lain nanti, buat akunnya (langkah 3) lalu jalankan baris yang sama dengan email barunya.

## 5. Sambungkan situs

1. Buka **Project Settings, API Keys** (kadang di **Data API**). Salin **Project URL** dan **Publishable key**.
2. Buat file `.env.local` di folder proyek (salin dari `.env.example`) dan isi:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxx
```

3. Hentikan lalu jalankan ulang `npm run dev`. Perubahan `.env.local` baru terbaca setelah server dijalankan ulang.

Kunci publishable memang aman berada di browser karena akses data dijaga aturan RLS di database. **Jangan pernah** menempel kunci `secret` atau `service_role`. CMS ini tidak membutuhkannya.

## 6. Masuk dan coba

1. Buka `http://localhost:3000/admin` dan masuk dengan email dan kata sandi admin.
2. Coba **Tulis artikel baru**, simpan sebagai draf, lalu **Terbitkan**. Artikel muncul di `/artikel`.
3. Buka **Logo**, unggah logo, simpan, lalu lihat header, footer, dan ikon tab berubah.

## 7. Saat go-live

1. Isi variabel yang sama (`NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`) di pengaturan hosting, lalu build ulang. Nilai `NEXT_PUBLIC_*` ditanam saat build.
2. Di Supabase, buka **Authentication, URL Configuration** dan isi **Site URL** dengan domain produksi.
3. Ganti kata sandi admin lewat halaman **Akun** di panel admin.

## Cara kerja singkat

- Pengunjung hanya membaca artikel berstatus terbit dan pengaturan logo. Halaman publik tetap statis dan cepat.
- Saat admin menyimpan, halaman publik terkait langsung disegarkan.
- Gambar dikecilkan di browser (WebP, di bawah 100 KB) lalu diunggah langsung ke Storage bucket `media`.
- Semua perubahan data dijaga di database lewat RLS. Hanya akun yang terdaftar di `admin_users` yang bisa menulis.

## Pemecahan masalah

| Gejala | Penyebab dan jalan keluar |
| --- | --- |
| `/admin` menampilkan "Hubungkan Supabase dulu" | `.env.local` belum terisi, atau server belum dijalankan ulang setelah mengisinya. |
| "Akun ini belum jadi admin" setelah masuk | Langkah 4 belum dilakukan, atau email di SQL berbeda dengan email akun. |
| "Email atau kata sandi salah" padahal benar | Akun belum **Auto Confirm**. Buka Authentication, Users, pilih akun, lalu konfirmasi emailnya. |
| Unggah gambar gagal | Migrasi `0001_cms.sql` belum dijalankan (bucket `media` belum ada), atau sesi login habis. Masuk ulang. |
| Gambar dari Storage tidak tampil di situs setelah mengganti URL Supabase | Jalankan ulang `npm run dev` atau build. Daftar domain gambar dibaca dari `NEXT_PUBLIC_SUPABASE_URL` saat server mulai. |
| Perubahan tidak langsung tampil di situs | Tunggu beberapa detik lalu muat ulang. Sebagai jaring pengaman, data publik disegarkan sendiri paling lambat setiap 1 jam. |
| Lupa kata sandi admin | Di Supabase buka Authentication, Users, pilih akun, lalu atur kata sandi baru. |
| Login dan penyimpanan gagal setelah lama tidak dipakai | Project Supabase paket gratis dapat dijeda setelah sekitar satu minggu tanpa aktivitas. Buka dashboard Supabase dan pulihkan (Restore). Untuk situs klien, pertimbangkan paket berbayar. |

## Batasan versi 1

Tidak ada pengalihan otomatis saat alamat artikel diubah (alamat dikunci setelah terbit), tidak ada jadwal terbit otomatis, tidak ada riwayat versi, dan logo SVG belum didukung. Gambar yang disisipkan ke dalam isi artikel tidak ikut terhapus otomatis saat artikelnya dihapus; hanya gambar utama yang dibersihkan.
