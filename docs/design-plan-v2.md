# Design plan v2: Lebih Menarik, Lembut, dan Berlapis

Tanggal: 2026-11-19. Status: menunggu approval. Belum ada kode yang diubah. Rencana ini menggantikan bagian layout dan bentuk dari `design-plan.md`. Subjek, palette, dan font tidak berubah.

## 1. Diagnosis: kenapa terasa kurang menarik

Sudut kotak memang ikut berpengaruh, tapi bukan satu-satunya sebab. Hasil pemeriksaan tampilan saat ini:

1. **Semua serba siku.** Foto, tombol (radius 2 px), kartu, dan panel sama-sama tajam. Tekstil itu lembut dan jatuh mengalir, jadi bentuk yang kaku berlawanan dengan subjeknya. Satu-satunya elemen bulat hanya tombol WhatsApp.
2. **Foto dibingkai kaku dan kecil.** Foto hero (hasil AI yang kamu tambahkan) hanya persegi 430 px dengan bingkai putih tebal seperti polaroid, dan keterangan "Ilustrasi AI" muncul sebagai baris teks terpisah. Foto yang bagus jadi terlihat seperti lampiran.
3. **Ritme halaman monoton.** Tiap bagian memakai pola yang sama: judul rata kiri, satu paragraf pendek, lalu grid. Ada banyak ruang kosong di kanan judul, dan tidak ada elemen yang saling bertumpuk. Bagian Proses dan Artikel sama sekali tanpa gambar.
4. **Identitas tenunan hilang.** Setelah hero tenunan diganti foto, tidak ada lagi elemen yang khas milik situs ini. Sekarang halamannya mirip templat korporat biasa.
5. **Warna hangat nyaris tidak dipakai.** Kunyit hanya muncul di satu tombol, sisanya biru tua dan putih pucat. Padahal foto-fotomu punya nila, kunyit, dan putih gading yang cantik.

Foto-foto AI yang sudah kamu tambahkan tetap dipakai. Aku tidak mengganti atau menghapusnya.

## 2. Konsep: kain yang jatuh lembut

Semua bentuk dibuat membulat dan berlapis, seperti kain yang tertata. Satu hal yang dibuat berani: **hero dengan foto besar yang bertumpuk di batas bagian**, ditambah **pita tenunan** kecil sebagai ciri khas. Bagian lain tetap tenang.

### Sistem bentuk (tidak satu radius untuk semua)

| Elemen | Bentuk |
|---|---|
| Foto besar (hero, produk, artikel) | `border-radius: 2rem` dan `corner-shape: squircle` sebagai peningkatan progresif |
| Kartu dan panel | `1.25rem` |
| Tombol, label, chip | Pil penuh |
| Panel isi halaman (`ContentSheet`) | `2rem` |
| Pembungkus tabel | `1rem` |
| Batas hero ke bagian berikutnya | Lengkung elips di bawah (`0 0 50% 50% / 0 0 3rem 3rem`), seperti kain yang menggantung |
| Footer | Sudut atas membulat `2.5rem` |

## 3. Layout

```
+-------------------------------------------------------------------+
| (pil) logo                        Produk Proses Artikel Tentang Kontak |
+-------------------------------------------------------------------+
|  (latar Nila Tua, bawah melengkung)                               |
|  Manufaktur Tekstil:                +------------------------+    |
|  Kain Tenun, Rajut,                 |   foto hero besar      |    |
|  dan Jadi                           |   sudut squircle       |----+----+
|                                     |   [pil: Ilustrasi AI]  |  foto  |
|  Dua kalimat jawaban.               +------------------------+  kecil |
|  (Lihat produk) (WhatsApp)           [pil: Dari benang...]     +-----+
+--~~~~~~ pita tenunan (animasi sekali) ~~~~~~---------------------+
```

- **Hero:** foto hero dibuat jauh lebih besar tanpa bingkai putih. Foto kedua (kain jadi) yang lebih kecil menumpuk di sudut dan menembus ke bagian di bawahnya. Keterangan "Ilustrasi AI" berubah jadi pil kecil di atas foto, jadi tetap terlihat jujur tapi tidak menambah baris.
- **Pita tenunan:** pita setinggi sekitar 3,5 rem berpola anyaman polos (Kunyit dan Nila Pudar) di bawah hero. Ini pengganti ringkas dari hero tenunan sebelumnya, supaya identitas tenun tetap ada.
- **Produk:** tata letak bento. Kain tenun jadi kartu besar, kain rajut dan kain jadi bertumpuk di sebelahnya. Judul dan pil "pemakaian umum" ada di atas foto dengan scrim Nila di bagian bawah agar teks tetap terbaca (kontras minimal 4,5:1). Di mobile jadi satu kolom.
- **Proses:** panel membulat di dalam wadah (bukan pita penuh), dengan enam tahap dalam pil yang tersambung garis benang putus-putus. Di mobile berubah vertikal.
- **Artikel:** tiga kartu dengan gambar artikel (16:9, sudut membulat), judul, ringkasan, dan waktu baca. Di mobile menjadi baris yang bisa digeser dengan snap, seperti panduan `natural-interactions`.
- **CTA:** panel Kunyit penuh dengan teks Nila dan tombol pil Nila, supaya ada kehangatan setelah banyak biru.
- **Halaman lain:** Produk, Artikel, Tentang, Kontak, dan 404 memakai bentuk yang sama (gambar dan panel membulat). Isi teks tidak berubah.

## 4. Tipografi dan warna

- Font tetap Archivo (judul) dan Source Serif 4 (isi).
- Teks isi naik sedikit ke `1.1875rem` dengan lebar baca `62ch`, supaya terasa lebih lega.
- Judul bagian diberi satu garis benang Kunyit setebal 6 px di bawahnya sebagai penanda struktur. Ini bukan label atau teks tambahan di atas judul.
- Palette tetap 6 warna. Permukaan berlapis dibuat dengan `color-mix` dari Nila, bukan warna baru.

## 5. Motion

**Satu momen di beranda (saat dimuat):**

1. Judul dan lead langsung tampil, supaya LCP aman.
2. Foto hero naik pelan dari `scale: 1.06` ke `1` dengan fade, 480 ms, ease-out.
3. Foto kecil menyusul 120 ms kemudian, lalu pil label muncul dengan opacity.
4. Pita tenunan menenun masuk dari kiri dan kanan, memakai properti `translate`.

Mode `prefers-reduced-motion` menampilkan semuanya langsung dalam kondisi jadi.

**Respons terhadap aksi (selalu boleh):** saat kartu produk dan artikel disentuh atau di-hover, fotonya memperbesar sedikit (`scale: 1.04`) di dalam bingkai membulat, dengan tampilan yang sama saat fokus keyboard. Tombol menekan ke `scale: 0.97`. Efek hover tidak menjadi satu-satunya cara memahami konten.

## 6. Panduan modern-web-guidance yang dipakai

| Panduan | Penerapan |
|---|---|
| `css` (bagian Shapes) | `corner-shape: squircle` sebagai peningkatan di atas `border-radius` biasa, yang tetap berfungsi di browser tanpa dukungan |
| `complex-shapes` | Lengkung di batas hero dan footer memakai `border-radius` elips atau `clip-path`, dengan bentuk dasar tetap terbaca jika masker tidak didukung |
| `natural-interactions` | Umpan balik hover, tekan, dan fokus yang berbeda tiap keadaan. Baris artikel mobile bisa digeser dengan `scroll-snap-type`. Efek hover juga muncul saat fokus keyboard |
| `individual-transform-properties` | Foto hero dan pita tenunan memakai `translate` dan `scale` terpisah dengan nilai identitas di elemen dasar |
| `optimize-image-priority` | Foto hero tetap `fetchpriority="high"` tanpa `loading="lazy"`. Foto lain lazy |
| `responsive-design` dan `fluid-scaling` | Ukuran judul tetap `clamp()` dengan rem ditambah vw. Layout bento memakai container query |

## 7. Yang akan diubah

- `globals.css`: token radius, lengkungan, pita tenunan, hover kartu.
- Komponen: `ButtonLink`, `HeroTextileImage` (komposisi dua foto), `ProductSwatches` (bento), kartu artikel baru untuk beranda, `ProcessOverview`, `ContentSheet`, `SiteFooter`, `SiteNav` (tombol menu pil), `Breadcrumbs` tidak berubah.
- Halaman: beranda, Produk, Tentang, 404, dan gambar artikel.
- Data dan teks tidak diubah. File yang kamu edit sendiri tidak aku timpa, aku hanya menambah kelas dan komponen.
- Aku tetap tidak menjalankan build, typecheck, atau lint. Verifikasi memakai dev server.

## 8. Yang masih perlu dari kamu

- Setuju atau tidak dengan arah ini.
- Panel CTA berwarna Kunyit (kuning) penuh: cocok, atau tetap biru tua?
- Pita tenunan kecil di bawah hero: dipertahankan sebagai ciri khas, atau dibuang?
