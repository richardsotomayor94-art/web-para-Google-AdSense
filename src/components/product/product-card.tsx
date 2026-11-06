import Link from "next/link";
import { resolveAffiliateLinks } from "@/lib/amazon";
import type { Product } from "@/lib/types";
import { cn, shortName } from "@/lib/utils";
import { AffiliateButton } from "./affiliate-button";
import { PriceTag } from "./price-tag";
import { ProductBadge } from "./product-badge";
import { ProductImage } from "./product-image";
import { RatingStars } from "./rating-stars";
import { ScoreGauge } from "./score-gauge";

function KeySpecs({ product, count = 2 }: { product: Product; count?: number }) {
  const specs = Object.entries(product.features).slice(0, count);
  if (!specs.length) return null;
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-rule pt-3 text-sm">
      {specs.map(([k, v]) => (
        <div key={k} className="min-w-0">
          <dt className="type-label truncate">{k}</dt>
          <dd className="truncate font-semibold text-ink">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Ficha de ensayo vertical (rejillas: home, catálogo, relacionados). */
export function ProductCard({ product, placement = "card", className }: { product: Product; placement?: string; className?: string }) {
  const links = resolveAffiliateLinks(product);
  return (
    <article className={cn("test-sheet reveal flex h-full flex-col", className)}>
      <Link href={`/resenas/${product.slug}`} className="block border-b border-rule" aria-label={`Leer el análisis de ${shortName(product.title)}`}>
        <ProductImage src={product.imageUrl} alt={product.title} className="rounded-none rounded-t-[inherit] bg-card" />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex min-h-6 flex-wrap items-center gap-2">
          <ProductBadge badge={product.badge} />
          {product.categoryName && <span className="type-label">{product.categoryName}</span>}
        </div>
        <h3 className="text-[1.0625rem] font-semibold leading-snug text-ink">
          <Link href={`/resenas/${product.slug}`} className="hover:text-measure">
            {shortName(product.title)}
          </Link>
        </h3>
        <ScoreGauge score={product.editorialRating} size="sm" />
        <KeySpecs product={product} />
        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-2">
          <PriceTag current={product.priceCurrent} original={product.priceOriginal} discount={product.discountPercent} currency={product.currency} />
          <RatingStars rating={product.rating} />
        </div>
        <AffiliateButton product={product} links={links} placement={placement} size="default" className="sm:w-full" />
      </div>
    </article>
  );
}

/** Ficha destacada horizontal: el producto mejor medido de la selección. */
export function ProductFeatured({ product, placement = "featured" }: { product: Product; placement?: string }) {
  const links = resolveAffiliateLinks(product);
  return (
    <article className="test-sheet reveal grid overflow-hidden md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <Link href={`/resenas/${product.slug}`} className="block border-b border-rule bg-card md:border-r md:border-b-0">
        <ProductImage src={product.imageUrl} alt={product.title} sizes="(min-width: 768px) 40vw, 100vw" className="rounded-none" />
      </Link>
      <div className="flex flex-col gap-4 p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <ProductBadge badge={product.badge} />
          {product.categoryName && <span className="type-label">{product.categoryName}</span>}
        </div>
        <h3 className="type-heading text-2xl text-ink sm:text-[1.75rem]">
          <Link href={`/resenas/${product.slug}`} className="hover:text-measure">
            {shortName(product.title)}
          </Link>
        </h3>
        {product.verdict && <p className="max-w-prose text-ink-2">{product.verdict}</p>}
        <ScoreGauge score={product.editorialRating} size="lg" />
        <KeySpecs product={product} count={4} />
        <div className="mt-auto flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <PriceTag current={product.priceCurrent} original={product.priceOriginal} discount={product.discountPercent} currency={product.currency} size="lg" />
          <AffiliateButton product={product} links={links} placement={placement} />
        </div>
        <Link href={`/resenas/${product.slug}`} className="text-sm font-medium text-measure underline decoration-measure/40 underline-offset-4 hover:decoration-measure">
          Leer el análisis completo
        </Link>
      </div>
    </article>
  );
}

/** Ficha horizontal para insertar dentro de artículos ({{product:ASIN}}). */
export function ProductInline({ product, placement = "article_inline" }: { product: Product; placement?: string }) {
  const links = resolveAffiliateLinks(product);
  return (
    <aside className="test-sheet not-prose my-8 overflow-hidden">
      <div className="grid gap-4 p-4 sm:grid-cols-[150px_1fr] sm:p-5">
        <Link href={`/resenas/${product.slug}`} className="mx-auto w-36 sm:w-full">
          <ProductImage src={product.imageUrl} alt={product.title} sizes="150px" />
        </Link>
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <ProductBadge badge={product.badge} />
            <RatingStars rating={product.rating} />
          </div>
          <p className="text-lg font-semibold leading-snug text-ink">
            <Link href={`/resenas/${product.slug}`} className="hover:text-measure">
              {shortName(product.title)}
            </Link>
          </p>
          {product.verdict && <p className="text-sm text-ink-2">{product.verdict}</p>}
          <ScoreGauge score={product.editorialRating} size="sm" className="max-w-xs" />
          <div className="mt-auto flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <PriceTag current={product.priceCurrent} original={product.priceOriginal} discount={product.discountPercent} currency={product.currency} />
            <AffiliateButton product={product} links={links} placement={placement} size="default" />
          </div>
        </div>
      </div>
    </aside>
  );
}
