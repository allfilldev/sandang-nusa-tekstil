import type { LegalDocument } from "@/domain/legal";

export const privacyDocument: LegalDocument = {
  slug: "privasi",
  path: "/privasi",
  title: "Kebijakan Privasi",
  metaTitle: "Kebijakan Privasi",
  metaDescription:
    "Kebijakan privasi Sandang Nusa Tekstil: data apa yang kami terima, bagaimana pesan WhatsApp dipakai, dan apa yang terjadi pada cookie di situs ini.",
  intro:
    "Halaman ini menjelaskan data apa yang kami terima saat kamu memakai situs Sandang Nusa Tekstil dan bagaimana data itu dipakai.",
  updatedAt: "2026-11-19",
  sections: [
    {
      heading: "Data yang kami terima",
      paragraphs: [
        "Situs ini tidak memiliki formulir pendaftaran, kolom komentar, atau akun pengguna.",
        "Data yang kami terima hanya pesan yang kamu kirim sendiri lewat WhatsApp, termasuk nomor telepon dan isi pesanmu.",
      ],
    },
    {
      heading: "Cara kami memakai pesanmu",
      paragraphs: [
        "Pesan WhatsApp dipakai untuk membalas pertanyaanmu tentang kain, sampel, dan penawaran.",
        "WhatsApp diselenggarakan oleh pihak lain dan tunduk pada kebijakan privasi mereka sendiri.",
      ],
    },
    {
      heading: "Cookie dan data teknis",
      paragraphs: [
        "Saat ini situs tidak memasang cookie pelacak iklan atau alat analitik.",
        "Penyedia hosting situs dapat mencatat data teknis standar, seperti alamat IP dan jenis browser, untuk keamanan dan operasional server.",
        "Jika alat analitik ditambahkan di kemudian hari, halaman ini diperbarui sebelum alat itu diaktifkan.",
      ],
    },
    {
      heading: "Tautan ke situs lain",
      paragraphs: [
        "Artikel kami menautkan ke sumber resmi seperti Britannica, ISO, ASTM, dan OEKO-TEX. Kami tidak mengendalikan kebijakan privasi situs-situs itu.",
      ],
    },
    {
      heading: "Perubahan kebijakan",
      paragraphs: [
        "Kami memperbarui halaman ini saat ada perubahan, dan tanggal pembaruan terakhir ditampilkan di bagian atas.",
      ],
    },
    {
      heading: "Menghubungi kami",
      paragraphs: ["Pertanyaan soal privasi bisa dikirim lewat WhatsApp di {{whatsappNumber}}."],
    },
  ],
};
