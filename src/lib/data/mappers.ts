import type { ArticleRow, CategoryRow, ProductRow } from "@/db/schema";
import type { Article, Category, Product } from "../types";

const iso = (d: Date | string | null | undefined): string | null =>
  d == null ? null : typeof d === "string" ? d : d.toISOString();

export function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    icon: row.icon,
    parentId: row.parentId,
  };
}

export function mapProduct(row: ProductRow, category?: Pick<CategoryRow, "slug" | "name"> | null): Product {
  return {
    id: row.id,
    asin: row.asin,
    title: row.title,
    slug: row.slug,
    brand: row.brand,
    description: row.description,
    verdict: row.verdict,
    features: row.features ?? {},
    pros: row.pros ?? [],
    cons: row.cons ?? [],
    priceCurrent: row.priceCurrent,
    priceOriginal: row.priceOriginal,
    currency: row.currency,
    discountPercent: row.discountPercent,
    amazonUrlEs: row.amazonUrlEs,
    amazonUrlUs: row.amazonUrlUs,
    imageUrl: row.imageUrl,
    galleryImages: row.galleryImages ?? [],
    categoryId: row.categoryId,
    categorySlug: category?.slug ?? null,
    categoryName: category?.name ?? null,
    rating: row.rating,
    reviewCount: row.reviewCount,
    editorialRating: row.editorialRating,
    badge: row.badge,
    isFeatured: row.isFeatured,
    isAvailable: row.isAvailable,
    createdAt: iso(row.createdAt)!,
    updatedAt: iso(row.updatedAt)!,
  };
}

export function mapArticle(row: ArticleRow, relatedProductIds: string[] = []): Article {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    content: row.content,
    excerpt: row.excerpt,
    author: row.author ?? null,
    featuredImage: row.featuredImage,
    categoryId: row.categoryId,
    faqs: row.faqs ?? [],
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    status: row.status,
    publishedAt: iso(row.publishedAt),
    createdAt: iso(row.createdAt)!,
    updatedAt: iso(row.updatedAt)!,
    relatedProductIds,
  };
}
