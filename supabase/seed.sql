-- Dibuat otomatis oleh scripts/generate-seed.mjs dari src/data/articles. Jangan diedit tangan.
-- Jalankan di Supabase Dashboard > SQL Editor SETELAH 0001_cms.sql. Aman dijalankan berulang.

insert into public.articles (slug, title, meta_title, meta_description, keyword, summary, lead, body, faq_heading, faqs, closing_heading, closing, image_url, image_alt, image_caption, image_width, image_height, author_id, related_slugs, status, published_on, updated_on)
values
  ($t$gsm-kain$t$,
   $t$GSM Kain: Arti, Cara Hitung, dan Cara Memakainya$t$,
   $t$GSM Kain: Cara Membaca dan Memakai$t$,
   $t$GSM kain adalah gram per meter persegi. Pelajari arti, cara menghitung dengan contoh, standar ISO dan ASTM, serta cara memakainya saat memilih bahan.$t$,
   $t$GSM kain$t$,
   $t$GSM adalah gram per meter persegi, ukuran massa bahan untuk tiap satu meter persegi.$t$,
   $t$GSM kain adalah singkatan dari gram per square meter, yaitu massa bahan dalam gram untuk setiap satu meter persegi. Angka GSM yang lebih besar menandakan bahan yang lebih berat per luas, tetapi angka ini bukan satu-satunya penentu mutu. Panduan ini menjelaskan cara membaca GSM dan cara memakainya saat memilih bahan.$t$,
   $t$## Apa arti GSM kain dan bagaimana cara menghitungnya?

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

Bandingkan sampel dengan pemakaian akhir yang sama, bukan hanya dengan angka. Pegang bahannya, regangkan, dan lihat jatuhnya. Pilihan bahan untuk produk jadi dibahas di [panduan memilih kain untuk garmen](/artikel/memilih-kain-garmen), dan jenis yang tersedia ada di [halaman produk](/produk).$t$,
   $t$Apa lagi yang sering ditanyakan soal GSM?$t$,
   $j$[{"question":"Apakah GSM sama dengan ketebalan?","answer":"Tidak. GSM mengukur massa per luas, sedangkan ketebalan mengukur jarak antara kedua permukaan bahan. Dua bahan dengan GSM sama bisa punya ketebalan berbeda."},{"question":"Apakah GSM yang tinggi berarti kualitas lebih baik?","answer":"Tidak otomatis. Mutu juga bergantung pada serat, struktur anyaman atau rajutan, dan finishing. Pilih GSM yang sesuai dengan pemakaian akhir, bukan yang paling besar."},{"question":"Apa bedanya GSM dengan ons per yard persegi?","answer":"Keduanya satuan massa per luas. GSM memakai gram per meter persegi, sedangkan ons per yard persegi memakai sistem inch-pound. Jangan mencampur kedua sistem dalam satu perhitungan."},{"question":"Bagaimana mengetahui GSM bahan yang sudah saya punya?","answer":"Timbang potongan berukuran diketahui lalu hitung massa per luasnya, atau minta pemasok mencantumkannya. Untuk hasil resmi, gunakan laboratorium uji. Hitungan sendiri cukup untuk perkiraan cepat saat membandingkan beberapa potongan."}]$j$::jsonb,
   $t$Langkah praktis berikutnya$t$,
   $t$Tuliskan pemakaian akhir produkmu, lalu tentukan kisaran GSM yang kamu perlukan bersama lebar dan strukturnya. Minta sampel dan bandingkan dengan pemakaian yang sama, bukan hanya dengan angka. Catat hasilnya agar pilihan berikutnya lebih mudah. Kalau ingin menanyakan sampel atau spesifikasi dari kami, kirim pesan lewat [WhatsApp]({{whatsappUrl}}) dan sebutkan kebutuhanmu serta perkiraan jumlahnya.$t$,
   $t$/images/artikel/gsm-kain.webp$t$,
   $t$Ilustrasi AI sampel kain nila berbentuk persegi di atas timbangan digital, dengan sampel putih gading dan penggaris di meja$t$,
   $t$Penimbangan sampel kain untuk pengukuran gramasi, bukan hasil uji produk perusahaan.$t$,
   1200,
   675,
   $t$tim-sandang-nusa$t$,
   array[$t$kain-tenun-rajut$t$, $t$memilih-kain-garmen$t$]::text[],
   'published',
   '2026-11-19'::date,
   '2026-11-19'::date),
  ($t$kain-tenun-rajut$t$,
   $t$Kain Tenun dan Rajut: Apa Bedanya dan Kapan Dipakai?$t$,
   $t$Kain Tenun dan Rajut: Apa Bedanya?$t$,
   $t$Kain tenun dan rajut berbeda pada susunan benangnya. Kenali cara pembuatan, perbandingan sifat, struktur dasar, dan kapan memilih masing-masing jenis.$t$,
   $t$kain tenun dan rajut$t$,
   $t$Tenun menyilangkan dua set benang, rajut mengaitkan loop benang.$t$,
   $t$Kain tenun dan rajut berbeda pada cara benangnya disusun. Tenun menyilangkan benang lusi dan pakan secara tegak lurus sehingga hasilnya stabil dan rapi, sedangkan rajut mengaitkan loop benang sehingga hasilnya lentur dan nyaman. Panduan ini membantu pembeli dan konveksi memilih struktur yang tepat untuk produk mereka, mulai dari cara pembuatan sampai pemakaian akhirnya.$t$,
   $t$## Apa beda kain tenun dan rajut dari cara pembuatannya?

Perbedaan utamanya ada pada struktur benang. Struktur itu menentukan seberapa lentur, stabil, dan tebal sebuah bahan saat dipegang, dipotong, dan dijahit. Memahami kain tenun dan rajut membuat percakapan dengan pemasok jauh lebih mudah.

### Bagaimana tenun dibuat?

Tenun dibuat dengan menyilangkan dua set benang pada sudut tegak lurus: benang lusi yang memanjang dan benang pakan yang melintang. Dasar-dasar penenunan dijelaskan di [artikel Britannica tentang weaving](https://www.britannica.com/technology/weaving).

Tiga anyaman dasarnya adalah plain, twill, dan satin. Plain adalah yang paling sederhana: pakan melewati satu lusi di atas dan satu di bawah, bergantian. Twill membentuk garis diagonal, sedangkan satin tampak berkilau karena benang mengambang di permukaan.

Hasilnya adalah bahan yang rapat dan stabil ke segala arah, tetapi kurang lentur. Tepi bahan yang rapi (selvage) terbentuk saat benang pakan berbalik arah di pinggir.

### Bagaimana rajut dibuat?

Rajut dibuat dari loop benang yang saling mengait. Britannica membagi rajutan menjadi weft knit dan warp knit, dengan jersey, rib, dan interlock sebagai struktur dasar rajutan weft. Uraiannya ada di [artikel Britannica tentang knitting](https://www.britannica.com/technology/knitting).

Rajutan weft umumnya dibuat dari satu benang yang berjalan melintang. Rajutan warp memakai banyak benang, biasanya lebih tahan lepas rajutan, tetapi kurang lentur. Britannica juga mencatat bahwa struktur rib dan interlock hanya dibuat dengan mesin.

### Apa saja perbedaan sifat keduanya?

Perbandingan di bawah ini bersifat umum. Sifat tiap bahan juga dipengaruhi serat, jumlah benang, dan finishing.

| Sifat | Tenun | Rajut |
| --- | --- | --- |
| Susunan benang | Lusi dan pakan saling menyilang | Loop saling mengait |
| Kelenturan | Umumnya stabil dan kurang lentur | Umumnya lentur |
| Kesan tampilan | Rapi dan tegas | Lembut dan mengikuti tubuh |
| Saat dijahit | Umumnya lebih mudah dipotong dan dijahit | Perlu jarum dan jahitan yang disesuaikan |
| Contoh pemakaian | Kemeja, seragam, denim | Kaus, polo, pakaian olahraga |

Gunakan tabel ini sebagai titik awal diskusi, bukan aturan mutlak.

## Kapan memilih tenun, dan kapan rajut?

Pilihan terbaik bergantung pada pemakaian akhir. Mulailah dari satu pertanyaan: apakah pakaian ini perlu mempertahankan bentuk, atau perlu mengikuti gerak tubuh?

Kenyamanan saat dipakai juga dipengaruhi cuaca. Bahan tipis dan berpori umumnya terasa lebih sejuk, sedangkan bahan tebal terasa lebih hangat. Pertimbangkan hal ini bersama struktur yang dipilih.

### Kapan tenun lebih cocok?

- Pakaian yang perlu bentuk tegas, seperti kemeja dan seragam.
- Produk yang perlu stabil saat dipotong dan dijahit.
- Perlengkapan rumah, seperti sprei dan taplak.

Bahan tenun cenderung lebih mudah ditangani di meja potong karena tidak melar. Itu sebabnya banyak produk berbentuk tegas memakainya.

### Kapan rajut lebih cocok?

- Pakaian yang perlu lentur dan nyaman, seperti kaus dan pakaian olahraga.
- Bagian yang perlu melar lalu kembali, seperti kerah dan manset.
- Pakaian dasar yang dipakai langsung di kulit.

Rajut perlu penanganan berbeda saat dijahit karena bisa melar. Penjahit biasanya menyesuaikan jarum dan jenis jahitan.

Perhatikan juga perubahan ukuran setelah dicuci. Bahan yang lentur lebih mudah berubah bentuk, jadi uji potongan kecil sebelum memproduksi dalam jumlah besar.

## Apa saja struktur dasar tenun dan rajut?

Setiap kelompok punya tiga struktur dasar yang umum dibicarakan.

- **Tenun:** plain, twill, dan satin.
- **Rajut:** single jersey, rib, dan interlock.

Kamu bisa membedakannya dengan melihat dari dekat. Pada tenun, benang tampak menyilang tegak lurus. Pada rajut, tampak deretan loop kecil yang saling mengait. Kerapatan benang atau loop juga memengaruhi seberapa tebal, padat, dan kuat sebuah bahan.

### Bagaimana serat memengaruhi hasilnya?

Struktur bukan satu-satunya penentu. Serat seperti katun, poliester, atau campurannya memberi karakter sendiri: daya serap, kehangatan, dan cara perawatan. Struktur yang sama dari serat berbeda bisa terasa sangat berbeda.

Penjelasan tiap struktur ada di [halaman produk](/produk). Setelah memilih struktur, lanjutkan dengan memahami [GSM kain](/artikel/gsm-kain) dan [cara memilih kain untuk garmen](/artikel/memilih-kain-garmen).$t$,
   $t$Apa lagi yang sering ditanyakan soal tenun dan rajut?$t$,
   $j$[{"question":"Apakah tenun bisa melar seperti rajut?","answer":"Umumnya tidak. Bahan tenun cenderung stabil dan kurang lentur. Ada tenun stretch yang memakai benang elastis, tetapi sifat lenturnya tetap berbeda dari rajut."},{"question":"Mana yang lebih mudah dijahit?","answer":"Bahan tenun biasanya lebih stabil saat dipotong dan dijahit. Rajut perlu penanganan khusus karena lentur dan bisa melar, jadi jarum dan jahitannya disesuaikan."},{"question":"Apa beda rajutan weft dan warp?","answer":"Rajutan weft umumnya dibuat dari satu benang yang berjalan melintang. Rajutan warp memakai banyak benang, biasanya lebih tahan lepas rajutan dan kurang lentur, menurut uraian Britannica."},{"question":"Bagaimana cara meminta sampel kedua jenis bahan ini?","answer":"Hubungi tim lewat WhatsApp dan sebutkan pemakaian akhir produkmu. Ketersediaan sampel tenun dan rajut dibahas langsung setelah kebutuhanmu jelas."}]$j$::jsonb,
   $t$Langkah praktis berikutnya$t$,
   $t$Mulai dari pemakaian akhirnya: pakaian yang perlu bentuk tegas biasanya cocok dengan tenun, sedangkan pakaian yang perlu lentur cocok dengan rajut. Catat juga kebutuhan lain seperti tebal bahan dan jatuhnya, lalu minta sampel dari kedua jenis untuk dibandingkan langsung. Tim kami bisa membantu menyaring pilihan lewat [WhatsApp]({{whatsappUrl}}) setelah kamu menyebutkan kebutuhan dan perkiraan jumlahnya.$t$,
   $t$/images/artikel/kain-tenun-rajut.webp$t$,
   $t$Ilustrasi AI tekstur kain tenun putih gading dengan benang menyilang di kiri dan kain rajut biru dengan barisan loop di kanan$t$,
   $t$Perbandingan tekstur kain tenun di kiri dan kain rajut di kanan.$t$,
   1200,
   675,
   $t$tim-sandang-nusa$t$,
   array[$t$gsm-kain$t$, $t$memilih-kain-garmen$t$]::text[],
   'published',
   '2026-11-19'::date,
   '2026-11-19'::date),
  ($t$memilih-kain-garmen$t$,
   $t$Memilih Kain untuk Garmen: Panduan bagi Konveksi$t$,
   $t$Cara Memilih Kain untuk Garmen$t$,
   $t$Cara memilih kain untuk garmen: mulai dari pemakaian akhir, struktur dan gramasi, cara membandingkan sampel, sampai memeriksa sertifikat keamanan bahan.$t$,
   $t$memilih kain$t$,
   $t$Mulai dari pemakaian akhir, lalu cocokkan struktur, gramasi, dan bandingkan sampel dengan adil.$t$,
   $t$Memilih kain untuk garmen dimulai dari pemakaian akhirnya, lalu dicocokkan dengan struktur, gramasi, serat, dan finishing. Dengan urutan itu, konveksi bisa menyaring pilihan sebelum meminta sampel, sehingga waktu dan biaya tidak terbuang pada bahan yang salah. Panduan ini membahas pertimbangan utama dan cara membandingkan sampel secara adil, langkah demi langkah.$t$,
   $t$## Apa yang perlu dipertimbangkan saat memilih kain untuk garmen?

Memilih kain yang tepat menghemat waktu dan biaya perbaikan di tahap produksi. Urutan berpikir di bawah ini membantu menyaring pilihan sebelum meminta sampel dari [produk kami](/produk) atau pemasok lain.

### Mulai dari pemakaian akhir

Tuliskan dulu bagaimana pakaian akan dipakai dan dirawat. Jawabannya mengarahkan pilihan struktur dan serat.

- Apakah pakaian perlu mempertahankan bentuk atau mengikuti gerak tubuh?
- Apakah akan sering dicuci?
- Apakah dipakai di cuaca panas, ruangan ber-AC, atau keduanya?
- Apakah bersentuhan langsung dengan kulit?

Catat jawabannya dalam satu atau dua kalimat. Catatan ini menjadi acuan saat menilai setiap sampel nanti. Tabel berikut memberi contoh umum hal yang biasanya diprioritaskan.

| Contoh pemakaian | Hal yang biasanya diprioritaskan |
| --- | --- |
| Seragam kerja | Tahan dicuci berulang dan bentuk tetap rapi |
| Kaus harian | Lentur, nyaman, dan menyerap keringat |
| Pakaian pesta | Jatuh yang baik dan tampilan permukaan |

### Cocokkan struktur dan gramasi

Setelah pemakaian jelas, pilih struktur. [Kain tenun dan rajut](/artikel/kain-tenun-rajut) punya sifat berbeda dalam kelenturan dan kestabilan. Lalu tentukan kisaran gramasi dengan memahami [GSM kain](/artikel/gsm-kain), supaya bahan tidak terlalu tipis atau terlalu berat untuk model yang direncanakan.

Pertimbangkan juga serat. Katun, poliester, dan campurannya punya karakter dan cara perawatan masing-masing.

Contoh pasangan yang umum sebagai titik awal, bukan aturan mutlak:

- pakaian bentuk tegas: tenun plain atau twill dengan gramasi sedang;
- pakaian lentur dan nyaman: rajut single jersey atau rib;
- pakaian dengan tampilan berkilau: tenun satin.

## Bagaimana membandingkan sampel dengan adil?

Sampel yang dibandingkan dalam kondisi yang sama menghasilkan keputusan yang lebih jujur. Siapkan beberapa varian dengan ukuran potongan yang sama, lalu nilai semuanya dengan cara yang sama dan oleh orang yang sama.

### Apa yang bisa dinilai dengan tangan dan mata?

| Hal yang dinilai | Cara menilai |
| --- | --- |
| Jatuh (drape) | Gantung atau lipat sampel, lalu lihat bentuknya |
| Kecenderungan kusut | Remas sampel beberapa detik, lalu lepaskan |
| Rasa di kulit | Sentuh dan gosok pelan di kulit |
| Warna | Periksa di cahaya alami dan cahaya ruangan |

Warna di layar tidak selalu sama dengan warna bahan asli. Karena itu, periksa sampel fisik, bukan hanya foto. Foto juga dipengaruhi pengaturan kamera dan layar, sehingga hanya cocok sebagai gambaran awal.

Tulis hasil penilaian untuk tiap sampel dalam satu tabel yang sama. Dengan begitu, perbedaan antarpilihan terlihat jelas dan keputusan tidak bergantung pada ingatan.

### Uji sederhana apa yang perlu dilakukan sebelum produksi?

Lakukan uji cuci kecil pada potongan sampel. Amati perubahan ukuran, luntur warna, dan perubahan tampilan setelah dicuci sesuai petunjuk perawatan yang direncanakan.

Hasil uji sederhana ini bukan pengganti pengujian laboratorium, tetapi cukup untuk menyaring pilihan sebelum memesan dalam jumlah besar.

Catat hal berikut sebelum dan sesudah mencuci:

- panjang dan lebar potongan sampel;
- perubahan warna atau noda pada air cucian;
- perubahan tekstur dan tampilan permukaan.

## Bagaimana memastikan bahan aman dan sesuai persyaratan?

Sebagian pembeli dan pasar meminta bukti bahwa bahan sudah diuji terhadap zat berbahaya. Persyaratannya berbeda-beda, jadi tanyakan dulu syarat yang berlaku untuk produkmu.

### Apa itu OEKO-TEX STANDARD 100?

Menurut situs resminya, [OEKO-TEX STANDARD 100](https://www.oeko-tex.com/en/our-standards/oeko-tex-standard-100) adalah label untuk tekstil yang diuji terhadap zat berbahaya, dari benang sampai produk jadi.

Label itu hanya satu contoh dari banyak sertifikasi dan persyaratan pasar. Pembeli atau negara tujuan ekspor bisa punya syarat tersendiri, dan syarat itu sering dituliskan dalam kontrak pembelian. Baca bagian tersebut dengan teliti sebelum memesan.

### Bagaimana memeriksa sertifikat pemasok?

Minta salinan sertifikat dan periksa keasliannya lewat penerbit sertifikat itu. Tanyakan juga cakupannya: apakah mencakup benang, bahan, atau produk jadi tertentu, dan apakah masih berlaku.

Simpan salinan sertifikat bersama catatan pemakaian akhir dan hasil uji sampel, supaya keputusanmu mudah dipertanggungjawabkan.$t$,
   $t$Apa lagi yang sering ditanyakan soal memilih kain?$t$,
   $j$[{"question":"Berapa sampel yang sebaiknya diminta?","answer":"Minta beberapa varian, misalnya dua sampai tiga, untuk dibandingkan dengan pemakaian akhir yang sama. Jumlah pastinya dibahas dengan pemasok sesuai kebutuhanmu. Beri tiap sampel label agar tidak tertukar saat dinilai."},{"question":"Apakah warna di layar sama dengan warna bahan?","answer":"Tidak selalu. Layar menampilkan warna secara berbeda dari bahan asli. Periksa sampel fisik di cahaya alami dan cahaya ruangan sebelum memutuskan."},{"question":"Apakah semua bahan butuh sertifikat?","answer":"Tidak ada aturan tunggal. Sebagian pembeli atau pasar mensyaratkannya, sebagian tidak. Tanyakan persyaratan pembeli dan pasar tujuanmu, lalu minta pemasok menunjukkan dokumen yang sesuai sebelum kamu memesan dalam jumlah besar."},{"question":"Apa yang perlu disiapkan sebelum meminta penawaran?","answer":"Siapkan pemakaian akhir, perkiraan jumlah kebutuhan, struktur atau gramasi bila sudah ada, dan warna yang dicari. Semakin jelas, semakin cepat pemasok bisa menjawab."}]$j$::jsonb,
   $t$Langkah praktis berikutnya$t$,
   $t$Tuliskan pemakaian akhir pakaianmu, lalu saring struktur dan gramasinya sebelum meminta sampel. Bandingkan beberapa varian dalam kondisi yang sama, lakukan uji cuci kecil, dan tanyakan persyaratan sertifikat yang berlaku. Kalau ingin meminta sampel atau penawaran dari kami, kirim pesan lewat [WhatsApp]({{whatsappUrl}}) dan sebutkan pemakaian akhir, jumlah perkiraan, serta warna yang kamu cari.$t$,
   $t$/images/artikel/memilih-kain-garmen.webp$t$,
   $t$Ilustrasi AI sampel kain tenun putih gading, twill nila, dan rajut kunyit di meja bersama pita ukur dan gunting jahit$t$,
   $t$Membandingkan tekstur dan karakter sampel kain sebelum memilih bahan garmen.$t$,
   1200,
   675,
   $t$tim-sandang-nusa$t$,
   array[$t$kain-tenun-rajut$t$, $t$gsm-kain$t$]::text[],
   'published',
   '2026-11-19'::date,
   '2026-11-19'::date)
on conflict (slug) do nothing;
