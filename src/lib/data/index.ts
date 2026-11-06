/**
 * Capa de acceso a datos.
 *
 * Todas las lecturas están cacheadas con `"use cache"` (Cache Components) y
 * etiquetadas para que los webhooks puedan invalidarlas con `revalidateTag`.
 * Si `DATABASE_URL` no está definida se sirven los datos de demostración.
 */
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { and, desc, eq, inArray } from "drizzle-orm";
import { getDb, isDatabaseConfigured, schema } from "@/db";
import type { Article, ArticleSummary, Category, Product } from "../types";
import { demoArticles, demoCategories, demoProducts } from "./demo-data";
import { mapArticle, mapCategory, mapProduct } from "./mappers";
import { CACHE_TAGS } from "./tags";

function toSummary(article: Article): ArticleSummary {
  const summary: Partial<Article> = { ...article };
  delete summary.content;
  delete summary.faqs;
  return summary as ArticleSummary;
}

/* ─────────────────────────── Categorías ─────────────────────────── */

export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.categories);

  if (!isDatabaseConfigured) return demoCategories;
  const rows = await getDb().select().from(schema.categories).orderBy(schema.categories.name);
  return rows.map(mapCategory);
}

/* ─────────────────────────── Productos ─────────────────────────── */

export async function getAllProducts(): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.products);

  if (!isDatabaseConfigured) return demoProducts;
  const rows = await getDb()
    .select({ product: schema.products, category: schema.categories })
    .from(schema.products)
    .leftJoin(schema.categories, eq(schema.products.categoryId, schema.categories.id))
    .orderBy(desc(schema.products.isFeatured), desc(schema.products.editorialRating));
  return rows.map((r) => mapProduct(r.product, r.category));
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  const products = await getAllProducts();
  const featured = products.filter((p) => p.isFeatured);
  return (featured.length ? featured : products).slice(0, limit);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getAllProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getProductsByAsins(asins: string[]): Promise<Product[]> {
  const set = new Set(asins.map((a) => a.toUpperCase()));
  const products = await getAllProducts();
  return products.filter((p) => set.has(p.asin));
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  const products = await getAllProducts();
  const byId = new Map(products.map((p) => [p.id, p]));
  return ids.map((id) => byId.get(id)).filter((p): p is Product => Boolean(p));
}

export async function getRelatedProducts(product: Product, limit = 3): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter((p) => p.id !== product.id && p.categoryId === product.categoryId).slice(0, limit);
}

/* ─────────────────────────── Artículos ─────────────────────────── */

export async function getPublishedArticles(): Promise<ArticleSummary[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.articles);

  if (!isDatabaseConfigured) {
    return demoArticles
      .filter((a) => a.status === "published")
      .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))
      .map(toSummary);
  }

  const db = getDb();
  const rows = await db
    .select()
    .from(schema.articles)
    .where(eq(schema.articles.status, "published"))
    .orderBy(desc(schema.articles.publishedAt));
  const links = rows.length
    ? await db
        .select()
        .from(schema.articleProducts)
        .where(
          inArray(
            schema.articleProducts.articleId,
            rows.map((r) => r.id),
          ),
        )
    : [];
  return rows.map((r) =>
    toSummary(
      mapArticle(
        r,
        links.filter((l) => l.articleId === r.id).sort((a, b) => a.position - b.position).map((l) => l.productId),
      ),
    ),
  );
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.articles, `article:${slug}`);

  if (!isDatabaseConfigured) {
    return demoArticles.find((a) => a.slug === slug && a.status === "published") ?? null;
  }

  const db = getDb();
  const [row] = await db
    .select()
    .from(schema.articles)
    .where(and(eq(schema.articles.slug, slug), eq(schema.articles.status, "published")))
    .limit(1);
  if (!row) return null;
  const links = await db
    .select()
    .from(schema.articleProducts)
    .where(eq(schema.articleProducts.articleId, row.id))
    .orderBy(schema.articleProducts.position);
  return mapArticle(
    row,
    links.map((l) => l.productId),
  );
}

/** Guías que mencionan un producto (enlazado interno reseña → guía). */
export async function getArticlesForProduct(productId: string, limit = 3): Promise<ArticleSummary[]> {
  const articles = await getPublishedArticles();
  return articles.filter((a) => a.relatedProductIds.includes(productId)).slice(0, limit);
}

/* ─────────────────────────── Comparativas ─────────────────────────── */

export interface ComparisonPair {
  slug: string;
  a: Product;
  b: Product;
}

/** Slug canónico: los dos slugs ordenados alfabéticamente unidos por "-vs-". */
export function comparisonSlug(a: Pick<Product, "slug">, b: Pick<Product, "slug">): string {
  const [x, y] = [a.slug, b.slug].sort();
  return `${x}-vs-${y}`;
}

/** Todas las parejas posibles dentro de una misma categoría. */
export async function getComparisonPairs(): Promise<ComparisonPair[]> {
  const products = await getAllProducts();
  const pairs: ComparisonPair[] = [];
  for (let i = 0; i < products.length; i++) {
    for (let j = i + 1; j < products.length; j++) {
      const p = products[i];
      const q = products[j];
      if (!p.categoryId || p.categoryId !== q.categoryId) continue;
      const [a, b] = p.slug < q.slug ? [p, q] : [q, p];
      pairs.push({ slug: comparisonSlug(a, b), a, b });
    }
  }
  return pairs;
}

/**
 * Resuelve "slug-a-vs-slug-b" en ambos órdenes. Devuelve `canonical` para
 * redirigir permanentemente cuando el orden no es el canónico.
 */
export async function resolveComparison(
  slug: string,
): Promise<{ a: Product; b: Product; canonical: string } | null> {
  const products = await getAllProducts();
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  let idx = slug.indexOf("-vs-");
  while (idx !== -1) {
    const left = bySlug.get(slug.slice(0, idx));
    const right = bySlug.get(slug.slice(idx + 4));
    if (left && right && left.id !== right.id) {
      const [a, b] = left.slug < right.slug ? [left, right] : [right, left];
      return { a, b, canonical: comparisonSlug(a, b) };
    }
    idx = slug.indexOf("-vs-", idx + 1);
  }
  return null;
}
