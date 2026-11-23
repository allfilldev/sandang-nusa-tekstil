import type { Article } from "@/domain/article";

export const gsmKainArticle: Article = {
  slug: "gsm-kain",
  title: "GSM Kain: Arti, Cara Hitung, dan Cara Memakainya",
  metaTitle: "GSM Kain: Cara Membaca dan Memakai",
  metaDescription:
    "GSM kain adalah gram per meter persegi. Pelajari arti, cara menghitung dengan contoh, standar ISO dan ASTM, serta cara memakainya saat memilih bahan.",
  keyword: "GSM kain",
  summary: "GSM adalah gram per meter persegi, ukuran massa bahan untuk tiap satu meter persegi.",
  lead: "GSM kain adalah singkatan dari gram per square meter, yaitu massa bahan dalam gram untuk setiap satu meter persegi. Angka GSM yang lebih besar menandakan bahan yang lebih berat per luas, tetapi angka ini bukan satu-satunya penentu mutu. Panduan ini menjelaskan cara membaca GSM dan cara memakainya saat memilih bahan.",
  body: `## Apa arti GSM kain dan bagaimana cara menghitungnya?

GSM dipakai dalam hampir semua percakapan jual beli tekstil, tetapi sering dipakai tanpa dijelaskan. Bahan 150 GSM, misalnya, berarti satu meter persegi bahan itu bermassa sekitar 150 gram. Angka ini sering juga disebut gramasi atau berat bahan.

Dalam praktik, angka GSM kain biasanya tercantum di lembar spesifikasi bersama komposisi serat dan lebar. Pembeli memakainya untuk membandingkan beberapa pilihan dengan cepat.

### Bagaimana GSM dihitung?

Prinsipnya sederhana: massa spesimen dibagi luasnya.

1. Potong spesimen dengan ukuran yang diketahui, misalnya 10 cm kali 10 cm.
2. Timbang spesimen dengan timbangan presisi.
3. Ubah luasnya ke meter persegi. Potongan 10 cm kali 10 cm luasnya 0,01 meter persegi.
4. Bagi massa dengan luas.

Contoh perhitungan, bukan data produk: spesimen 10 cm kali 10 cm yang bermassa 1,5 gram menghasilkan 1,5 dibagi 0,01, yaitu 150 GSM. Kalau spesimennya 5 cm kali 5 cm, luasnya 0,0025 meter persegi.

Kalau kamu menghitung sendiri, ulangi pada beberapa spesimen dari bagian yang berbeda lalu ambil rata-ratanya, karena massa tiap potongan bisa sedikit berbeda.

### Apakah ada standar resmi untuk mengukurnya?

Ada. [ISO 3801](https://www.iso.org/standard/9335.html) membahas penentuan massa per satuan panjang dan massa per satuan luas untuk tekstil tenun. Untuk bahan secara umum, [ASTM D3776](https://store.astm.org/d3776_d3776m-20r25.html) membahas pengukuran massa per satuan luas atau berat.

ASTM D3776 menyatakan hasil bisa dilaporkan dalam satuan SI atau inch-pound, dan kedua sistem tidak boleh dicampur. Hasilnya juga umumnya mencakup tepi bahan (selvage) dan didasarkan pada bahan yang sudah dikondisikan, kecuali ditentukan lain.

Untuk hasil resmi, gunakan laboratorium uji yang mengikuti standar itu.

## Bagaimana membaca angka GSM saat memilih bahan?

GSM membantu membandingkan pilihan, tetapi angkanya perlu dibaca bersama hal lain. Satu angka tunggal tidak menceritakan semuanya.

### Apa arti GSM yang lebih rendah dan lebih tinggi?

Batas ringan, sedang, dan berat tidak seragam untuk semua jenis tekstil. Perbandingan di bawah ini bersifat umum.

| GSM | Kesan umum | Pertimbangan |
| --- | --- | --- |
| Lebih rendah | Lebih ringan dan tipis | Terasa sejuk, tetapi bisa tembus pandang |
| Lebih tinggi | Lebih tebal dan berat | Terasa kokoh dan hangat, tetapi kurang sejuk |

Pilihan GSM juga bergantung pada pemakaian. Pakaian harian di cuaca panas umumnya memakai bahan yang lebih ringan, sedangkan seragam kerja berat atau jaket memakai bahan yang lebih berat.

### Apa yang tidak ditunjukkan oleh GSM?

GSM hanya mengukur massa per luas. Angka itu tidak menjelaskan hal-hal berikut:

- jenis serat yang dipakai;
- kepadatan anyaman atau rajutan;
- ketebalan sebenarnya;
- finishing yang diberikan.

Dua bahan dengan GSM sama bisa terasa dan jatuh sangat berbeda. Lihat juga [perbedaan kain tenun dan rajut](/artikel/kain-tenun-rajut) untuk memahami pengaruh strukturnya terhadap kelenturan dan kestabilan.

## Bagaimana memakai GSM saat meminta bahan dari pemasok?

Angka GSM paling berguna kalau disertai konteks yang jelas. Tanpa konteks, dua pihak bisa membayangkan bahan yang berbeda dari angka yang sama.

### Informasi apa yang perlu dicatat?

- Pemakaian akhir bahan.
- GSM yang diinginkan, kalau perlu dengan toleransinya.
- Lebar bahan, karena massa per panjang dan massa per luas berhubungan lewat lebar.
- Metode uji yang dipakai pemasok.

Catatan soal lebar sejalan dengan ISO 3801, yang membedakan massa per satuan panjang dan massa per satuan luas.

Toleransi juga penting karena hasil timbang tiap spesimen bisa sedikit berbeda. Sampaikan rentang yang masih bisa diterima, misalnya sedikit lebih ringan atau sedikit lebih berat, supaya pemasok bisa menawarkan beberapa pilihan.

### Bagaimana membandingkan sampel dengan adil?

Bandingkan sampel dengan pemakaian akhir yang sama, bukan hanya dengan angka. Pegang bahannya, regangkan, dan lihat jatuhnya. Pilihan bahan untuk produk jadi dibahas di [panduan memilih kain untuk garmen](/artikel/memilih-kain-garmen), dan jenis yang tersedia ada di [halaman produk](/produk).`,
  faqHeading: "Apa lagi yang sering ditanyakan soal GSM?",
  faqs: [
    {
      question: "Apakah GSM sama dengan ketebalan?",
      answer:
        "Tidak. GSM mengukur massa per luas, sedangkan ketebalan mengukur jarak antara kedua permukaan bahan. Dua bahan dengan GSM sama bisa punya ketebalan berbeda.",
    },
    {
      question: "Apakah GSM yang tinggi berarti kualitas lebih baik?",
      answer:
        "Tidak otomatis. Mutu juga bergantung pada serat, struktur anyaman atau rajutan, dan finishing. Pilih GSM yang sesuai dengan pemakaian akhir, bukan yang paling besar.",
    },
    {
      question: "Apa bedanya GSM dengan ons per yard persegi?",
      answer:
        "Keduanya satuan massa per luas. GSM memakai gram per meter persegi, sedangkan ons per yard persegi memakai sistem inch-pound. Jangan mencampur kedua sistem dalam satu perhitungan.",
    },
    {
      question: "Bagaimana mengetahui GSM bahan yang sudah saya punya?",
      answer:
        "Timbang potongan berukuran diketahui lalu hitung massa per luasnya, atau minta pemasok mencantumkannya. Untuk hasil resmi, gunakan laboratorium uji. Hitungan sendiri cukup untuk perkiraan cepat saat membandingkan beberapa potongan.",
    },
  ],
  closingHeading: "Langkah praktis berikutnya",
  closing:
    "Tuliskan pemakaian akhir produkmu, lalu tentukan kisaran GSM yang kamu perlukan bersama lebar dan strukturnya. Minta sampel dan bandingkan dengan pemakaian yang sama, bukan hanya dengan angka. Catat hasilnya agar pilihan berikutnya lebih mudah. Kalau ingin menanyakan sampel atau spesifikasi dari kami, kirim pesan lewat [WhatsApp]({{whatsappUrl}}) dan sebutkan kebutuhanmu serta perkiraan jumlahnya.",
  image: {
    src: "/images/artikel/gsm-kain.webp",
    alt: "Ilustrasi AI sampel kain nila berbentuk persegi di atas timbangan digital, dengan sampel putih gading dan penggaris di meja",
    caption: "Penimbangan sampel kain untuk pengukuran gramasi, bukan hasil uji produk perusahaan.",
    width: 1200,
    height: 675,
  },
  authorId: "tim-sandang-nusa",
  publishedAt: "2026-11-19",
  updatedAt: "2026-11-19",
  relatedSlugs: ["kain-tenun-rajut", "memilih-kain-garmen"],
};
