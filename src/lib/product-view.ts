import { resolveAffiliateLinks } from "./amazon";
import type { Product } from "./types";
import type { ComparableProduct } from "@/components/product/comparison-table";

/** Reduce el producto a lo que necesita la tabla comparativa (props serializables para el cliente). */
export function toComparable(p: Product): ComparableProduct {
  return {
    id: p.id,
    asin: p.asin,
    slug: p.slug,
    title: p.title,
    imageUrl: p.imageUrl,
    priceCurrent: p.priceCurrent,
    priceOriginal: p.priceOriginal,
    discountPercent: p.discountPercent,
    currency: p.currency,
    rating: p.rating,
    reviewCount: p.reviewCount,
    editorialRating: p.editorialRating,
    badge: p.badge,
    features: p.features,
    links: resolveAffiliateLinks(p),
  };
}
