# Design plan: Company Profile Manufaktur Tekstil

Tanggal: 2026-11-19. Status: menunggu approval. Belum ada kode. Proyek lama `panduan-website-umkm` tidak disentuh.

## 1. Subjek (proposal, perlu konfirmasi)

- **Produk:** situs company profile sebuah perusahaan manufaktur tekstil (kain tenun, kain rajut, dan kain jadi).
- **Audiens:** pembeli B2B, yaitu pemilik konveksi dan pabrik garmen, merek fesyen, staf pembelian, dan importir. Mereka membuka situs untuk menilai kemampuan pabrik, bukan untuk berbelanja.
- **Tugas utama situs:** menunjukkan kemampuan produksi dengan jujur dan jelas, lalu mengarahkan ke permintaan sampel atau penawaran lewat WhatsApp.
- **Nama merek:** **Sandang Nusa Tekstil** adalah nama contoh. Kalau ada nama asli, nama ini dan logonya diganti di satu tempat (`src/data/site.ts`).
- **Asumsi:** situs ini tema demo untuk folder `themes` (aturan WA di `rules.md` dipakai di setiap tema). Kalau ini untuk klien nyata, kirim data asli dan semua teks contoh diganti.

### Batas kejujuran (aturan E-E-A-T)

Aku tidak mengarang kapasitas produksi, jumlah mesin, sertifikasi, daftar klien, tahun berdiri, alamat pabrik, atau testimoni.

- Isi situs memakai pengetahuan umum tentang tekstil (jenis anyaman, tahapan produksi, cara membaca GSM) yang bisa ditautkan ke sumber resmi.
- Angka dan klaim khusus perusahaan punya slot di `src/data`. Slot itu baru tampil kalau diisi data asli.
- Tabel spesifikasi per produk dikirim saat permintaan sampel. Situs tidak menampilkan spesifikasi karangan.

## 2. Nama proyek dan cara kerja

- Folder baru: `D:\_project\themes\sandang-nusa-tekstil`, nama paket `sandang-nusa-tekstil`.
- Arsitektur dari proyek lama dipakai lagi (domain, data, services, lib, components) lalu isi dan desainnya diganti total. Proyek `panduan-website-umkm` tetap utuh, tidak dihapus.
- Dev server lama di port 3000 dihentikan sebelum proyek baru dijalankan.

## 3. Konsep visual: tenunan

Tekstil punya bahasa visual sendiri: benang lusi (vertikal) dan benang pakan (horizontal) yang saling menyilang, tepi kain bergerigi (pinked edge), dan kartu sampel kain. Situs ini dibangun dari satu gagasan: **anyaman polos yang ditenun di depan mata pengunjung**.

Hero beranda adalah blok tenunan yang terbuat dari CSS. Benang pakan meluncur masuk bergantian dari kiri dan kanan, melewati benang lusi yang diam, sehingga terlihat "atas-bawah" seperti tenun asli. Tekstur kain lain di situs (kartu produk, pemisah bagian) memakai pola yang sama dengan variasi: twill, satin, rib, dan rajut.

### Palette (6 warna bernama)

| Nama | Hex | Alasan |
|---|---|---|
| Nila Tua | `#1F2D5C` | Celupan indigo, pewarna tekstil paling ikonik di Nusantara. Jadi warna teks dan bagian gelap. Kontras sekitar 12:1 di atas Kapas Dingin |
| Nila Pudar | `#C9D2EA` | Nila yang sudah pudar. Untuk isian, garis, dan tekstur benang |
| Kapas Dingin | `#F3F5F8` | Kapas belum dicelup dengan nuansa dingin, bukan krem. Latar halaman |
| Benang Putih | `#FFFFFF` | Permukaan lembar dan kartu |
| Kunyit | `#E3A21A` | Pewarna alami kunyit. Aksen untuk penanda dan tombol di atas Nila Tua (kontras sekitar 6:1). Tidak pernah dipakai sebagai teks di atas terang |
| Hijau Chat | `#0A7B45` | Khusus tombol WhatsApp, teks putih kontras sekitar 5,3:1 |

Hanya mode terang, dan deklarasi `color-scheme: light` dipasang. Dark mode tidak diminta.

## 4. Type

Dua typeface yang jelas berbeda:

- **Archivo** (variabel, sumbu lebar `wdth` dan bobot). Judul dan label antarmuka. H1 memakai lebar 125 (expanded) bobot 800, kesan huruf papan nama pabrik dan label gulungan kain.
- **Source Serif 4** (variabel, sumbu `opsz`). Isi artikel dan paragraf. Serif memberi kesan kriya dan nyaman dibaca panjang, sekaligus berbeda tegas dari judul.

Tidak ada monospace. Angka di tabel spesifikasi memakai `tabular-nums` di Archivo.

### Type scale

| Peran | Ukuran | Line-height | Catatan |
|---|---|---|---|
| H1 | `clamp(2.5rem, 1.5rem + 4.5vw, 5rem)` | 1.0 | Archivo 800, lebar 125. Maksimal 2x minimum |
| H2 | `clamp(1.875rem, 1.4rem + 1.8vw, 2.75rem)` | 1.1 | Archivo 700 |
| H3 | `1.375rem` | 1.25 | Archivo 700 |
| Isi | `1.125rem` | 1.7 | Source Serif 4, lebar maksimal 68 karakter |
| Label | `0.9375rem` | 1.4 | Archivo 600 |

Ukuran font root tidak diubah, jadi skala teks OS bisa bekerja.

## 5. Layout

**Konsep:** halaman seperti lembar katalog pabrik. Bagian gelap Nila Tua berselang-seling dengan lembar terang, dan benang vertikal tipis menjalar di tepi halaman sebagai penghubung antarbagian. Teks rata kiri.

```
+-------------------------------------------------------------------+
| [logo] Sandang Nusa Tekstil       Produk Proses Artikel Tentang Kontak |
+-------------------------------------------------------------------+
| (latar Nila Tua)                                                  |
|  Manufaktur Tekstil:                +-------------------------+   |
|  Dari Benang sampai                 | tenunan polos dari CSS  |   |
|  Kain Jadi                          | benang pakan meluncur   |   |
|                                     | masuk, atas-bawah       |   |
|  Dua kalimat jawaban langsung.      |  [label: Anyaman polos] |   |
|  [Minta sampel kain] [Lihat proses] +-------------------------+   |
|                                     Ilustrasi: anyaman polos      |
+-------------------------------------------------------------------+
|              [ Chat WhatsApp Sekarang ]  (sticky, tengah bawah)   |
```

- **Produk:** kartu sampel kain. Tiap kategori punya tekstur CSS berbeda (anyaman polos, twill, satin, rib, rajut) dengan tepi bergerigi. Bentuknya tidak seragam dan tidak memakai satu radius untuk semua.
- **Proses produksi:** satu jalur benang vertikal dengan tahapan bernomor, karena tahapan produksi memang berurutan.
- **Tabel jenis anyaman:** tabel yang berubah jadi tumpukan kartu di layar sempit.
- **Artikel:** lembar putih dengan kotak "Tentang penulis" menempel di sidebar desktop, dan di bawah artikel pada mobile (aturan E-E-A-T).
- **Tombol WhatsApp** "Chat WhatsApp Sekarang" besar dan sticky di bawah tengah di setiap halaman, dengan link dari `rules.md`.

## 6. Motion

**Beranda, satu momen orkestrasi:** tenunan terjalin.

1. Judul dan lead tampil langsung tanpa animasi, supaya LCP aman.
2. Delapan benang pakan meluncur masuk bergantian dari kiri dan kanan (properti `translate` terpisah, 420 ms, jeda 60 ms, ease-out). Lapisan kotak-kotak benang lusi yang diam di atasnya menciptakan efek menyilang.
3. Label "Anyaman polos" muncul dengan opacity setelah benang terakhir.

Mode `prefers-reduced-motion` menampilkan tenunan langsung dalam kondisi jadi.

**Halaman Proses produksi:** satu momen berbasis scroll. Garis benang terisi mengikuti posisi gulir (`animation-timeline`, hanya `scale`), dengan fallback garis penuh di browser yang belum mendukungnya.

**Motion yang merespons aksi:**
- Menu seluler terbuka dengan fade dan geser (`@starting-style`).
- Panel rincian produk membuka dengan animasi tinggi (`interpolate-size`).
- Tombol WhatsApp menekan ke `scale: 0.98`.

Hanya `translate`, `rotate`, `scale`, dan `opacity` yang dianimasikan.

## 7. Lottie

Aku tidak membuat file Lottie sendiri. Situs dibangun lengkap tanpa Lottie, dan dua slot terbuka untuk file `.lottie` (maksimal 100 KB) kalau kamu menyediakannya:

1. **Halaman 404:** gulungan kain yang terurai pelan dan terlilit kembali, loop halus.
2. **Halaman Kontak:** teropong tenun (shuttle) bolak-balik di antara benang lusi, loop halus.

Paket `@lottiefiles/dotlottie-react` baru dipasang kalau filenya sudah ada.

## 8. Panduan modern-web-guidance yang dipakai

Panduan diambil dengan CLI `modern-web-guidance` (skill sudah terpasang di `~/.agents/skills`). Yang diterapkan:

| Panduan | Penerapan di situs ini |
|---|---|
| `navbar` | Menu seluler memakai `popover="auto"` dan `popovertarget` bawaan browser, bukan state JavaScript. Halaman aktif ditandai `aria-current="page"`. Posisi popover memakai `anchor()` dengan nilai cadangan karena Anchor Positioning belum didukung Firefox. Pustaka `motion` tidak diperlukan lagi |
| `individual-transform-properties` | Animasi tenunan dan stempel label memakai `translate`, `rotate`, `scale` terpisah dengan nilai identitas di elemen dasar, supaya stacking context tidak berubah saat animasi |
| `fluid-scaling` dan `responsive-design` | Judul memakai `clamp()` dengan rem ditambah vw, maksimal 2,5 kali minimum. Kartu sampel memakai satuan `cqi` |
| `responsive-table` | Tabel anyaman: pembungkus `role="region"`, `tabindex="0"`, dan tampilan bertumpuk lewat `@container` |
| `respect-os-text-scale` | `<meta name="text-scale" content="scale">`. Ukuran font root tidak diubah, dan layout memakai min-height, bukan tinggi tetap |
| `animate-to-intrinsic-sizes` | Panel rincian produk (`<details>`) beranimasi dengan `interpolate-size`, dibungkus `@supports` supaya aman di Firefox dan Safari |
| `optimize-image-priority` | Hero berupa CSS (LCP adalah teks). Gambar artikel `loading="lazy"`, tidak ada `fetchpriority="high"` yang tidak perlu |
| `accessibility`, `html`, `css`, `js` | Landmark semantik, skip link, `:focus-visible`, `forced-colors`, tanda halaman aktif tidak hanya dengan warna |

Browser yang belum mendukung fitur baru tetap mendapat tampilan yang berfungsi (nilai cadangan, bukan polyfill).

## 9. Halaman dan konten

| Halaman | Isi |
|---|---|
| Beranda | Hero tenunan, ringkasan kemampuan, kategori produk, ringkasan proses, artikel, ajakan minta sampel |
| Tentang | Profil perusahaan (slot data asli), nilai kerja, tim (slot), kebijakan editorial |
| Produk | Kategori kain dengan kartu sampel, tabel jenis anyaman, cara meminta spesifikasi |
| Proses produksi | Pemintalan, penenunan dan perajutan, pencelupan dan pencetakan, finishing, pengendalian mutu, pengemasan dan pengiriman |
| Artikel | 3 artikel: beda kain tenun dan rajut, cara membaca GSM kain, cara memilih kain untuk garmen. Sumber resmi diverifikasi sebelum ditautkan |
| Kontak | Minta sampel dan penawaran lewat WhatsApp, isi pesan pertama yang disarankan |
| Legal | Privasi, Syarat dan Ketentuan, Kebijakan Editorial (draf dari fakta yang ada, wajib ditinjau pemilik) |
| 404 | Halaman tidak ditemukan dengan status 404 asli |

SEO, E-E-A-T, JSON-LD, `robots.txt` (memblokir semua crawler selama staging), `sitemap.xml`, manifest, RSS, dan `llms.txt` mengikuti arsitektur proyek lama.

## 10. Aset yang dibuat

- **Logo:** tanda tenunan 2x2 (benang Nila Tua dan Kunyit yang saling menyilang) dalam SVG, plus set favicon transparan (`favicon.ico`, `icon.svg`, apple-touch-icon 180, ikon 192 dan 512).
- **Tekstur kain:** pola anyaman polos, twill, satin, rib, dan rajut dibuat dari CSS atau SVG, dan diberi label "Ilustrasi".
- **Gambar artikel dan proses:** diagram buatan sendiri (SVG ke WebP, di bawah 100 KB, dengan alt unik dan figcaption).
- **Gambar OG:** 1200x630 per halaman penting.
- **Tanpa foto stok.** Aturan E-E-A-T meminta gambar asli dan jujur. Foto pabrik asli bisa menggantikan ilustrasi kapan saja.

## 11. Review terhadap default

- Ide awal "krem hangat plus serif plus terakota" **dihindari**: dasar dingin Kapas Dingin, aksen Kunyit yang hanya dipakai di atas Nila Tua, dan serif hanya untuk isi baca.
- Gradien hanya dipakai sebagai pola benang yang berfungsi (struktur kain), bukan hiasan.
- Tidak ada monospace, eyebrow huruf kapital, string meta bertitik tengah, label `KATA — fragmen`, panah `→` di tombol, atau satu kata beraksen di headline.
- Penomoran hanya di tahapan produksi, yang memang berurutan.
- Tidak ada kartu identik: tiap kartu produk punya tekstur dan tepi yang berbeda.
- Satu hal yang dibuat berani: tenunan di hero. Bagian lain tetap tenang.

## 12. Yang masih perlu dari kamu

- Setuju atau tidak dengan subjek, konsep tenunan, dan palette di atas.
- Nama merek: pakai **Sandang Nusa Tekstil** sebagai nama contoh, atau kamu punya nama asli?
- Folder baru bernama `sandang-nusa-tekstil` dan proyek lama dibiarkan utuh. Kalau mau proyek lama dihapus, bilang saja.
- Nanti, kalau situs mau diisi data nyata: kapasitas, produk dan spesifikasi, sertifikasi, alamat, email, foto pabrik, dan profil tim.
