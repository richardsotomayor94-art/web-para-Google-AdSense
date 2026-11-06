import Image from "next/image";
import { cn } from "@/lib/utils";

export function ProductImage({
  src,
  alt,
  priority,
  className,
  sizes = "(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw",
}: {
  src: string | null;
  alt: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
}) {
  const resolved = src ?? "/images/demo/placeholder.svg";
  return (
    <div className={cn("relative aspect-square overflow-hidden rounded-lg bg-white", className)}>
      <Image
        src={resolved}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized={resolved.endsWith(".svg")}
        className="object-contain p-4"
      />
    </div>
  );
}
