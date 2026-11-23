# Rencana CMS: Ganti Logo dan Kelola Artikel (Supabase)

Status: **menunggu persetujuan**. Belum ada kode CMS yang ditulis. Setelah disetujui, urutan kerja ada di bagian "Urutan pengerjaan".

## 1. Tujuan

Pemilik situs (bukan programmer) bisa, dari browser atau HP:

1. **Mengganti logo** dan melihat hasilnya di header, footer, dan ikon tab sebelum disimpan.
2. **Mengelola artikel**: tulis baru, ubah, simpan sebagai draf, terbitkan, batalkan terbit, hapus.

Syarat: bahasa Indonesia sederhana, dua menu saja (Artikel dan Logo), dan setiap langkah teknis (alamat artikel, ukuran gambar, tanggal, SEO) dikerjakan otomatis atau dijelaskan lewat checklist.

Di luar cakupan (tetap di kode): nama perusahaan, nomor WhatsApp, teks beranda/produk/proses, halaman legal. Ini bisa ditambah nanti dengan pola yang sama.

## 2. Keputusan yang saya ambil (ubah kalau tidak cocok)

| Hal | Keputusan | Alasan |
| --- | --- | --- |
| Akun admin | Satu akun (email + kata sandi, Supabase Auth). Pendaftaran umum dimatikan. | Paling sederhana dan aman. Tabel `admin_users` membuat tambah admin nanti cukup satu baris SQL. |
| Penulisan artikel | Markdown dengan **toolbar tombol** (H2, H3, tebal, tautan, daftar, tabel, gambar) dan tab Pratinjau. | Format konten yang ada sudah Markdown, tabel dan tautan tidak rusak. Editor WYSIWYG penuh jauh lebih berat dan sering merusak tabel. |
| Artikel yang sudah ada | Tiga artikel di `src/data/articles` dipindah ke Supabase lewat `seed.sql` (dibuat otomatis oleh skrip). | Satu sumber data. File TS tetap ada sebagai cadangan. |
| Kalau Supabase belum disambung | Situs publik tetap jalan dari data statis. Halaman `/admin` menampilkan panduan penyambungan. | Situs tidak pernah mati hanya karena `.env` kosong. |
| Format logo | PNG, JPG, atau WebP (PNG transparan paling baik). **SVG tidak didukung di versi 1.** | SVG dari pengguna perlu disanitasi (risiko skrip). Bisa ditambah nanti. |
| Logo di footer gelap | Logo tampil di atas kapsul putih kecil, jadi logo apa pun tetap terbaca tanpa unggah dua versi. | Menghindari logo gelap hilang di latar biru nila. |
| Nama di samping logo | Kotak centang "Tampilkan nama perusahaan di samping logo" (bawaan: ya). | Ada logo yang sudah memuat nama, ada yang hanya lambang. |
| Syarat terbit | Hanya isian penting yang menahan terbit. Aturan SEO (panjang, jumlah H2, meta) berupa **peringatan**, bisa tetap diterbitkan. | CMS tidak boleh membuat pemilik frustrasi, tapi tetap memandu ke standar `seo-rules.md`. |
| Kunci alamat artikel | Alamat (slug) dikunci setelah terbit. Membukanya memunculkan peringatan bahwa tautan lama akan mati. Tidak ada pengalihan otomatis di versi 1. | Mencegah tautan putus tanpa sengaja. |

## 3. Arsitektur

### 3.1 Alur data

```
Pengunjung  ->  halaman publik (statis/ISR)  ->  articleService / brandingService
                                                        |
                                              repository (Supabase, atau data statis kalau env kosong)
                                                        |
                                    klien Supabase tanpa cookie (kunci publishable, hanya baca)

Admin       ->  /admin/*  ->  proxy.ts (segarkan sesi)  ->  Server Action (cek ulang login + admin)
                                                        |
                                    klien Supabase dengan cookie sesi (kena RLS)
Browser admin  ->  unggah gambar langsung ke Storage (sudah dikecilkan di browser)
```

Prinsip penting:

- **Halaman publik tidak membaca cookie**, jadi tetap statis dan cepat. `proxy.ts` hanya jalan di `/admin/:path*`.
- **Keamanan sebenarnya ada di RLS database dan Storage**, bukan di `proxy.ts`. Setiap Server Action tetap memeriksa `getClaims()` dan status admin (pertahanan berlapis). Tidak memakai `getSession()` untuk otorisasi.
- **Tidak ada service-role key** di aplikasi. Yang dipakai hanya kunci publishable. Kalau kunci itu bocor pun, RLS yang menahan.
- Setelah admin menyimpan, Server Action menyegarkan cache halaman terkait (beranda, daftar artikel, detail artikel, sitemap, feed, `llms.txt`, dan layout untuk logo). Mekanisme persisnya (tag `fetch` + `updateTag`, atau `unstable_cache` karena Cache Components dimatikan) saya pilih dan uji saat implementasi, dengan tolok ukur: **simpan lalu halaman publik langsung berubah**.

### 3.2 Pelapisan kode (Clean Architecture, tetap dipisah `.ts` dan `.tsx`)

```
supabase/
  migrations/0001_cms.sql       Tabel, RLS, fungsi is_admin(), bucket Storage dan kebijakannya
  seed.sql                      Dibuat skrip dari src/data/articles (jangan ditulis tangan)
scripts/generate-seed.mjs       Membuat seed.sql
src/
  proxy.ts                      Segarkan sesi Supabase; matcher hanya /admin/:path*
  domain/                       article.ts (tambah id, status), branding.ts (baru)
  repositories/                 Antarmuka + supabase + statis (artikel dan branding)
  lib/supabase/                 server.ts, browser.ts, public.ts, env.ts  (.ts)
  lib/                          articleQuality.ts (pemeriksa kualitas, murni), slug.ts, imageResize.ts (canvas, browser)
  services/                     articleService (jadi async), brandingService (baru), adminArticleService
  app/admin/                    Rute admin + Server Actions (.ts)
  components/admin/             Tampilan admin (.tsx)
```

Arah dependensi: `app` dan `components` ke `services`, `services` ke `repositories` dan `domain`, `repositories` ke `lib/supabase`. `domain` tidak bergantung ke apa pun.

### 3.3 Skema database

Tabel `articles` (satu baris per artikel):

| Kolom | Isi |
| --- | --- |
| `id` uuid, `slug` unik | Alamat huruf kecil dengan tanda hubung (diperiksa constraint) |
| `title`, `meta_title`, `meta_description`, `keyword`, `summary` | Judul dan SEO |
| `lead`, `body` (Markdown), `closing_heading`, `closing` | Isi |
| `faq_heading`, `faqs` jsonb | Tanya jawab |
| `image_url`, `image_alt`, `image_caption`, `image_width`, `image_height` | Gambar utama |
| `author_id` | Bawaan `tim-sandang-nusa` (dari `authors.ts`) |
| `related_slugs` text[] | Artikel terkait |
| `status` (`draft` / `published`), `published_at`, `created_at`, `updated_at` | Penerbitan. `published_at` diisi otomatis saat pertama terbit. `updated_at` diperbarui trigger. |

Tabel `site_settings` (satu baris, `id = 1`): `logo_url`, `logo_width`, `logo_height`, `logo_alt`, `icon_192_url`, `icon_512_url`, `apple_icon_url`, `favicon_url`, `show_brand_name`, `updated_at`.

Tabel `admin_users` (`user_id` uuid): siapa yang boleh mengubah. Fungsi `is_admin()` (security definer) dipakai semua kebijakan.

### 3.4 RLS dan Storage

| Objek | Anonim (pengunjung) | Admin |
| --- | --- | --- |
| `articles` | Hanya baca baris `status = 'published'` | Baca, tulis, hapus semua |
| `site_settings` | Baca | Ubah |
| `admin_users` | Tidak ada akses | Baca baris sendiri |
| Bucket `media` (publik) | Baca lewat URL publik | Unggah, ganti, hapus |

Bucket `media` dibatasi di sisi Supabase: hanya `image/webp`, `image/png`, `image/jpeg`, maksimal 1 MB per berkas. Nama berkas memuat hash isi (`logo/ab12cd34/icon-512.png`), jadi aman di-cache setahun dan tidak ada cache lama yang tersangkut.

### 3.5 Pemrosesan gambar: di browser, bukan di server

Foto HP bisa 3 sampai 8 MB, sedangkan Server Action Next dibatasi 1 MB secara bawaan dan banyak hosting membatasi 4,5 MB. Jadi:

1. Browser mengecilkan gambar (canvas, orientasi EXIF dipatuhi) lalu mengubahnya ke WebP dan menurunkan kualitas bertahap sampai **di bawah 100 KB** (sesuai aturan gambar di `rules.md`). Gambar artikel maksimal 1200 px lebar.
2. Browser mengunggah **langsung ke Storage** dengan sesi admin (dilindungi RLS). Server Action hanya menyimpan alamat berkasnya setelah memvalidasi bahwa awalan path sesuai.
3. Untuk logo, browser membuat sekaligus: logo header (tinggi 2x), favicon 32, ikon Apple 180, ikon 192 dan 512 (PNG, latar transparan dijaga).

Keuntungan: tanpa `sharp` (dependensi native yang merepotkan di Windows dan hosting), tanpa batas ukuran body, unggahan cepat di jaringan HP. Berkas lama dihapus (upaya terbaik) setelah yang baru tersimpan.

### 3.6 Dampak ke kode yang sudah ada

| File | Perubahan |
| --- | --- |
| `articleService.ts` | Jadi async dan memakai repository. `getArticleReadingMinutes` dipindah ke `lib` (fungsi murni, tetap sinkron). |
| 8 file pemanggil data: `(site)/page.tsx`, `artikel/page.tsx`, `artikel/[slug]/{page,opengraph-image,twitter-image}.tsx`, `sitemap.ts`, `feed.xml/route.ts`, `llms.txt/route.ts` | Menyesuaikan `await`. |
| 3 komponen yang hanya memakai `getArticleReadingMinutes`: `ArticleHeader`, `ArticleCards`, `ArticleLedger` | Hanya ganti impor ke `lib`. |
| `artikel/[slug]/page.tsx` | `dynamicParams` jadi `true` (artikel baru terbit tanpa build ulang), `notFound()` untuk slug tak dikenal. |
| `Logo.tsx`, `SiteFooter.tsx`, `SiteHeader.tsx` | Memakai logo dari `site_settings`; kalau kosong, memakai `LogoMark` tenunan bawaan. |
| `layout.tsx`, `manifest.ts`, `jsonLd.ts` | Ikon, ikon manifest, dan logo Organization diambil dari pengaturan. File ikon bawaan dipindah ke `public/` sebagai cadangan. |
| `next.config.ts` | `images.remotePatterns` untuk domain Storage Supabase (diturunkan dari `NEXT_PUBLIC_SUPABASE_URL`). |
| `.env.example` | Tambah dua variabel Supabase. |

## 4. Rancangan layar admin

Semua teks bahasa Indonesia sederhana: "Alamat artikel" (bukan slug), "Tampil di Google" (bukan meta). Tampilan memakai token yang sama (nila, kapas, kunyit), font Archivo untuk seluruh UI admin supaya rapat, tanpa hero dan tanpa animasi dekoratif. Semua layar nyaman di HP (satu kolom, target sentuh 48 px).

### 4.1 Masuk (`/admin/masuk`)

Satu kartu: Email, Kata sandi (dengan tombol "Tampilkan"), tombol **Masuk**. Pesan salah dalam kalimat biasa ("Email atau kata sandi salah"). Setelah masuk menuju `/admin`.

### 4.2 Beranda admin (`/admin`)

```
Halo! Apa yang ingin kamu lakukan?

+----------------------------+  +----------------------------+
|  ARTIKEL                   |  |  LOGO                      |
|  3 terbit  |  1 draf       |  |  [logo saat ini]           |
|  [ + Tulis artikel baru ]  |  |  [ Ganti logo ]            |
|  Lihat semua artikel >     |  |                            |
+----------------------------+  +----------------------------+
Lihat situs >        Akun dan keluar >
```

### 4.3 Daftar artikel (`/admin/artikel`)

```
Artikel                                   [ + Tulis artikel baru ]
[ Cari judul...        ]  ( Semua | Terbit | Draf )

Memilih Kain Garmen...   [Terbit]  Diubah 12 Nov    Ubah  Lihat  Hapus
GSM Kain: ...            [Terbit]  Diubah 10 Nov    Ubah  Lihat  Hapus
Kain Tenun dan Rajut...  [Draf]    Diubah kemarin   Ubah  Pratinjau Hapus
```

Status memakai teks dan ikon, tidak hanya warna. "Hapus" membuka dialog konfirmasi.

### 4.4 Editor artikel (`/admin/artikel/baru` dan `/admin/artikel/[id]`)

Satu halaman, enam bagian berurutan, dengan panel **Cek kualitas** di kanan (di HP: lipatan di atas tombol simpan).

```
< Kembali ke daftar              Tersimpan 14:02       [ Pratinjau ] [ Simpan draf ] [ Terbitkan ]

+-- 1. Judul dan alamat ----------------------+  +-- Cek kualitas -------------+
| Judul artikel   [______________________]    |  |  OK  Judul terisi           |
| Alamat artikel  /artikel/ [auto-dari-judul]  |  |  OK  Gambar utama + teks    |
|                                              |  |  !   Isi 640 kata (target   |
+-- 2. Gambar utama ----------------------------+  |      800 sampai 1.200)      |
| [ Tarik gambar ke sini / Pilih gambar ]      |  |  !   H2: 2 (target 3-6)     |
| [pratinjau]  Teks pengganti [_____________]  |  |  OK  Judul tab 34 karakter  |
|              Keterangan     [_____________]  |  |  !   Tanya jawab: 2 (3-6)   |
+-- 3. Isi artikel -----------------------------+  |  ...                        |
| Paragraf pembuka  [____________] 62 kata     |  |  Wajib: 0 kurang            |
| [H2][H3][B][Tautan][Daftar][Tabel][Gambar]   |  |  Saran: 4 perlu diperbaiki  |
| [Tulis | Pratinjau]                          |  +-----------------------------+
| [ textarea isi (Markdown)               ]    |
| Paragraf penutup  [____________] 71 kata     |
+-- 4. Tanya jawab -----------------------------+
| Judul bagian [_________]                     |
| Pertanyaan [____] Jawaban [____]   [Hapus]   |
| [ + Tambah pertanyaan ]                      |
+-- 5. Tampil di Google ------------------------+
| Judul tab [________] 34/37                   |
| Deskripsi [________] 148 (140 sampai 155)    |
| Contoh tampilan:  judul biru / url / deskripsi |
| Kata kunci utama [________]                  |
+-- 6. Artikel terkait -------------------------+
| [x] GSM Kain   [ ] Kain Tenun ...            |
+----------------------------------------------+
```

Perilaku:

- **Alamat** dibuat otomatis dari judul (huruf kecil, tanda hubung, tanpa aksen) selama belum diubah manual; dikunci setelah terbit.
- **Simpan draf** tidak menuntut apa pun kecuali judul. **Terbitkan** menuntut isian wajib; saran SEO ditampilkan sebagai peringatan di dialog ("Masih ada 4 saran. Tetap terbitkan?").
- **Cek kualitas** diperbarui saat pengguna selesai mengetik (blur atau jeda), bukan setiap ketukan, dan memakai fungsi murni `articleQuality.ts` yang **sama** di browser dan di Server Action. Ambang batasnya persis aturan di `structure.md`: 800 sampai 1.200 kata, 3 sampai 6 H2, maksimal 10 H3, tanpa H4 sampai H6, pembuka dan penutup 50 sampai 100 kata, judul tab maksimal 37 karakter (suffix situs 23 karakter), deskripsi 140 sampai 155, 3 sampai 6 tanya jawab, 2 sampai 4 tautan internal, 1 sampai 2 tautan keluar.
- **Wajib (menahan terbit):** judul, alamat valid dan belum dipakai, isi, gambar utama dengan teks pengganti, deskripsi Google.
- **Pratinjau** membuka halaman `/admin/artikel/[id]/pratinjau` yang merender artikel dengan komponen publik yang sama (`ArticleHeader`, `ArticleMarkdown`, dan seterusnya), jadi yang terlihat sama dengan yang akan terbit. Ada pita "Pratinjau, belum terbit". Tab Pratinjau di dalam editor hanya merender isi Markdown.
- **Meninggalkan halaman** saat ada perubahan yang belum disimpan memunculkan peringatan browser.
- **Bentrok edit** (dua tab): penyimpanan membandingkan `updated_at` yang dimuat; kalau berbeda, muncul pesan "Artikel ini diubah di tempat lain. Muat ulang dulu".

### 4.5 Hapus artikel

Dialog `<dialog>` bawaan browser: judul "Hapus artikel ini?", teks yang menyebut judul artikel dan bahwa tindakan ini tidak bisa dibatalkan, tombol **Batal** (fokus awal, aman) dan **Hapus artikel**. Untuk artikel terbit, ada saran "Mau menyembunyikan sementara? Pakai Batalkan terbit." Gambar di Storage ikut dihapus.

### 4.6 Logo (`/admin/logo`)

```
Logo situs

Logo sekarang:  [gambar]            [ Kembalikan ke logo bawaan ]

Unggah logo baru: [ Tarik berkas ke sini / Pilih berkas ]   PNG, JPG, atau WebP
[x] Tampilkan nama perusahaan di samping logo
Teks pengganti logo: [Sandang Nusa Tekstil]

Pratinjau (belum disimpan):
 Header  [ logo  Nama ]        Footer  ( kapsul putih [logo] ) Nama     Tab  [ico] Nama
                                                    [ Simpan logo ]
```

Setelah dipilih, browser membuat semua ukuran, pratinjau langsung memakai gambar tersebut, dan **baru tersimpan saat menekan Simpan logo**. Peringatan ramah kalau gambar terlalu kecil (di bawah 256 px) atau tidak hampir persegi untuk ikon ("Ikon tab akan diberi ruang kosong di sisi").

### 4.7 Akun (`/admin/akun`)

Ganti kata sandi (kata sandi baru, ulangi, tombol Simpan) dan tombol Keluar. Lupa kata sandi di versi 1 ditangani dari dashboard Supabase (lewat email butuh SMTP sendiri; bisa ditambah nanti).

## 5. Aksesibilitas dan form (mengikuti modern-web-guidance)

- Semua form memakai `<form>` bawaan dengan Server Action, label terlihat yang terhubung (`for`/`id`), `autocomplete` yang benar (`username`, `current-password`, `new-password`), `required`, `maxlength`, dan tombol sekunder `type="button"`. Judul tombol berupa aksi ("Simpan draf", "Terbitkan", "Hapus artikel").
- Error ditampilkan lewat `:user-invalid` dan disinkronkan ke `aria-invalid` serta `aria-describedby` hanya saat error muncul. Satu region `aria-live="polite"` untuk pengumuman. Saat kirim gagal, fokus pindah ke ringkasan error atau isian pertama yang salah. Validasi server tetap wajib (client hanya untuk kenyamanan).
- Tombol kirim tidak dimatikan sebelum kirim, hanya sesudah klik valid (anti kirim ganda). Hasil simpan diumumkan lewat `role="status"`.
- Konfirmasi hapus dan konfirmasi "Tetap terbitkan" memakai `<dialog>` modal bawaan (`command="show-modal"`), tanpa `role="dialog"` manual, tanpa jebakan fokus buatan. Tombol aman (Batal) mendapat `autofocus`. Gulir halaman di belakang dicegah dengan `overscroll-behavior: contain`.
- Target sentuh minimal 48 px, ukuran font kontrol minimal 16 px, kontras batas isian memadai, `:focus-visible` tetap terlihat (memakai gaya yang sudah ada).
- Motion: hanya transisi singkat untuk status dan dialog, mati di bawah `prefers-reduced-motion`.

## 6. Yang perlu dilakukan pemilik (saya tidak bisa membuatnya)

Setelah kode selesai saya buatkan `docs/cms-setup.md` bergambar langkah demi langkah. Ringkasnya:

1. Buat project di supabase.com. Pilih region **Singapore** (terdekat dengan Indonesia).
2. Buka **SQL Editor**, tempel `supabase/migrations/0001_cms.sql`, klik Run. Lalu tempel `supabase/seed.sql` dan Run (memindahkan tiga artikel yang ada).
3. Buka **Authentication, Users, Add user**: isi email dan kata sandi admin, centang auto-confirm. Di pengaturan Sign In/Providers, **matikan "Allow new users to sign up"**.
4. Di SQL Editor jalankan satu baris yang mendaftarkan email itu sebagai admin (tersedia di `cms-setup.md`).
5. Buka **Project Settings, API Keys**: salin Project URL dan Publishable key ke `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`). Restart `npm run dev`.
6. Saat go-live: isi Site URL di Authentication, URL Configuration, dan set variabel yang sama di hosting.

Kunci publishable memang dirancang boleh terlihat di browser. Kunci **service role / secret jangan pernah** ditempel ke proyek ini; CMS ini tidak membutuhkannya.

## 7. Risiko dan batasan yang jujur

- **Paket gratis Supabase dapat dijeda setelah sekitar satu minggu tanpa aktivitas.** Pengunjung tidak menyentuh database karena halaman publik di-cache, jadi proyek bisa terjeda tanpa ada yang tahu. Akibatnya login admin gagal sampai dipulihkan di dashboard, dan build atau penyegaran halaman yang butuh data gagal (halaman lama tetap tampil). Untuk situs klien, pakai paket berbayar atau pastikan ada aktivitas rutin.
- Situs publik kini bergantung pada Supabase saat build dan saat penyegaran. Kalau data gagal diambil saat build, **build gagal** (lebih baik daripada menerbitkan situs kosong).
- Tidak ada pengalihan otomatis saat alamat artikel diubah, tidak ada jadwal terbit otomatis, tidak ada riwayat versi, dan tidak ada SVG. Semua bisa ditambah bertahap.
- Editor Markdown butuh sedikit pembiasaan; toolbar dan pratinjau mengurangi itu, tapi bukan WYSIWYG.
- Pemeriksa kualitas membantu mengikuti aturan SEO, tidak menjamin peringkat. Konten tetap perlu fakta nyata dari pemilik (aturan E-E-A-T di `eeat-rules.md`).

## 8. Urutan pengerjaan

| Fase | Isi | Hasil yang bisa dicek |
| --- | --- | --- |
| 1. Fondasi | Paket `@supabase/supabase-js` dan `@supabase/ssr`, `env.ts`, klien server/browser/publik, `proxy.ts`, migrasi SQL, skrip `generate-seed.mjs`, `.env.example`, `cms-setup.md` | Situs tetap jalan tanpa `.env`; SQL siap ditempel |
| 2. Data publik dari Supabase | Repository, service async, refaktor 11 pemanggil, `dynamicParams`, `remotePatterns`, penyegaran cache | Situs identik dengan sekarang (data statis); beralih ke Supabase saat env diisi |
| 3. Login dan kerangka admin | `/admin/masuk`, penjaga rute, `AdminShell`, beranda admin, akun | Masuk, keluar, rute terlindungi |
| 4. Artikel | Daftar, editor, `articleQuality`, unggah gambar, pratinjau, terbit/batal/hapus | Tulis lalu terbit, artikel muncul di situs |
| 5. Logo | Uploader dan pratinjau, ukuran turunan, `Logo`, ikon, manifest, JSON-LD | Ganti logo, header/footer/tab berubah |
| 6. Dokumen dan verifikasi | Perbarui `structure.md`, `cms-setup.md`, build produksi, cek sintaks, cek keyboard dan layar sempit | Daftar hasil uji jujur |

## 9. Verifikasi (apa yang bisa dan tidak bisa saya buktikan)

- **Bisa tanpa Supabase:** build produksi, cek sintaks, pemeriksa kualitas dijalankan pada tiga artikel yang ada (harus lolos semua agar cocok dengan standar yang sudah dipakai), situs publik tetap sama persis, halaman `/admin` mengalihkan ke masuk atau panduan.
- **Butuh proyek Supabase milik kamu:** login, simpan, unggah gambar, RLS, penyegaran cache. Setelah kamu mengisi `.env.local`, saya uji lewat browser. Untuk login saya sarankan kamu membuat **akun admin uji** (atau kamu sendiri yang mengetik kata sandi di halaman masuk), jangan kata sandi akun lain.
- Uji RLS: coba tulis lewat klien anonim dan harus ditolak; baca draf lewat klien anonim dan harus kosong.
