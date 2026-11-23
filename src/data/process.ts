import type { ProcessStep } from "@/domain/process";

export const processPage = {
  heading: "Proses Produksi Kain Tekstil",
  metaDescription:
    "Tahapan umum produksi kain tekstil: pemintalan, penenunan atau perajutan, pencelupan, finishing, pengendalian mutu, sampai pengemasan dan pengiriman.",
  lead: "Produksi kain melewati beberapa tahap, dari serat menjadi benang sampai kain digulung dan dikirim. Halaman ini menjelaskan tahapan umumnya. Tahapan yang dikerjakan langsung di pabrik dan kapasitasnya dikonfirmasi lewat WhatsApp.",
  stepsHeading: "Apa saja tahapan produksi kain?",
  qualityHeading: "Apa yang umumnya diperiksa pada pengendalian mutu?",
  qualityIntro:
    "Tiap pabrik punya prosedur sendiri. Secara umum, pemeriksaan kain mencakup hal berikut. Metode dan standar yang dipakai dibahas saat permintaan sampel.",
  qualityItems: [
    "Cacat tampilan, seperti lubang, noda, dan garis.",
    "Ukuran, yaitu lebar dan panjang gulungan.",
    "Kesesuaian warna dengan acuan.",
    "Massa per luas kain (gramasi).",
  ],
  contactText: "Ingin tahu tahapan mana yang dikerjakan langsung di pabrik? Tanyakan lewat WhatsApp.",
};

export const processSteps: ProcessStep[] = [
  {
    id: "pemintalan",
    title: "Pemintalan",
    description: "Serat diolah menjadi benang. Jenis serat dan ukuran benang ikut menentukan karakter kain.",
  },
  {
    id: "tenun-rajut",
    title: "Penenunan atau perajutan",
    description:
      "Benang dianyam di mesin tenun atau dijalin di mesin rajut menjadi kain mentah, yang disebut kain greige.",
  },
  {
    id: "pencelupan",
    title: "Persiapan dan pencelupan",
    description:
      "Kain mentah dibersihkan, lalu diberi warna lewat pencelupan atau diberi motif lewat pencetakan.",
  },
  {
    id: "finishing",
    title: "Finishing",
    description: "Perlakuan akhir untuk mengatur tekstur, kestabilan ukuran, dan tampilan kain.",
  },
  {
    id: "mutu",
    title: "Pengendalian mutu",
    description: "Kain diperiksa terhadap cacat, ukuran, dan kesesuaian warna sebelum dikemas.",
  },
  {
    id: "pengiriman",
    title: "Pengemasan dan pengiriman",
    description: "Kain digulung, diberi label, dikemas, lalu dikirim ke pembeli.",
  },
];
