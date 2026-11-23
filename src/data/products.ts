import type { FaqItem } from "@/domain/faq";
import type { FabricStructure, ProductCategory } from "@/domain/product";
import wovenFabric from "../../public/images/produk/kain-tenun.webp";
import knittedFabric from "../../public/images/produk/kain-rajut.webp";
import finishedFabric from "../../public/images/produk/kain-jadi.webp";

export const productPage = {
  heading: "Produk Kain Tenun, Rajut, dan Jadi",
  metaDescription:
    "Kelompok kain yang diproduksi Sandang Nusa Tekstil: kain tenun, kain rajut, dan kain jadi, lengkap dengan struktur kain umum dan cara meminta sampel.",
  lead: "Sandang Nusa Tekstil memproduksi kain tenun, kain rajut, dan kain jadi. Komposisi, lebar, dan gramasi tidak dicantumkan di sini, tetapi dikirim saat kamu meminta sampel lewat WhatsApp.",
  categoriesHeading: "Kelompok kain apa saja yang tersedia?",
  structuresHeading: "Apa saja struktur kain yang umum?",
  structuresIntro:
    "Tabel ini menjelaskan struktur dasar kain tenun dan rajut secara umum. Sifat tiap kain juga dipengaruhi serat, jumlah benang, dan finishing.",
  structuresCaption: "Struktur dasar kain tenun dan rajut",
  requestHeading: "Apa yang perlu disiapkan untuk meminta sampel?",
  requestItems: [
    "Pemakaian akhir kain, misalnya kemeja, kaus, atau seragam.",
    "Perkiraan jumlah kebutuhan.",
    "Struktur, komposisi, atau gramasi yang kamu inginkan, kalau sudah ada.",
    "Warna yang dicari atau contoh kain sebagai acuan.",
  ],
  faqHeading: "Apa lagi yang sering ditanyakan soal produk?",
};

export const productCategories: ProductCategory[] = [
  {
    id: "kain-tenun",
    name: "Kain tenun",
    description:
      "Dibuat dari benang lusi yang memanjang dan benang pakan yang melintang, saling menyilang tegak lurus. Hasilnya stabil dan rapi.",
    commonUses: ["Kemeja dan blus", "Seragam", "Linen rumah tangga"],
    details: [
      "Tiga anyaman dasar: plain, twill, dan satin.",
      "Cocok untuk pakaian yang perlu bentuk tegas dan stabil.",
      "Spesifikasi lengkap dibahas lewat WhatsApp.",
    ],
    image: {
      ...wovenFabric,
      alt: "Ilustrasi AI lipatan kain tenun nila dan putih gading dengan tekstur benang menyilang",
    },
  },
  {
    id: "kain-rajut",
    name: "Kain rajut",
    description:
      "Dibuat dari jalinan loop benang yang saling mengait. Lentur, nyaman, dan mengikuti gerak tubuh.",
    commonUses: ["Kaus", "Pakaian olahraga", "Pakaian dasar"],
    details: [
      "Struktur dasar yang umum: single jersey, rib, dan interlock.",
      "Cocok untuk pakaian yang perlu lentur dan nyaman dipakai.",
      "Spesifikasi lengkap dibahas lewat WhatsApp.",
    ],
    image: {
      ...knittedFabric,
      alt: "Ilustrasi AI lipatan kain rajut jersey biru pudar dan putih gading dengan tekstur loop halus",
    },
  },
  {
    id: "kain-jadi",
    name: "Kain jadi",
    description:
      "Kain yang sudah melewati pencelupan atau pencetakan dan finishing, sehingga siap dipotong dan dijahit.",
    commonUses: ["Produksi garmen", "Seragam kelompok", "Perlengkapan rumah"],
    details: [
      "Finishing mengatur tekstur, kestabilan ukuran, dan tampilan kain.",
      "Pilihan warna dan finishing dikonfirmasi lewat WhatsApp.",
      "Sampel warna bisa diminta sebelum pemesanan.",
    ],
    image: {
      ...finishedFabric,
      alt: "Ilustrasi AI tumpukan kain jadi berwarna kunyit, putih gading, nila, dan biru pudar",
    },
  },
];

export const fabricStructures: FabricStructure[] = [
  {
    id: "plain",
    family: "Tenun",
    name: "Plain",
    traits:
      "Benang pakan melewati satu benang lusi di atas, lalu satu di bawah, bergantian. Sederhana dan seimbang, tidak mudah merai, tetapi cenderung kusut.",
    commonUses: "Kemeja, kain linen, kanvas ringan",
  },
  {
    id: "twill",
    family: "Tenun",
    name: "Twill",
    traits:
      "Permukaan kain berupa garis diagonal. Umumnya jatuh (drape) lebih baik daripada plain dengan jumlah benang yang sama.",
    commonUses: "Denim, gabardine, flanel",
  },
  {
    id: "satin",
    family: "Tenun",
    name: "Satin",
    traits: "Benang mengambang (float) di permukaan kain sehingga tampak berkilau dan terasa halus.",
    commonUses: "Pakaian pesta, kain lapis, sprei",
  },
  {
    id: "single-jersey",
    family: "Rajut",
    name: "Single jersey",
    traits: "Loop ditarik ke sisi kain yang sama (plain stitch). Lentur, terutama ke arah lebar kain.",
    commonUses: "Kaus, pakaian dasar",
  },
  {
    id: "rib",
    family: "Rajut",
    name: "Rib",
    traits: "Loop ditarik ke kedua sisi kain secara bergantian sehingga membentuk alur vertikal. Sangat lentur.",
    commonUses: "Kerah, manset, atasan ketat",
  },
  {
    id: "interlock",
    family: "Rajut",
    name: "Interlock",
    traits:
      "Varian rib dengan dua benang yang dirajut bergantian oleh jarum berlawanan, sehingga loop saling mengunci dan permukaannya halus di kedua sisi.",
    commonUses: "Kaus polo, pakaian dasar",
  },
];

export const productFaqs: FaqItem[] = [
  {
    question: "Apakah saya bisa meminta sampel kain?",
    answer:
      "Bisa ditanyakan lewat WhatsApp. Ketersediaan sampel, jumlah, dan ongkos kirimnya dibahas langsung setelah kebutuhanmu jelas.",
  },
  {
    question: "Apakah ada jumlah minimum pemesanan?",
    answer:
      "Jumlah minimum pemesanan tidak dicantumkan di situs ini. Hal itu dibahas lewat WhatsApp sesuai jenis kain dan kebutuhanmu.",
  },
  {
    question: "Di mana saya bisa melihat spesifikasi lengkap?",
    answer:
      "Komposisi, lebar, dan gramasi dikirim bersama sampel atau penawaran. Kalau ingin memahami istilahnya lebih dulu, baca panduan tentang GSM kain di bagian artikel.",
  },
];
