import "server-only";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { extractAsins } from "../markdown";
import { shortName, slugify } from "../utils";
import type { ArticlePublishInput } from "./schemas";

export interface PublishResult {
  id: string;
  slug: string;
  status: "draft" | "published";
  created: boolean;
  linkedProducts: { asin: string; slug: string }[];
}

/**
 * Inserta o actualiza (por slug) un artículo y lo asocia a productos:
 *  1. ASIN de `related_asins` (orden explícito)
 *  2. shortcodes `{{product:ASIN}}` del contenido
 *  3. con `auto_link_products`: ASIN sueltos y nombres de producto citados en el texto
 */
export async function publishArticle(input: ArticlePublishInput): Promise<PublishResult> {
  const db = getDb();
  const slug = input.slug ?? slugify(input.title);

  const categoryId = input.category_slug
    ? (
        await db
          .select({ id: schema.categories.id })
          .from(schema.categories)
          .where(eq(schema.categories.slug, input.category_slug))
          .limit(1)
      )[0]?.id
    : undefined;

  // ── Detección de productos ──
  const ordered: string[] = [...(input.related_asins ?? []), ...extractAsins(input.content)];
  const all = await db
    .select({ id: schema.products.id, asin: schema.products.asin, slug: schema.products.slug, title: schema.products.title })
    .from(schema.products);
  if (input.auto_link_products) {
    const haystack = input.content.toLowerCase();
    for (const p of all) {
      const name = shortName(p.title).toLowerCase();
      if (haystack.includes(p.asin.toLowerCase()) || (name.length >= 6 && haystack.includes(name))) ordered.push(p.asin);
    }
  }
  const asinOrder = [...new Set(ordered.map((a) => a.toUpperCase()))];
  const linked = asinOrder
    .map((asin) => all.find((p) => p.asin === asin))
    .filter((p): p is (typeof all)[number] => Boolean(p));

  const values = {
    title: input.title,
    slug,
    content: input.content,
    excerpt: input.excerpt ?? null,
    author: input.author ?? null,
    featuredImage: input.featured_image ?? null,
    categoryId: categoryId ?? null,
    faqs: input.faqs ?? [],
    seoTitle: input.seo_title ?? null,
    seoDescription: input.seo_description ?? null,
    status: input.status,
  };

  return db.transaction(async (tx) => {
    const [existing] = await tx
      .select({ id: schema.articles.id, publishedAt: schema.articles.publishedAt })
      .from(schema.articles)
      .where(eq(schema.articles.slug, slug))
      .limit(1);

    const publishedAt =
      input.published_at ?? existing?.publishedAt ?? (input.status === "published" ? new Date() : null);

    let id: string;
    if (existing) {
      await tx.update(schema.articles).set({ ...values, publishedAt }).where(eq(schema.articles.id, existing.id));
      id = existing.id;
    } else {
      const [row] = await tx.insert(schema.articles).values({ ...values, publishedAt }).returning({ id: schema.articles.id });
      id = row.id;
    }

    await tx.delete(schema.articleProducts).where(eq(schema.articleProducts.articleId, id));
    if (linked.length) {
      await tx
        .insert(schema.articleProducts)
        .values(linked.map((p, position) => ({ articleId: id, productId: p.id, position })));
    }

    return {
      id,
      slug,
      status: input.status,
      created: !existing,
      linkedProducts: linked.map((p) => ({ asin: p.asin, slug: p.slug })),
    };
  });
}
