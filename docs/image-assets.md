# Aset gambar tekstil

Empat aset konten diganti pada 19 November 2026 menggunakan imagegen bawaan (bukan CLI/API), kemudian ditambahkan satu hero dan tiga gambar kategori produk. Visual bergaya foto ini merupakan ilustrasi AI, bukan dokumentasi pabrik atau hasil pengujian perusahaan. Empat gambar pertama disimpan sebagai WebP 1200 × 675. Hero berukuran 1000 × 1000, sedangkan gambar kategori produk 960 × 720. Semua file di bawah 100 KB.

Gambar Tentang, 404, hero, dan kategori produk menggunakan static import Next.js. URL aset berisi hash isi file sehingga pembaruan gambar tidak tertahan cache URL lama. Hero menggunakan `loading="eager"` dan `fetchPriority="high"`; kartu produk di bawahnya menggunakan lazy loading.

## Aset dan prompt final

### hero-tekstil

- File: `public/images/hero-tekstil.webp`
- Ukuran: 1000 × 1000; WebP di bawah 100 KB.
- Pemakaian: hero landing page.

Prompt:

> Use case: photorealistic-natural. Asset type: square landing page hero photograph. Photorealistic natural editorial textile photography for an Indonesian fabric manufacturer's website. Restrained palette of deep navy indigo, ivory, soft blue-gray and warm mustard ochre. Realistic tactile fibers, soft diffused daylight, premium understated industrial design. No lettering, no numbers, no logo, no watermark, no border, no collage, no people. AI illustration, not documentation of a real company. Subject: beautifully arranged broad draped lengths of woven and knitted textiles cascading from large horizontal fabric bolts at a textile sample workbench. Deep navy cloth dominates, with ivory drape, a small warm mustard fold, and a blue-gray fabric roll. A few softly out-of-focus cones of indigo yarn in the rear create manufacturing context. Three-quarter close view, broad fluid fabric folds and visible edges, central composition filling a square 1:1 image with crop-safe margins. Natural believable cotton and jersey materials, visible fibers and textile grain. Clean quiet background, no busy factory panorama, no props unrelated to fabric.

### kain-tenun

- File: `public/images/produk/kain-tenun.webp`
- Ukuran: 960 × 720; WebP di bawah 100 KB.
- Pemakaian: kartu kategori produk pada beranda dan halaman Produk.

Prompt:

> Use case: photorealistic-natural. Asset type: 4:3 landscape fabric product category photograph. Photorealistic natural editorial textile photography for an Indonesian fabric manufacturer's website. Restrained palette of deep navy indigo, ivory, soft blue-gray and warm mustard ochre. Realistic tactile fibers, soft diffused daylight, premium understated industrial design. No lettering, no numbers, no logo, no watermark, no border, no collage, no people. AI illustration, not documentation of a real company. Subject: a close-up of layered lengths of fine woven cotton, deep indigo navy on top, off-white underneath and one blue-gray folded edge. Clearly visible tiny perpendicular warp and weft grid, crisp structured folds, clean neatly cut selvage. The fabrics fill the frame, viewed from a low three-quarter angle, central tactile focus, shallow depth of field. Everyday shirting-weight fabric, not coarse upholstery. Very small warm mustard accent in background only.

### kain-rajut

- File: `public/images/produk/kain-rajut.webp`
- Ukuran: 960 × 720; WebP di bawah 100 KB.
- Pemakaian: kartu kategori produk pada beranda dan halaman Produk.

Prompt:

> Use case: photorealistic-natural. Asset type: 4:3 landscape fabric product category photograph. Photorealistic natural editorial textile photography for an Indonesian fabric manufacturer's website. Restrained palette of deep navy indigo, ivory, soft blue-gray and warm mustard ochre. Realistic tactile fibers, soft diffused daylight, premium understated industrial design. No lettering, no numbers, no logo, no watermark, no border, no collage, no people. AI illustration, not documentation of a real company. Subject: close-up of soft fine-gauge blue-gray and ivory cotton jersey knit fabric arranged in broad relaxed folds, with one deep indigo knit edge. Clear fine V-shaped interlocking knit stitch columns, soft drape and slight elastic curl at edge, recognizable as T-shirt knit fabric, not chunky wool or rope. Macro commercial textile photography at a three-quarter angle, gentle shadows reveal fine structure, materials fill frame, crop-safe central composition.

### kain-jadi

- File: `public/images/produk/kain-jadi.webp`
- Ukuran: 960 × 720; WebP di bawah 100 KB.
- Pemakaian: kartu kategori produk pada beranda dan halaman Produk.

Prompt:

> Use case: photorealistic-natural. Asset type: 4:3 landscape finished fabric product category photograph. Photorealistic natural editorial textile photography for an Indonesian fabric manufacturer's website. Restrained palette of deep navy indigo, ivory, soft blue-gray and warm mustard ochre. Realistic tactile fibers, soft diffused daylight, premium understated industrial design. No lettering, no numbers, no logo, no watermark, no border, no collage, no people. AI illustration, not documentation of a real company. Subject: a tidy stack of finished dyed fabric bolts and folded lengths in muted mustard ochre, ivory, deep navy and blue-gray, viewed closely at a three-quarter angle. Top ochre cloth drapes gracefully across the front, with smooth refined woven surface and neatly aligned edges, ready to be cut and sewn, fine textile fibers and restrained natural highlights. Pale neutral work surface barely visible. Materials fill the frame with central crop-safe composition, authentic fine-gauge garment textile, no pattern printing or garment pieces.


### gulungan-kain

- File: `public/images/gulungan-kain.webp`
- Pemakaian: halaman Tentang dan 404.

Prompt:

> Use case: photorealistic-natural. Asset type: 16:9 landscape editorial photograph-style illustration for an Indonesian textile manufacturing company website, About page. Primary request: a carefully arranged stack of actual rolled fabric bolts in a textile sample warehouse, photographed closely at a three-quarter angle; visible cardboard cores, fine woven cotton fibers and realistic fabric roll edges. Colors are predominantly deep indigo navy, soft blue gray, natural ivory, and one muted mustard ochre accent roll, consistent with a navy and warm yellow textile brand. Scene: clean textile stock shelf with softly blurred neutral industrial background, no identifiable actual factory. Style: premium natural commercial textile photography, warm diffused side daylight, tactile true-to-life matte fabric, subtle depth of field. Composition: horizontal wide 16:9, rolls fill most of frame, central composition with a little breathing room and generous safe margins for cropping. No people, no lettering, no logos, no watermarks, no graphic overlays, no border, no collage. This is a realistic AI illustration, not a claim about a real factory.

### kain-tenun-rajut

- File: `public/images/artikel/kain-tenun-rajut.webp`
- Pemakaian: sampul artikel kain-tenun-rajut.

Prompt:

> Use case: photorealistic-natural. Asset type: 16:9 landscape educational editorial image for a textile guide comparing woven and knitted cloth. Primary request: extreme close-up studio photograph-style illustration of two real fabric swatches placed side by side with a clean vertical meeting line. Left half is ivory plain-weave cotton with clearly discernible fine perpendicular warp and weft yarns interlacing in an over-under grid. Right half is soft indigo blue-gray knitted jersey with clearly discernible small interlocking V-shaped stitch columns and gentle natural fold. Both textiles at the same magnification, believable textile microstructure, sharply detailed tangible fibers, delicate shadows, diffuse raking natural light. Restrained premium textile catalog aesthetic, color palette navy indigo and ivory. Full bleed horizontal 16:9 composition, texture fills the canvas, balanced halves, no text or labels, no decorative diagrams, no arrows, no watermark, no logos, no people. Avoid giant rope loops or impossible structures, avoid smooth synthetic CGI.

### gsm-kain

- File: `public/images/artikel/gsm-kain.webp`
- Pemakaian: sampul artikel gsm-kain.

Prompt:

> Use case: photorealistic-natural. Asset type: 16:9 landscape editorial photograph-style illustration for an article explaining GSM fabric mass per unit area. Scene: clean textile quality-control workbench, close-up three-quarter top-down composition. Subject: a small square swatch of indigo woven cotton lying flat on the stainless steel platform of a compact precision digital scale, an identical flat square ivory swatch next to a plain steel ruler on the pale gray tabletop, folded fabric edges in background. Texture of cotton weave visible, plausible small textile laboratory measuring tools, no hands. Digital display must be angled away from viewer, dark and unreadable; ruler markings subtle with no legible numerals. The image should communicate weighing a known-area fabric sample without showing numerical results. Natural diffuse window lighting, restrained navy ivory and cool gray palette, premium industrial textile editorial photography, realistic surface texture, wide horizontal 16:9, safe margins around tools. No typography, no labels, no logos, no watermarks, no graphs, no measurement claims, no collage.

### memilih-kain-garmen

- File: `public/images/artikel/memilih-kain-garmen.webp`
- Pemakaian: sampul artikel memilih-kain-garmen.

Prompt:

> Use case: photorealistic-natural. Asset type: 16:9 landscape editorial photograph-style illustration for an Indonesian textile manufacturing website article about choosing fabric for garment production. Primary request: top-down view of a textile designer's orderly sample table, several large overlapping rectangular cloth swatches and small folded lengths arranged in a calm deliberate composition. Show three visibly distinct tactile fabrics: ivory plain woven cotton, deep navy indigo twill with diagonal ridges, and muted mustard ochre fine jersey knit, with a few muted blue-gray supporting swatches. A neatly looped plain tailoring tape and closed stainless tailor shears at outer edge add garment production context, without dominating. Pale warm-gray work surface, softly diffused daylight, crisp natural textile fibers and selvage details, believable subtle wrinkles and shadows, premium tactile commercial photography rather than illustration drawing. Horizontal 16:9 composition with materials central and crop-safe margins. No people, no letters, no labels, no legible numbers, no branding, no watermarks, no graphic overlay, no border, no collage.

