import "server-only";
import { eq, inArray } from "drizzle-orm";
import { getDb, schema } from "@/db";
import type { NewProductRow } from "@/db/schema";
import { buildAffiliateUrl, ensureAffiliateTag } from "../amazon";
import { computeDiscount, slugify } from "../utils";
import type { ProductInput } from "./schemas";

export interface SyncResult {
  created: { asin: string; slug: string }[];
  updated: { asin: string; slug: string }[];
  errors: { asin: string; error: string }[];
}

const titleize = (slug: string) => slug.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());

/**
 * Crea o actualiza productos por ASIN. Solo se tocan los campos presentes en
 * el payload, de modo que una sincronización diaria de precios puede enviar
 * únicamente `{ asin, price_current, price_original }`.
 */
export async function syncProducts(items: ProductInput[]): Promise<SyncResult> {
  const db = getDb();
  const result: SyncResult = { created: [], updated: [], errors: [] };

  const asins = [...new Set(items.map((i) => i.asin))];
  const existingRows = await db.select().from(schema.products).where(inArray(schema.products.asin, asins));
  const existing = new Map(existingRows.map((r) => [r.asin, r]));

  const categoryCache = new Map<string, string>();
  async function resolveCategoryId(slug?: string, name?: string): Promise<string | undefined> {
    const key = slug ? slugify(slug) : name ? slugify(name) : undefined;
    if (!key) return undefined;
    if (categoryCache.has(key)) return categoryCache.get(key);
    const [found] = await db.select({ id: schema.categories.id }).from(schema.categories).where(eq(schema.categories.slug, key)).limit(1);
    const id =
      found?.id ??
      (
        await db
          .insert(schema.categories)
          .values({ slug: key, name: name ?? titleize(key) })
          .onConflictDoUpdate({ target: schema.categories.slug, set: { slug: key } })
          .returning({ id: schema.categories.id })
      )[0].id;
    categoryCache.set(key, id);
    return id;
  }

  async function uniqueSlug(base: string, asin: string): Promise<string> {
    const [clash] = await db.select({ id: schema.products.id }).from(schema.products).where(eq(schema.products.slug, base)).limit(1);
    return clash ? `${base}-${asin.toLowerCase()}`.slice(0, 200) : base;
  }

  for (const item of items) {
    try {
      const current = existing.get(item.asin);
      const categoryId = await resolveCategoryId(item.category_slug, item.category_name);

      const values: Partial<NewProductRow> = {};
      const set = <K extends keyof NewProductRow>(key: K, value: NewProductRow[K] | undefined) => {
        if (value !== undefined) values[key] = value;
      };

      set("title", item.title);
      set("brand", item.brand);
      set("description", item.description);
      set("verdict", item.verdict);
      set("features", item.features);
      set("pros", item.pros);
      set("cons", item.cons);
      set("priceCurrent", item.price_current);
      set("priceOriginal", item.price_original);
      set("currency", item.currency);
      set("imageUrl", item.image_url);
      set("galleryImages", item.gallery_images);
      set("categoryId", categoryId);
      set("rating", item.rating);
      set("reviewCount", item.review_count);
      set("editorialRating", item.editorial_rating);
      set("badge", item.badge);
      set("isFeatured", item.is_featured);
      set("isAvailable", item.is_available);
      if (item.amazon_url_es) values.amazonUrlEs = ensureAffiliateTag(item.amazon_url_es, "es");
      if (item.amazon_url_us) values.amazonUrlUs = ensureAffiliateTag(item.amazon_url_us, "us");

      if (item.price_current !== undefined || item.price_original !== undefined) {
        values.priceCheckedAt = new Date();
        values.discountPercent =
          item.discount_percent ??
          computeDiscount(item.price_current ?? current?.priceCurrent, item.price_original ?? current?.priceOriginal);
      } else if (item.discount_percent !== undefined) {
        values.discountPercent = item.discount_percent;
      }

      if (current) {
        if (item.slug && item.slug !== current.slug) values.slug = await uniqueSlug(item.slug, item.asin);
        if (Object.keys(values).length) {
          await db.update(schema.products).set(values).where(eq(schema.products.id, current.id));
        }
        result.updated.push({ asin: item.asin, slug: values.slug ?? current.slug });
      } else {
        if (!item.title) throw new Error("`title` es obligatorio para crear un producto nuevo");
        const slug = await uniqueSlug(item.slug ?? slugify(item.title), item.asin);
        const [row] = await db
          .insert(schema.products)
          .values({
            ...values,
            asin: item.asin,
            title: item.title,
            slug,
            amazonUrlEs: values.amazonUrlEs ?? buildAffiliateUrl(item.asin, "es"),
            amazonUrlUs: values.amazonUrlUs ?? buildAffiliateUrl(item.asin, "us"),
          })
          .returning({ slug: schema.products.slug });
        result.created.push({ asin: item.asin, slug: row.slug });
      }
    } catch (error) {
      result.errors.push({ asin: item.asin, error: error instanceof Error ? error.message : String(error) });
    }
  }

  return result;
}
