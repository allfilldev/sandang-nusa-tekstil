import Image from "next/image";
import heroTextile from "../../../public/images/hero-tekstil.webp";
import finishedFabric from "../../../public/images/produk/kain-jadi.webp";

interface HeroTextileImageProps {
  label: string;
  caption: string;
}

export function HeroTextileImage({ label, caption }: HeroTextileImageProps) {
  return (
    <figure className="relative mx-auto mb-12 w-full max-w-lg lg:mb-0 lg:ml-auto lg:mr-0">
      <div className="hero-photo-main squircle relative aspect-[4/5] overflow-hidden rounded-photo">
        <Image
          src={heroTextile}
          alt="Ilustrasi AI gulungan dan lipatan kain nila, putih gading, kunyit, dan biru pudar dengan kerucut benang di belakang"
          sizes="(min-width: 1024px) 480px, calc(100vw - 32px)"
          loading="eager"
          fetchPriority="high"
          placeholder="blur"
          className="size-full object-cover"
        />
        <span className="hero-chip absolute left-4 top-4 rounded-full bg-benang px-4 py-2 font-display text-sm font-bold text-nila">
          {label}
        </span>
      </div>
      <div className="hero-photo-second squircle absolute -bottom-10 -left-3 w-28 overflow-hidden rounded-card border-4 border-nila shadow-lg sm:-left-8 sm:w-40 lg:-bottom-16">
        <Image
          src={finishedFabric}
          alt="Ilustrasi AI tumpukan kain jadi berwarna kunyit, putih gading, nila, dan biru pudar"
          sizes="160px"
          placeholder="blur"
          className="aspect-square size-full object-cover"
        />
      </div>
      <figcaption className="sr-only">{caption}</figcaption>
    </figure>
  );
}
