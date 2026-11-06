"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Trophy } from "lucide-react";
import type { AffiliateLinks } from "@/lib/amazon";
import { siteConfig } from "@/lib/site";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AffiliateButton } from "./affiliate-button";
import { PriceTag } from "./price-tag";
import { ProductBadge } from "./product-badge";
import { ProductImage } from "./product-image";
import { RatingStars } from "./rating-stars";

export type ComparableProduct = Pick<
  Product,
  | "id"
  | "asin"
  | "slug"
  | "title"
  | "imageUrl"
  | "priceCurrent"
  | "priceOriginal"
  | "discountPercent"
  | "currency"
  | "rating"
  | "reviewCount"
  | "editorialRating"
  | "badge"
  | "features"
> & { links: AffiliateLinks };

/**
 * Tabla comparativa interactiva y responsiva: primera columna fija al hacer
 * scroll horizontal en móvil y filtro "solo diferencias".
 */
export function ComparisonTable({ products, placement = "comparison_table" }: { products: ComparableProduct[]; placement?: string }) {
  const [onlyDiff, setOnlyDiff] = useState(false);

  const specKeys = useMemo(() => {
    const keys: string[] = [];
    for (const p of products) for (const k of Object.keys(p.features)) if (!keys.includes(k)) keys.push(k);
    return keys;
  }, [products]);

  const visibleKeys = onlyDiff
    ? specKeys.filter((k) => new Set(products.map((p) => p.features[k] ?? "—")).size > 1)
    : specKeys;

  const bestScore = Math.max(...products.map((p) => p.editorialRating ?? 0));
  const cheapest = Math.min(...products.map((p) => p.priceCurrent ?? Infinity));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end">
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="size-4 accent-[var(--primary)]"
            checked={onlyDiff}
            onChange={(e) => setOnlyDiff(e.target.checked)}
          />
          Mostrar solo diferencias
        </label>
      </div>
      <div className="relative overflow-x-auto rounded-xl border">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b align-top">
              <th scope="col" className="sticky left-0 z-10 w-36 bg-card p-3 text-left text-xs font-medium uppercase text-ink-3 sm:w-48">
                Producto
              </th>
              {products.map((p) => (
                <th key={p.id} scope="col" className="p-3 text-left font-normal">
                  <div className="flex flex-col gap-2">
                    <Link href={`/resenas/${p.slug}`}>
                      <ProductImage src={p.imageUrl} alt={p.title} sizes="200px" className="mx-auto w-28 sm:w-36" />
                    </Link>
                    <div className="flex flex-wrap gap-1">
                      <ProductBadge badge={p.badge} />
                      {p.editorialRating === bestScore && products.length > 1 && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          <Trophy className="size-3" aria-hidden /> Ganador
                        </span>
                      )}
                    </div>
                    <Link href={`/resenas/${p.slug}`} className="font-semibold leading-snug hover:underline">
                      {p.title}
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <Row label="Precio">
              {products.map((p) => (
                <td key={p.id} className={cn("p-3", p.priceCurrent === cheapest && products.length > 1 && "bg-success/5")}>
                  <PriceTag current={p.priceCurrent} original={p.priceOriginal} discount={p.discountPercent} currency={p.currency} />
                </td>
              ))}
            </Row>
            <Row label={`Nota ${siteConfig.name}`}>
              {products.map((p) => (
                <td key={p.id} className={cn("p-3 text-base font-bold", p.editorialRating === bestScore && "text-primary")}>
                  {p.editorialRating?.toFixed(1) ?? "—"}
                  <span className="text-xs font-normal text-ink-3"> / 10</span>
                </td>
              ))}
            </Row>
            <Row label="Valoración Amazon">
              {products.map((p) => (
                <td key={p.id} className="p-3">
                  <RatingStars rating={p.rating} />
                </td>
              ))}
            </Row>
            {visibleKeys.map((key) => (
              <Row key={key} label={key}>
                {products.map((p) => (
                  <td key={p.id} className="p-3">
                    {p.features[key] ?? "—"}
                  </td>
                ))}
              </Row>
            ))}
            <tr>
              <th scope="row" className="sticky left-0 z-10 bg-card p-3" />
              {products.map((p) => (
                <td key={p.id} className="p-3">
                  <AffiliateButton product={p} links={p.links} placement={placement} size="default" className="sm:w-full" />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr className="border-b even:bg-muted/30">
      <th scope="row" className="sticky left-0 z-10 bg-card p-3 text-left font-medium text-ink-3">
        {label}
      </th>
      {children}
    </tr>
  );
}
