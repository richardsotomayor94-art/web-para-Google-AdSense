import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import type { ArticleAuthor, FaqItem, ProductFeatures } from "@/lib/types";

/* ──────────────────────────────────────────────────────────────
 * Enums
 * ────────────────────────────────────────────────────────────── */

export const articleStatus = pgEnum("article_status", ["draft", "published"]);
export const automationSource = pgEnum("automation_source", [
  "products_sync",
  "articles_publish",
  "analytics_export",
]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
};

/* ──────────────────────────────────────────────────────────────
 * Category (silos de nicho, admite subcategorías)
 * ────────────────────────────────────────────────────────────── */

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 120 }).notNull(),
    slug: varchar("slug", { length: 140 }).notNull(),
    description: text("description"),
    icon: varchar("icon", { length: 60 }),
    parentId: uuid("parent_id").references((): AnyPgColumn => categories.id, {
      onDelete: "set null",
    }),
    ...timestamps,
  },
  (t) => [uniqueIndex("categories_slug_idx").on(t.slug), index("categories_parent_idx").on(t.parentId)],
);

/* ──────────────────────────────────────────────────────────────
 * Product (ficha Amazon + reseña editorial)
 * ────────────────────────────────────────────────────────────── */

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    asin: varchar("asin", { length: 10 }).notNull(),
    title: text("title").notNull(),
    slug: varchar("slug", { length: 200 }).notNull(),
    brand: varchar("brand", { length: 120 }),
    /** Reseña editorial en Markdown. */
    description: text("description"),
    /** Veredicto corto mostrado en el primer pliegue. */
    verdict: text("verdict"),
    /** Especificaciones clave → { "Altura": "72–121 cm", ... } */
    features: jsonb("features").$type<ProductFeatures>().default({}).notNull(),
    pros: text("pros").array().default(sql`'{}'::text[]`).notNull(),
    cons: text("cons").array().default(sql`'{}'::text[]`).notNull(),

    priceCurrent: numeric("price_current", { precision: 10, scale: 2, mode: "number" }),
    priceOriginal: numeric("price_original", { precision: 10, scale: 2, mode: "number" }),
    currency: varchar("currency", { length: 3 }).default("EUR").notNull(),
    discountPercent: integer("discount_percent"),

    amazonUrlEs: text("amazon_url_es"),
    amazonUrlUs: text("amazon_url_us"),
    imageUrl: text("image_url"),
    galleryImages: text("gallery_images").array().default(sql`'{}'::text[]`).notNull(),

    categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
    /** Valoración media en Amazon (0–5). Solo visual: no se usa como aggregateRating. */
    rating: numeric("rating", { precision: 2, scale: 1, mode: "number" }),
    reviewCount: integer("review_count").default(0).notNull(),
    /** Nota editorial propia (0–10). Es la que alimenta el JSON-LD Review. */
    editorialRating: numeric("editorial_rating", { precision: 3, scale: 1, mode: "number" }),
    /** Distintivo visual: "Mejor Calidad-Precio", "Top Ventas"… */
    badge: varchar("badge", { length: 60 }),
    isFeatured: boolean("is_featured").default(false).notNull(),
    isAvailable: boolean("is_available").default(true).notNull(),
    priceCheckedAt: timestamp("price_checked_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("products_asin_idx").on(t.asin),
    uniqueIndex("products_slug_idx").on(t.slug),
    index("products_category_idx").on(t.categoryId),
    index("products_featured_idx").on(t.isFeatured),
  ],
);

/* ──────────────────────────────────────────────────────────────
 * Article (guías informativas con E-E-A-T)
 * ────────────────────────────────────────────────────────────── */

export const articles = pgTable(
  "articles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    slug: varchar("slug", { length: 200 }).notNull(),
    /** Markdown (GFM). Admite el shortcode {{product:ASIN}} para insertar fichas. */
    content: text("content").notNull(),
    excerpt: text("excerpt"),
    author: jsonb("author").$type<ArticleAuthor>(),
    featuredImage: text("featured_image"),
    categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
    faqs: jsonb("faqs").$type<FaqItem[]>().default([]).notNull(),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    status: articleStatus("status").default("draft").notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("articles_slug_idx").on(t.slug),
    index("articles_status_idx").on(t.status, t.publishedAt),
  ],
);

/** Relación M:N Article ⇄ Product */
export const articleProducts = pgTable(
  "article_products",
  {
    articleId: uuid("article_id")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    position: integer("position").default(0).notNull(),
  },
  (t) => [primaryKey({ columns: [t.articleId, t.productId] }), index("article_products_product_idx").on(t.productId)],
);

/* ──────────────────────────────────────────────────────────────
 * ClickAnalytics (clics salientes hacia Amazon)
 * ────────────────────────────────────────────────────────────── */

export const clickAnalytics = pgTable(
  "click_analytics",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),
    asin: varchar("asin", { length: 10 }),
    userCountry: varchar("user_country", { length: 2 }),
    marketplace: varchar("marketplace", { length: 2 }),
    referrer: text("referrer"),
    pagePath: text("page_path"),
    placement: varchar("placement", { length: 40 }),
    timestamp: timestamp("timestamp", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("click_analytics_product_idx").on(t.productId),
    index("click_analytics_timestamp_idx").on(t.timestamp),
  ],
);

/* ──────────────────────────────────────────────────────────────
 * AutomationLog (auditoría de webhooks n8n / Make)
 * ────────────────────────────────────────────────────────────── */

export const automationLogs = pgTable(
  "automation_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    source: automationSource("source").notNull(),
    status: varchar("status", { length: 20 }).notNull(),
    itemsReceived: integer("items_received").default(0).notNull(),
    itemsCreated: integer("items_created").default(0).notNull(),
    itemsUpdated: integer("items_updated").default(0).notNull(),
    errors: jsonb("errors").$type<string[]>().default([]).notNull(),
    durationMs: integer("duration_ms"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("automation_logs_created_idx").on(t.createdAt)],
);

/* ──────────────────────────────────────────────────────────────
 * Relaciones
 * ────────────────────────────────────────────────────────────── */

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, { fields: [categories.parentId], references: [categories.id], relationName: "subcategories" }),
  children: many(categories, { relationName: "subcategories" }),
  products: many(products),
  articles: many(articles),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
  articles: many(articleProducts),
  clicks: many(clickAnalytics),
}));

export const articlesRelations = relations(articles, ({ one, many }) => ({
  category: one(categories, { fields: [articles.categoryId], references: [categories.id] }),
  products: many(articleProducts),
}));

export const articleProductsRelations = relations(articleProducts, ({ one }) => ({
  article: one(articles, { fields: [articleProducts.articleId], references: [articles.id] }),
  product: one(products, { fields: [articleProducts.productId], references: [products.id] }),
}));

export const clickAnalyticsRelations = relations(clickAnalytics, ({ one }) => ({
  product: one(products, { fields: [clickAnalytics.productId], references: [products.id] }),
}));

export type ProductRow = typeof products.$inferSelect;
export type NewProductRow = typeof products.$inferInsert;
export type CategoryRow = typeof categories.$inferSelect;
export type ArticleRow = typeof articles.$inferSelect;
