import type { Metadata } from "next";
import Image from "next/image";
import fabricRolls from "../../public/images/gulungan-kain.webp";
import { SiteShell } from "@/components/layout/SiteShell";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Halaman Tidak Ditemukan",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <SiteShell>
      <Container className="py-16 md:py-24">
        <div className="grid items-center gap-10 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h1 className="font-display text-[clamp(2.25rem,1.4rem+3.6vw,4rem)] font-extrabold font-stretch-expanded leading-none tracking-tight">
              Halaman tidak ditemukan
            </h1>
            <p className="mt-6 max-w-[48ch] text-xl leading-relaxed">
              Alamat yang kamu buka tidak ada atau sudah dipindahkan. Mulai dari beranda atau lihat kelompok kain kami.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink href="/">Kembali ke beranda</ButtonLink>
              <ButtonLink href="/produk" variant="secondary">
                Lihat produk kain
              </ButtonLink>
            </div>
          </div>
          <figure>
            <Image
              src={fabricRolls}
              alt="Ilustrasi AI gulungan kain nila, putih gading, biru pudar, dan kunyit bertumpuk di rak penyimpanan"
              width={1200}
              height={675}
              sizes="(min-width: 768px) 40vw, 100vw"
              className="squircle h-auto w-full rounded-photo"
            />
          </figure>
        </div>
      </Container>
    </SiteShell>
  );
}
