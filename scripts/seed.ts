/**
 * Carga las categorías, productos y guías de demostración en la base de datos.
 *   npm run db:seed
 * Es idempotente: actualiza por slug/ASIN si ya existen.
 */
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../src/db/schema";
import { demoArticles, demoCategories, demoProducts } from "../src/lib/data/demo-data";

config({ path: [".env.local", ".env"], quiet: true });

async function main() {
  const url = process.env.DATABASE_MIGRATION_URL ?? process.env.DATABASE_URL;
  if (!url) throw new Error("Define DATABASE_URL en .env.local");
  const client = postgres(url, { prepare: false, max: 1 });
  const db = drizzle(client, { schema });

  const categoryIds = new Map<string, string>();
  for (const c of demoCategories) {
    const [row] = await db
      .insert(schema.categories)
      .values({ name: c.name, slug: c.slug, description: c.description, icon: c.icon })
      .onConflictDoUpdate({ target: schema.categories.slug, set: { name: c.name, description: c.description, icon: c.icon } })
      .returning({ id: schema.categories.id });
    categoryIds.set(c.id, row.id);
  }

  const productIds = new Map<string, string>();
  for (const p of demoProducts) {
    const values = {
      asin: p.asin,
      title: p.title,
      slug: p.slug,
      brand: p.brand,
      description: p.description,
      verdict: p.verdict,
      features: p.features,
      pros: p.pros,
      cons: p.cons,
      priceCurrent: p.priceCurrent,
      priceOriginal: p.priceOriginal,
      currency: p.currency,
      discountPercent: p.discountPercent,
      imageUrl: p.imageUrl,
      galleryImages: p.galleryImages,
      categoryId: p.categoryId ? categoryIds.get(p.categoryId) : null,
      rating: p.rating,
      reviewCount: p.reviewCount,
      editorialRating: p.editorialRating,
      badge: p.badge,
      isFeatured: p.isFeatured,
    };
    const [row] = await db
      .insert(schema.products)
      .values(values)
      .onConflictDoUpdate({ target: schema.products.asin, set: values })
      .returning({ id: schema.products.id });
    productIds.set(p.id, row.id);
  }

  for (const a of demoArticles) {
    const values = {
      title: a.title,
      slug: a.slug,
      content: a.content,
      excerpt: a.excerpt,
      author: a.author,
      faqs: a.faqs,
      seoTitle: a.seoTitle,
      seoDescription: a.seoDescription,
      status: a.status,
      publishedAt: a.publishedAt ? new Date(a.publishedAt) : null,
      categoryId: a.categoryId ? categoryIds.get(a.categoryId) : null,
    };
    const [row] = await db
      .insert(schema.articles)
      .values(values)
      .onConflictDoUpdate({ target: schema.articles.slug, set: values })
      .returning({ id: schema.articles.id });
    const links = a.relatedProductIds
      .map((id, position) => ({ articleId: row.id, productId: productIds.get(id)!, position }))
      .filter((l) => l.productId);
    if (links.length) await db.insert(schema.articleProducts).values(links).onConflictDoNothing();
  }

  console.log(`✓ Seed: ${demoCategories.length} categorías, ${demoProducts.length} productos, ${demoArticles.length} guías`);
  await client.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
