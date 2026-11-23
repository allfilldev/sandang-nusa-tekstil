import Image from "next/image";
import type { ProductCategory } from "@/domain/product";

interface ProductSwatchesProps {
  categories: ProductCategory[];
  withDetails?: boolean;
}

export function ProductSwatches({ categories, withDetails = false }: ProductSwatchesProps) {
  return (
    <ul className="grid gap-8 md:grid-cols-3">
      {categories.map((category) => (
        <li key={category.id} id={category.id} className="product-card flex scroll-mt-24 flex-col">
          <figure className="photo-zoom squircle relative aspect-[4/3] overflow-hidden rounded-photo">
            <Image
              src={category.image}
              alt={category.image.alt}
              fill
              sizes="(min-width: 1152px) 342px, (min-width: 768px) 30vw, calc(100vw - 32px)"
              loading="lazy"
              className="object-cover"
            />
          </figure>
          <h3 className="product-title mt-5 font-display font-extrabold leading-tight">{category.name}</h3>
          <p className="mt-2 text-base">{category.description}</p>
          <p className="mt-3 font-display text-sm font-semibold">Pemakaian umum</p>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-base marker:text-nila">
            {category.commonUses.map((use) => (
              <li key={use}>{use}</li>
            ))}
          </ul>
          {withDetails ? (
            <details name="rincian-produk" className="spec-details mt-4 border-t border-nila/25 pt-2">
              <summary>Rincian {category.name.toLowerCase()}</summary>
              <ul className="mt-2 list-disc space-y-2 pb-2 pl-5 text-base marker:text-nila">
                {category.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </details>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
