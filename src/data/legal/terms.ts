import type { LegalDocument } from "@/domain/legal";

export const termsDocument: LegalDocument = {
  slug: "syarat-ketentuan",
  path: "/syarat-ketentuan",
  title: "Syarat dan Ketentuan",
  metaTitle: "Syarat dan Ketentuan",
  metaDescription:
    "Syarat dan ketentuan penggunaan situs Sandang Nusa Tekstil: sifat informasi di artikel, tautan eksternal, hak cipta, dan pembahasan harga lewat WhatsApp.",
  intro: "Dengan memakai situs ini, kamu setuju dengan ketentuan singkat berikut.",
  updatedAt: "2026-11-19",
  sections: [
    {
      heading: "Penggunaan isi situs",
      paragraphs: [
        "Isi situs ini adalah informasi umum untuk membantu pembeli memahami kain dan proses produksinya.",
        "Isi situs bukan nasihat teknis, hukum, atau keuangan yang mengikat, dan hasil pada produkmu bisa berbeda.",
      ],
    },
    {
      heading: "Ketepatan informasi",
      paragraphs: [
        "Kami berusaha menjaga isi tetap akurat dengan merujuk ke sumber resmi yang ditautkan di dalam artikel.",
        "Standar, aturan, dan persyaratan pihak ketiga dapat berubah. Cek versi terbarunya sebelum mengambil keputusan.",
      ],
    },
    {
      heading: "Harga, spesifikasi, dan jadwal produksi",
      paragraphs: [
        "Situs ini tidak mencantumkan harga, spesifikasi produk, jumlah minimum pemesanan, maupun jadwal produksi.",
        "Hal-hal tersebut dibahas langsung lewat WhatsApp.",
      ],
    },
    {
      heading: "Tautan eksternal",
      paragraphs: [
        "Tautan ke situs lain disediakan sebagai rujukan. Kami tidak bertanggung jawab atas isi atau layanan di situs tersebut.",
      ],
    },
    {
      heading: "Hak cipta",
      paragraphs: [
        "Teks, ilustrasi, dan logo di situs ini dibuat untuk Sandang Nusa Tekstil dan dilindungi hak cipta.",
        "Hubungi kami lewat WhatsApp sebelum memakai ulang isi situs secara luas.",
      ],
    },
    {
      heading: "Perubahan syarat",
      paragraphs: ["Syarat ini dapat diperbarui. Tanggal pembaruan terakhir selalu ditampilkan di bagian atas halaman."],
    },
  ],
};
