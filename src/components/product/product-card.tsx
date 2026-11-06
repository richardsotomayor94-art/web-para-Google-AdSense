import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { resolveAffiliateLinks } from "@/lib/amazon";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AffiliateButton } from "./affiliate-button";
import { PriceTag } from "./price-tag";
import { ProductBadge } from "./product-badge";
import { ProductImage } from "./product-image";
import { EditorialScore, RatingStars } from "./rating-stars";

/** Tarjeta vertical para rejillas (home, catálogo, relacionados). */
export function ProductCard({ product, placement = "card", className }: { product: Product; placement?: string; className?: string }) {
  const links = resolveAffiliateLinks(product);
  return (
    <Card className={cn("relative h-full gap-3 overflow-hidden pt-0 transition-shadow hover:shadow-md", className)}>
      <Link href={`/resenas/${product.slug}`} className="block border-b" aria-label={`Leer reseña: ${product.title}`}>
        <ProductImage src={product.imageUrl} alt={product.title} className="rounded-none" />
      </Link>
      <div className="absolute top-3 left-3 flex flex-col gap-1">
        <ProductBadge badge={product.badge} />
        {product.discountPercent ? (
          <span className="w-fit rounded-md bg-destructive px-2 py-0.5 text-xs font-semibold text-white">
            −{product.discountPercent}%
          </span>
        ) : null}
      </div>
      <CardContent className="flex flex-1 flex-col gap-2">
        {product.categoryName && (
          <span className="text-xs font-medium uppercase tracking-wide text-primary">{product.categoryName}</span>
        )}
        <h3 className="line-clamp-2 font-semibold leading-snug">
          <Link href={`/resenas/${product.slug}`} className="hover:underline">
            {product.title}
          </Link>
        </h3>
        <RatingStars rating={product.rating} />
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <PriceTag
            current={product.priceCurrent}
            original={product.priceOriginal}
            discount={null}
            currency={product.currency}
          />
          <EditorialScore score={product.editorialRating} />
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <AffiliateButton product={product} links={links} placement={placement} size="default" className="sm:w-full" />
        <Link href={`/resenas/${product.slug}`} className="text-sm text-muted-foreground hover:text-foreground hover:underline">
          Leer análisis completo
        </Link>
      </CardFooter>
    </Card>
  );
}

/** Ficha horizontal para insertar dentro de artículos ({{product:ASIN}}). */
export function ProductInline({ product, placement = "article_inline" }: { product: Product; placement?: string }) {
  const links = resolveAffiliateLinks(product);
  return (
    <aside className="not-prose my-8 overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="grid gap-4 p-4 sm:grid-cols-[160px_1fr] sm:p-5">
        <Link href={`/resenas/${product.slug}`} className="mx-auto w-40 sm:w-full">
          <ProductImage src={product.imageUrl} alt={product.title} sizes="160px" />
        </Link>
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <ProductBadge badge={product.badge} />
            <RatingStars rating={product.rating} />
          </div>
          <p className="text-lg font-semibold leading-snug">
            <Link href={`/resenas/${product.slug}`} className="hover:underline">
              {product.title}
            </Link>
          </p>
          {product.verdict && <p className="text-sm text-muted-foreground">{product.verdict}</p>}
          <div className="mt-auto flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <PriceTag
              current={product.priceCurrent}
              original={product.priceOriginal}
              discount={product.discountPercent}
              currency={product.currency}
            />
            <AffiliateButton product={product} links={links} placement={placement} size="default" />
          </div>
        </div>
      </div>
    </aside>
  );
}
