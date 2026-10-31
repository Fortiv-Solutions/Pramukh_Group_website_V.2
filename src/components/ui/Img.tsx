import Image from "next/image";
import { media, type MediaKey } from "@/content/media";

type Props = {
  k: MediaKey;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** CSS object-position, e.g. "50% 30%". */
  position?: string;
  alt?: string;
  quality?: 70 | 80;
};

/** Cover-fit image from the media manifest. Place inside a sized `.frame`. */
export function Img({ k, sizes, priority, className, position, alt, quality = 80 }: Props) {
  const m = media(k);
  return (
    <Image
      src={m.src}
      alt={alt ?? m.alt}
      fill
      sizes={sizes}
      quality={quality}
      priority={priority}
      placeholder="blur"
      blurDataURL={m.blurDataURL}
      className={className}
      style={position ? { objectPosition: position } : undefined}
    />
  );
}
