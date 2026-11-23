// Pengecil gambar yang berjalan di browser (canvas). Gambar dikecilkan dan diubah ke WebP sebelum diunggah,
// sehingga unggahan cepat di jaringan HP dan tidak terkena batas ukuran body di server.
// Hanya boleh dipanggil dari komponen browser.

export const acceptedImageTypes = ["image/png", "image/jpeg", "image/webp"] as const;
export const maxSourceBytes = 15 * 1024 * 1024;
export const photoTargetBytes = 100 * 1024;

export interface ResizedImage {
  blob: Blob;
  width: number;
  height: number;
  extension: "webp" | "jpg" | "png";
  // True kalau ukuran berkas masih di atas target meski sudah dikecilkan sejauh batas wajar.
  aboveTarget: boolean;
}

export function validateImageFile(file: File): string | null {
  if (!(acceptedImageTypes as readonly string[]).includes(file.type)) {
    return "Format gambar belum didukung. Pilih berkas PNG, JPG, atau WebP.";
  }
  if (file.size > maxSourceBytes) {
    return "Berkas terlalu besar (maksimal 15 MB). Pilih gambar yang lebih kecil.";
  }
  return null;
}

export async function loadBitmap(file: Blob): Promise<ImageBitmap> {
  try {
    return await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error("Gambar tidak bisa dibuka. Coba berkas lain.");
  }
}

function createCanvas(width: number, height: number): { canvas: HTMLCanvasElement; context: CanvasRenderingContext2D } {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Browser ini tidak bisa memproses gambar.");
  }
  context.imageSmoothingQuality = "high";
  return { canvas, context };
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

function extensionFor(type: string): ResizedImage["extension"] {
  if (type === "image/webp") {
    return "webp";
  }
  return type === "image/png" ? "png" : "jpg";
}

interface EncodeOptions {
  // Gambar tanpa transparansi (foto) boleh jatuh ke JPEG kalau browser tidak bisa membuat WebP.
  opaque: boolean;
  maxBytes: number;
}

// Mencoba kualitas menurun dan ukuran mengecil sampai berkas di bawah batas.
async function encodeWithinLimit(
  bitmap: ImageBitmap,
  width: number,
  height: number,
  options: EncodeOptions,
): Promise<ResizedImage> {
  const scales = [1, 0.85, 0.7, 0.55];
  const qualities = [0.86, 0.78, 0.7, 0.62, 0.54, 0.46, 0.38, 0.3];
  let best: ResizedImage | null = null;

  for (const scale of scales) {
    const { canvas, context } = createCanvas(width * scale, height * scale);
    if (options.opaque) {
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    const webp = await canvasToBlob(canvas, "image/webp", qualities[0]);
    const webpSupported = webp?.type === "image/webp";
    // Tanpa dukungan WebP: foto memakai JPEG, logo bertransparansi memakai PNG (tanpa pengaturan kualitas).
    const type = webpSupported ? "image/webp" : options.opaque ? "image/jpeg" : "image/png";
    const steps = type === "image/png" ? [undefined] : qualities;

    for (const quality of steps) {
      const blob = type === "image/webp" && quality === qualities[0] ? webp : await canvasToBlob(canvas, type, quality);
      if (!blob) {
        continue;
      }
      const candidate: ResizedImage = {
        blob,
        width: canvas.width,
        height: canvas.height,
        extension: extensionFor(blob.type),
        aboveTarget: blob.size > options.maxBytes,
      };
      if (!best || blob.size < best.blob.size) {
        best = candidate;
      }
      if (blob.size <= options.maxBytes) {
        return candidate;
      }
    }
  }

  if (!best) {
    throw new Error("Gambar tidak bisa dikecilkan. Coba berkas lain.");
  }
  return best;
}

// Foto artikel: lebar maksimal 1200 px, ukuran target di bawah 100 KB.
export async function compressPhoto(
  file: Blob,
  options: { maxWidth?: number; maxBytes?: number } = {},
): Promise<ResizedImage> {
  const { maxWidth = 1200, maxBytes = photoTargetBytes } = options;
  const bitmap = await loadBitmap(file);
  try {
    const ratio = Math.min(1, maxWidth / bitmap.width);
    return await encodeWithinLimit(bitmap, bitmap.width * ratio, bitmap.height * ratio, { opaque: true, maxBytes });
  } finally {
    bitmap.close();
  }
}

export interface LogoAssets {
  header: ResizedImage;
  favicon: Blob;
  appleIcon: Blob;
  icon192: Blob;
  icon512: Blob;
  sourceWidth: number;
  sourceHeight: number;
}

async function squareIcon(bitmap: ImageBitmap, size: number, background: string | null): Promise<Blob> {
  const { canvas, context } = createCanvas(size, size);
  if (background) {
    context.fillStyle = background;
    context.fillRect(0, 0, size, size);
  }
  // Logo diberi ruang kosong 10% di semua sisi dan tidak pernah dipotong atau ditarik.
  const inner = size * 0.8;
  const ratio = Math.min(inner / bitmap.width, inner / bitmap.height);
  const drawWidth = bitmap.width * ratio;
  const drawHeight = bitmap.height * ratio;
  context.drawImage(bitmap, (size - drawWidth) / 2, (size - drawHeight) / 2, drawWidth, drawHeight);
  const blob = await canvasToBlob(canvas, "image/png");
  if (!blob) {
    throw new Error("Ikon tidak bisa dibuat. Coba berkas lain.");
  }
  return blob;
}

// Membuat logo header (tinggi 96 px agar tajam di layar 2x) dan semua ikon turunannya.
export async function prepareLogoAssets(file: Blob): Promise<LogoAssets> {
  const bitmap = await loadBitmap(file);
  try {
    const maxHeight = 96;
    const maxWidth = 480;
    const ratio = Math.min(1, maxHeight / bitmap.height, maxWidth / bitmap.width);
    const header = await encodeWithinLimit(bitmap, bitmap.width * ratio, bitmap.height * ratio, {
      opaque: false,
      maxBytes: photoTargetBytes,
    });
    const [favicon, appleIcon, icon192, icon512] = await Promise.all([
      squareIcon(bitmap, 48, null),
      squareIcon(bitmap, 180, "#ffffff"),
      squareIcon(bitmap, 192, null),
      squareIcon(bitmap, 512, null),
    ]);
    return { header, favicon, appleIcon, icon192, icon512, sourceWidth: bitmap.width, sourceHeight: bitmap.height };
  } finally {
    bitmap.close();
  }
}

// Potongan hash isi berkas untuk nama berkas yang aman di-cache lama dan tidak bentrok.
export async function shortHash(blob: Blob, length = 10): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", await blob.arrayBuffer());
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, length);
}
