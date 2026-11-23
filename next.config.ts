import type { NextConfig } from "next";

// Gambar artikel dan logo dari Supabase Storage perlu didaftarkan agar boleh dipakai next/image.
function supabaseImagePatterns(): NonNullable<NextConfig["images"]>["remotePatterns"] {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!rawUrl) {
    return [];
  }
  try {
    const { protocol, hostname, port } = new URL(rawUrl);
    return [
      {
        protocol: protocol === "http:" ? "http" : "https",
        hostname,
        port: port || undefined,
        pathname: "/storage/v1/object/public/media/**",
      },
    ];
  } catch {
    return [];
  }
}

// Supabase lokal (supabase start) berjalan di localhost. Next.js menolak mengoptimalkan gambar dari alamat lokal
// kecuali diizinkan. Izin ini hanya aktif kalau host Supabase yang dikonfigurasi memang lokal.
function usesLocalSupabase(): boolean {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!rawUrl) {
    return false;
  }
  try {
    return ["localhost", "127.0.0.1", "[::1]"].includes(new URL(rawUrl).hostname);
  } catch {
    return false;
  }
}

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: supabaseImagePatterns(),
    dangerouslyAllowLocalIP: usesLocalSupabase(),
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
