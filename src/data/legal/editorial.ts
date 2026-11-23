import type { LegalDocument } from "@/domain/legal";

export const editorialDocument: LegalDocument = {
  slug: "kebijakan-editorial",
  path: "/kebijakan-editorial",
  title: "Kebijakan Editorial",
  metaTitle: "Kebijakan Editorial",
  metaDescription:
    "Kebijakan editorial Sandang Nusa Tekstil: siapa penulis artikel, cara memilih sumber, jadwal pembaruan, cara mengirim koreksi, dan kepentingan komersial.",
  intro: "Halaman ini menjelaskan bagaimana artikel di situs ini ditulis, dirujuk, diperbarui, dan dikoreksi.",
  updatedAt: "2026-11-19",
  sections: [
    {
      heading: "Tujuan situs ini",
      paragraphs: [
        "Situs ini ada untuk menjawab pertanyaan dasar pembeli kain tentang jenis kain, standar pengukuran, dan cara memilih bahan, dengan bahasa yang mudah dipahami.",
      ],
    },
    {
      heading: "Siapa yang menulis",
      paragraphs: [
        "Semua artikel ditulis oleh Tim Sandang Nusa Tekstil. Nama penulis dan profil singkatnya tampil di kotak Tentang penulis pada setiap artikel.",
      ],
    },
    {
      heading: "Sumber dan rujukan",
      paragraphs: ["Kami merujuk ke sumber resmi, seperti badan standar, penerbit sertifikasi, dan ensiklopedia terpercaya."],
      items: [
        "Setiap standar atau angka dari pihak ketiga ditautkan ke halaman yang kami pakai.",
        "Kami merangkum dengan kata-kata sendiri dan tidak menyalin isi sumber.",
        "Perbandingan umum ditandai sebagai perbandingan umum, dan pembaca diminta memeriksa persyaratan terbaru.",
      ],
    },
    {
      heading: "Pengalaman dan data",
      paragraphs: [
        "Kami hanya menulis pengalaman, angka, dan contoh kasus yang benar-benar ada dan bisa dipertanggungjawabkan. Kalau belum ada contoh nyata, bagian itu tidak ditulis.",
        "Contoh perhitungan diberi keterangan sebagai contoh. Gambar di situs ini adalah ilustrasi buatan AI, bukan foto pabrik, dokumentasi produksi, atau hasil uji, dan tidak disajikan sebagai hasil nyata. Hal ini juga disebutkan di teks alternatif tiap gambar.",
      ],
    },
    {
      heading: "Tanggal dan pembaruan",
      paragraphs: [
        "Setiap artikel menampilkan tanggal terbit dan tanggal diperbarui. Kami meninjau artikel lama secara berkala dan memperbarui isinya bila ada perubahan.",
      ],
    },
    {
      heading: "Koreksi",
      paragraphs: [
        "Kalau menemukan kesalahan, kirim koreksi lewat WhatsApp di {{whatsappNumber}}. Kami memeriksa laporan itu, memperbaiki artikel bila benar, dan memperbarui tanggalnya.",
      ],
    },
    {
      heading: "Kepentingan komersial",
      paragraphs: [
        "Situs ini dijalankan oleh Sandang Nusa Tekstil, produsen kain. Artikel dapat mengarahkan pembaca untuk meminta sampel atau penawaran dari kami.",
        "Saat ini tidak ada tautan afiliasi atau konten berbayar di situs ini. Jika ada, akan diberi keterangan yang jelas.",
      ],
    },
  ],
};
