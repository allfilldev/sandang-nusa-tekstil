import Image from "next/image";
import type { ArticleImage } from "@/domain/article";

interface ArticleFigureProps {
  image: ArticleImage;
}

export function ArticleFigure({ image }: ArticleFigureProps) {
  return (
    <figure className="my-8">
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes="(min-width: 1024px) 640px, 100vw"
        className="squircle h-auto w-full rounded-photo"
      />
      <figcaption className="mt-3 text-base text-nila/80">{image.caption}</figcaption>
    </figure>
  );
}
