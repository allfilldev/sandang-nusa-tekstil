# Struktur Proyek: Company Profile Manufaktur Tekstil (Sandang Nusa Tekstil)

Situs company profile untuk perusahaan manufaktur tekstil (kain tenun, kain rajut, dan kain jadi). Dibangun dengan Next.js (App Router), TypeScript, dan Tailwind, dengan CMS ringan berbasis Supabase untuk mengganti logo dan mengelola artikel. Nama merek **Sandang Nusa Tekstil** adalah nama contoh dan bisa diganti di `src/data/site.ts`. Rencana desain ada di `docs/design-plan.md` (konsep awal) dan `docs/design-plan-v2.md` (bentuk membulat dan layout berlapis yang sedang dipakai). Rencana CMS ada di `docs/cms-plan.md` dan cara memasangnya di `docs/cms-setup.md`. Perbarui file ini setiap kali ada file atau folder yang ditambah, diganti nama, atau dipindah.

## Perintah

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` | Menjalankan server pengembangan |
| `npm run build` | Build produksi |
| `npm run start` | Menjalankan hasil build |
| `node scripts/generate-seed.mjs` | Membuat ulang `supabase/seed.sql` dari `src/data/articles` |

## Variabel lingkungan (`.env.example`)

| Nama | Fungsi |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL produksi tanpa garis miring di akhir. Dipakai canonical, sitemap, dan JSON-LD. Bawaan: `http://localhost:3000` |
| `NEXT_PUBLIC_ALLOW_INDEXING` | `true` hanya saat go-live. Selain itu `robots.txt` memblokir semua crawler dan halaman diberi `noindex` |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Kode verifikasi Google Search Console (opsional) |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | Kode verifikasi Bing Webmaster Tools (opsional) |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL Supabase. Kosong berarti situs memakai data statis dan panel admin menampilkan panduan penyambungan |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Kunci publishable Supabase. Jangan pernah mengisi kunci secret atau service role |

## Arsitektur

Lapisan memakai Clean Architecture ringan. Arah dependensi: `app` dan `components` bergantung ke `services`, `services` ke `repositories`, `data`, dan `domain`, `repositories` ke `lib/supabase` dan `data`, `domain` tidak bergantung ke apa pun. File `.ts` (logika) dan `.tsx` (tampilan) dipisah folder.

```
docs/
  design-plan.md              Rencana desain awal (palette, tipografi, layout, motion)
  design-plan-v2.md           Rencana desain v2: diagnosis, sistem bentuk, hero berlapis, bento, kartu artikel
  image-assets.md             Daftar aset gambar dan prompt final imagegen
  cms-plan.md                 Rencana CMS: arsitektur, skema, layar admin, risiko
  cms-setup.md                Langkah memasang Supabase dan mendaftarkan admin
supabase/
  migrations/0001_cms.sql     Tabel articles, site_settings, admin_users, fungsi is_admin(), RLS, bucket Storage "media"
  seed.sql                    Tiga artikel awal (dibuat skrip, jangan diedit tangan)
scripts/
  generate-seed.mjs           Membuat supabase/seed.sql dari src/data/articles
public/
  icon.svg, favicon.ico, apple-icon.png   Ikon bawaan (dipakai kalau belum ada logo dari CMS)
  icon-192.png, icon-512.png  Ikon manifest dan logo Organization bawaan (latar transparan)
  images/artikel/*.webp       Ilustrasi AI bergaya foto untuk artikel (1200x675, di bawah 100 KB)
  images/gulungan-kain.webp   Ilustrasi AI gulungan kain (halaman Tentang dan 404)
  images/hero-tekstil.webp    Ilustrasi AI hero beranda (1000x1000, di bawah 100 KB)
  images/produk/*.webp       Ilustrasi AI tiga kategori kain (960x720, di bawah 100 KB)
src/
  proxy.ts                    Menyegarkan sesi Supabase dan mengarahkan ke halaman masuk. Matcher hanya /admin/:path*
  app/                        Rute Next.js dan file konvensi metadata
    layout.tsx                Layout root: html lang="id", font Archivo dan Source Serif 4, metadata global (ikon dari CMS), meta text-scale, JSON-LD
    globals.css               Token warna dan radius, kelas squircle, lengkung hero, pita tenunan, hover foto, navigasi popover, tabel responsif, benang proses, kontrol form dan dialog admin
    not-found.tsx             Halaman 404 (status 404 asli)
    robots.ts, sitemap.ts, manifest.ts   (sitemap dan manifest membaca data CMS)
    opengraph-image.tsx, twitter-image.tsx   Gambar sosial bawaan (1200x630)
    feed.xml/route.ts         Feed RSS artikel
    llms.txt/route.ts         Ringkasan situs untuk mesin jawaban AI
    (site)/                   Semua halaman publik, dibungkus SiteShell
      layout.tsx, loading.tsx, page.tsx      Beranda
      produk/                 Kelompok kain, tabel struktur kain, cara meminta sampel
      proses-produksi/        Tahapan produksi (benang bernomor) dan pengendalian mutu
      artikel/                Daftar artikel
        [slug]/               Detail artikel (page, loading, opengraph-image, twitter-image). dynamicParams aktif agar artikel baru dari CMS tampil tanpa build ulang
      tentang/, kontak/       Halaman informasi
      privasi/, syarat-ketentuan/, kebijakan-editorial/   Halaman legal
    admin/                    Panel admin (selalu dinamis, noindex)
      layout.tsx              Metadata noindex dan force-dynamic
      masuk/page.tsx          Halaman masuk
      (panel)/                Grup berlayout AdminShell dan penjaga akses: beranda admin, akun, logo, artikel (daftar, baru, [id])
      (preview)/artikel/[id]/pratinjau/   Pratinjau artikel dengan bingkai situs publik (SiteShell) dan komponen publik yang sama
      actions/                Server Action (.ts): auth.ts, articles.ts, branding.ts
  components/                 Komponen tampilan (.tsx)
    brand/                    Logo (async, memakai logo CMS atau LogoMark bawaan), LogoMark (tenunan 2x2)
    layout/                   SiteShell, SiteHeader, SiteNav (client, popover), SiteFooter, WhatsAppFloatingButton
    home/                     HeroTextileImage (dua foto berlapis, foto utama prioritas tinggi), WeaveRibbon (pita tenunan CSS)
    product/                  ProductBento (beranda), ProductSwatches (halaman Produk), StructureTable, ProcessOverview, ProcessThread
    article/                  ArticleView (tampilan halaman artikel, dipakai publik dan pratinjau), ArticleHeader, ArticleFigure, ArticleMarkdown, ArticleCards (beranda dan daftar), ArticleLedger (artikel terkait), AuthorBox, RelatedArticles
    legal/                    LegalDocumentView (layout bersama untuk halaman legal)
    seo/                      JsonLd
    skeletons/                RouteSkeleton (varian: home, list, article, page)
    og/                       renderOgImage (kartu gambar sosial)
    ui/                       Container, ContentSheet, ButtonLink, Breadcrumbs, FaqSection, WhatsAppButton (tombol "Chat WhatsApp Sekarang" hijau #25D366 dengan ikon), WhatsAppIcon
    admin/                    Panel admin: AdminShell, AdminSurface, AdminNav, AdminSetupGuide, LoginForm, ChangePasswordForm, ConfirmDialog (dialog native), DeleteArticleButton, StatusBadge, adminStyles.ts
      form/                   AdminForm (kirim lewat onSubmit), FormFields, SubmitButton, FormPending, fieldValidation.ts (sinkron :user-invalid ke aria-invalid)
      article/                ArticleEditor, MarkdownEditor (toolbar dan pratinjau), ImageUploadField, FaqEditor, QualityPanel, SerpPreview
      logo/                   LogoManager (unggah, pratinjau header/footer/tab, simpan)
  domain/                     Tipe entitas (.ts): article (Article, ManagedArticle), author, branding, faq, formState, home, legal, process, product, site
  data/                       Sumber data statis (.ts), cadangan kalau Supabase belum tersambung
    site.ts                   Konfigurasi situs, nomor WhatsApp, pesan WA
    navigation.ts             Menu utama, footer, dan baris "Informasi hukum"
    authors.ts                Data tim/penulis (stats dan profiles opsional)
    home.ts, products.ts, process.ts   Teks beranda, produk (kategori dan struktur kain), proses produksi
    articles/                 Satu file per artikel (konten markdown) plus index.ts. Juga sumber supabase/seed.sql
    legal/                    privacy.ts, terms.ts, editorial.ts plus index.ts
  repositories/               Akses data (.ts)
    publicArticleRepository.ts, brandingRepository.ts   Bacaan publik (klien tanpa cookie); Supabase atau data statis
    adminArticleRepository.ts, adminBrandingRepository.ts, mediaRepository.ts   Tulis/baca dengan sesi admin (kena RLS)
    articleMapper.ts          Baris database <-> tipe domain
  lib/                        Fungsi murni dan util (.ts)
    url.ts, date.ts, text.ts, whatsapp.ts, bytes.ts, slug.ts
    tokens.ts                 Mengganti token {{brand}}, {{whatsappUrl}}, {{whatsappNumber}} di konten
    jsonLd.ts                 Pembuat JSON-LD (Organization, WebSite, Breadcrumb, Article, FAQ)
    metadata.ts               Pembuat metadata halaman dan artikel
    articleReading.ts         Perkiraan waktu baca
    articleQuality.ts         Pemeriksa kualitas artikel (dipakai browser dan server)
    articleForm.ts            Membaca FormData editor menjadi ArticleContent (dipakai browser dan server)
    markdownEdit.ts           Perubahan teks untuk tombol toolbar Markdown
    imageResize.ts            Pengecil gambar di browser (canvas), turunan ikon logo
    storageUpload.ts          Unggah ke Storage dari browser
    logoFiles.ts              Nama berkas turunan logo (disepakati browser dan server)
    cmsCache.ts               Menyegarkan halaman publik setelah admin menyimpan (updateTag, revalidatePath)
    supabase/                 env.ts, public.ts (klien tanpa cookie, fetch bertag), server.ts (klien sesi), browser.ts, session.ts (proxy), adminSession.ts (cek login dan admin)
  services/                   Use case (.ts): articleService, authorService, legalService, brandingService, adminArticleService, adminBrandingService
```

## Aturan konten yang dijaga kode

- **Artikel:** ditulis lewat panel admin (atau di `src/data/articles/*.ts` untuk data statis). Panjang 800 sampai 1.200 kata (dihitung dari pembuka, isi, tanya jawab, dan penutup), 3 sampai 6 H2, maksimal 10 H3, tanpa H4 sampai H6, pembuka dan penutup masing-masing 50 sampai 100 kata, 3 sampai 6 tanya-jawab, 2 sampai 4 tautan internal, 1 sampai 2 tautan keluar ke sumber resmi. Panel admin memeriksanya langsung lewat `src/lib/articleQuality.ts`; hanya isian penting yang menahan terbit, angka di atas berupa saran.
- **Meta:** judul tab memakai suffix " | Sandang Nusa Tekstil" (23 karakter), jadi `metaTitle` artikel dan judul halaman maksimal 37 karakter. Deskripsi meta 140 sampai 155 karakter.
- **Data bisnis:** tidak ada kapasitas, sertifikasi, klien, tahun berdiri, alamat, harga, jumlah minimum, atau testimoni karangan. `authors.ts` menerima `stats` dan `profiles`; kotak penulis, halaman Tentang, dan skema Person/`sameAs` hanya menampilkannya kalau diisi data asli.
- **Gambar:** ilustrasi AI bergaya foto, bukan dokumentasi pabrik atau hasil uji produk. Tidak ada label di atas gambar. Pengungkapannya ada di teks alternatif tiap gambar (berawalan "Ilustrasi AI") dan di halaman Kebijakan editorial. Daftar aset dan prompt final ada di `docs/image-assets.md`. Untuk gambar di markdown, tulis keterangan di title: `![alt](url "keterangan")`.
- **Angka contoh:** perhitungan di artikel (misalnya GSM) diberi keterangan sebagai contoh, bukan data produk.

## Keputusan teknis

- **Cache Components dimatikan** (bawaan scaffold Next.js 16.4 menyalakannya). Jadi hanya halaman aktif yang ada di DOM dan `RouteGuard` tidak diperlukan. Kalau suatu saat diaktifkan, tambahkan `RouteGuard` di `template.tsx` sesuai aturan SEO.
- **Navigasi:** `popover="auto"` dan `popovertarget` bawaan browser, tanpa pustaka animasi. Titik pindah antara menu popover dan menu sebaris memakai container query (`44em`), bukan pengukuran JavaScript. Tanda halaman aktif lewat `aria-current="page"` dari `SiteNav`.
- **Gambar beranda:** hero dan kartu produk memakai ilustrasi AI bergaya foto. Static import menghasilkan URL berdasarkan hash isi gambar; cara yang sama dipakai di halaman Tentang dan 404 untuk mencegah cache aset lama. Hero dimuat eager dengan prioritas tinggi, kartu produk lazy.
- **Bentuk:** token `--radius-photo` (2rem), `--radius-card` (1.25rem), `--radius-sheet` (2rem), dan `--radius-panel` (2.5rem) menjadi utilitas `rounded-*`. Kelas `squircle` menambah `corner-shape: squircle` sebagai peningkatan progresif di atas radius biasa. Tombol dan label berbentuk pil. Batas bawah hero melengkung lewat `hero-curve`.
- **Motion beranda:** foto utama hero memperkecil `scale` dari 1,06 ke 1 (tanpa fade agar LCP tidak tertunda), foto kedua dan label menyusul, lalu pita tenunan menenun masuk. Semua animasi dimatikan oleh `prefers-reduced-motion`. Foto kartu membesar sedikit saat hover dan saat fokus keyboard.
- **Motion:** garis benang di Proses produksi memakai `animation-timeline: view()` dengan nilai cadangan garis penuh. Panel rincian produk memakai `interpolate-size` dalam `@supports`.
- **Tabel:** tabel struktur kain bertumpuk di layar sempit (kelas `data-table-stack`, label dari atribut `data-label`). Tabel di artikel hanya bergulir horizontal.
- **Skala teks:** `<meta name="text-scale" content="scale">` dipasang dan ukuran font root tidak diubah.
- Setiap rute di `(site)` punya `loading.tsx` dengan `RouteSkeleton`. Kesesuaian tinggi skeleton (selisih maksimal 20 px di 1280 px) belum diukur.
- Lottie belum dipasang. Slot yang disiapkan: halaman 404 dan halaman Kontak (file `.lottie` maksimal 100 KB, disediakan pemilik).
- Semua tautan WhatsApp memakai nomor dan pesan dari `rules.md` ("konsultasi pembuatan website"). Untuk klien nyata, ganti `whatsapp` di `src/data/site.ts` dengan nomor dan pesan milik klien.

### CMS (Supabase)

- **Halaman publik tidak membaca cookie**, jadi tetap statis. `proxy.ts` hanya berjalan di `/admin`. Pembacaan publik memakai klien tanpa cookie dengan `fetch` bertag (`cms`, jaring pengaman 1 jam); Server Action admin menyegarkannya lewat `updateTag` dan `revalidatePath`.
- **Keamanan ada di database.** RLS membatasi pengunjung hanya ke artikel terbit dan pengaturan logo; hanya akun di `admin_users` yang bisa menulis (termasuk bucket `media`). `proxy.ts` hanya untuk UX; setiap halaman dan Server Action admin memeriksa ulang lewat `getClaims()` dan `is_admin()`. Tidak ada service-role key di aplikasi.
- **Jalur data:** Supabase kalau env terisi, selain itu data statis di `src/data`. Kalau Supabase terisi tetapi gagal dibaca saat build, build gagal (lebih baik daripada menerbitkan situs kosong).
- **Gambar diproses di browser** (canvas, WebP, di bawah 100 KB) dan diunggah langsung ke Storage dengan sesi admin. Tidak memakai `sharp` dan tidak terkena batas body Server Action. Nama berkas memuat hash isi.
- **Form admin** dikirim lewat `onSubmit` (bukan atribut `action`) karena React 19 mereset form setelah action selesai, yang menghapus tulisan editor. Galat ditampilkan lewat `:user-invalid` dan disinkronkan ke `aria-invalid`.
- **Ikon tab** dideklarasikan di `generateMetadata` root layout. File ikon di `src/app` tidak dipakai karena akan menimpa pengaturan ini; ikon bawaan ada di `public/`.
- **Dialog** memakai `<dialog>` bawaan lewat `showModal()`. Margin dikembalikan ke `auto` di `.admin-dialog` karena preflight Tailwind menghapusnya.
- **Gambar Supabase lokal:** `images.dangerouslyAllowLocalIP` aktif otomatis hanya kalau host Supabase yang dikonfigurasi adalah localhost.

## Sebelum go-live

1. Isi `NEXT_PUBLIC_SITE_URL` dengan domain final dan set `NEXT_PUBLIC_ALLOW_INDEXING=true`.
2. Ikuti `docs/cms-setup.md`: project Supabase, dua file SQL, akun admin, dan variabel Supabase di hosting. Ganti kata sandi admin.
3. Ganti nama contoh, logo (lewat panel admin), dan WhatsApp dengan data klien. Isi data asli yang tersedia: tahun berdiri, lokasi, kapasitas, sertifikasi, profil tim, email, dan foto pabrik.
4. Pemilik meninjau tiga halaman legal di `src/data/legal` (draf dari fakta yang ada) dan deskripsi kelompok kain di `src/data/products.ts`.
5. Daftarkan situs di Google Search Console dan Bing Webmaster Tools, isi kode verifikasi, lalu kirim `sitemap.xml`.
6. Pasang analitik dan perbarui halaman privasi sebelum mengaktifkannya.
7. Pastikan hosting memaksa HTTPS dan satu versi domain (www atau tanpa www) lewat redirect 301.
8. Uji dengan Lighthouse, PageSpeed Insights, dan Rich Results Test.
9. Perhatikan: project Supabase paket gratis dapat dijeda setelah sekitar satu minggu tanpa aktivitas. Untuk situs klien, pertimbangkan paket berbayar.
