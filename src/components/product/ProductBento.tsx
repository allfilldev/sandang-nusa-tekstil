import Image from "next/image";
import Link from "next/link";
import type { ProductCategory } from "@/domain/product";

interface ProductBentoProps {
  categories: ProductCategory[];
}

export function ProductBento({ categories }: ProductBentoProps) {
  return (
    <ul className="grid gap-5 lg:grid-cols-[1.15fr_1fr] lg:grid-rows-2">
      {categories.map((category, index) => {
        const isFeatured = index === 0;
        return (
          <li key={category.id} className={isFeatured ? "lg:row-span-2" : ""}>
            <article
              className={`photo-card squircle relative flex h-full min-h-80 flex-col justify-end overflow-hidden rounded-photo bg-nila text-benang ${isFeatured ? "lg:min-h-[36rem]" : ""}`}
            >
              <div className="photo-zoom absolute inset-0">
                <Image
                  src={category.image}
                  alt={category.image.alt}
                  fill
                  sizes="(min-width: 1024px) 560px, calc(100vw - 32px)"
                  loading="lazy"
                  className="object-cover"
                />
              </div>
              <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-nila via-nila/55 via-40% to-transparent to-85%" />
              <div className="relative p-6 md:p-8">
                <h3 className="font-display text-2xl font-extrabold leading-tight md:text-3xl">
                  <Link href={`/produk#${category.id}`} className="after:absolute after:inset-0">
                    {category.name}
                  </Link>
                </h3>
                <p className={`mt-2 max-w-[46ch] text-base text-benang/90 ${isFeatured ? "" : "line-clamp-2"}`}>
                  {category.description}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {category.commonUses.map((use) => (
                    <li key={use} className="rounded-full bg-benang/15 px-3 py-1 font-display text-sm ring-1 ring-benang/35">
                      {use}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
