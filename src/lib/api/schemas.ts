import { z } from "zod";

const asin = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z0-9]{10}$/, "ASIN inválido (10 caracteres alfanuméricos)");

const price = z.coerce.number().nonnegative().max(1_000_000);
const url = z.string().trim().url();

/** Un producto tal y como lo envía n8n / Make. Solo `asin` es obligatorio para actualizar. */
export const productInputSchema = z.object({
  asin,
  title: z.string().trim().min(3).max(500).optional(),
  slug: z.string().trim().min(3).max(200).regex(/^[a-z0-9-]+$/).optional(),
  brand: z.string().trim().max(120).nullish(),
  description: z.string().max(100_000).nullish(),
  verdict: z.string().max(2000).nullish(),
  features: z.record(z.string(), z.coerce.string()).optional(),
  pros: z.array(z.string().trim().min(1)).max(20).optional(),
  cons: z.array(z.string().trim().min(1)).max(20).optional(),
  price_current: price.nullish(),
  price_original: price.nullish(),
  currency: z.string().length(3).toUpperCase().optional(),
  discount_percent: z.coerce.number().int().min(0).max(100).nullish(),
  amazon_url_es: url.nullish(),
  amazon_url_us: url.nullish(),
  image_url: url.nullish(),
  gallery_images: z.array(url).max(20).optional(),
  category_slug: z.string().trim().max(140).optional(),
  category_name: z.string().trim().max(120).optional(),
  rating: z.coerce.number().min(0).max(5).nullish(),
  review_count: z.coerce.number().int().nonnegative().optional(),
  editorial_rating: z.coerce.number().min(0).max(10).nullish(),
  badge: z.string().trim().max(60).nullish(),
  is_featured: z.boolean().optional(),
  is_available: z.boolean().optional(),
});

export const productsSyncSchema = z.object({
  products: z.array(productInputSchema).min(1).max(500),
});

export type ProductInput = z.infer<typeof productInputSchema>;

const authorSchema = z.object({
  name: z.string().trim().min(2),
  slug: z.string().optional(),
  role: z.string().optional(),
  bio: z.string().optional(),
  avatar: url.optional(),
  url: url.optional(),
  sameAs: z.array(url).optional(),
  credentials: z.array(z.string()).optional(),
});

export const articlePublishSchema = z.object({
  title: z.string().trim().min(5).max(300),
  slug: z.string().trim().min(3).max(200).regex(/^[a-z0-9-]+$/).optional(),
  /** Markdown (GFM). Usa {{product:ASIN}} para insertar fichas de producto. */
  content: z.string().min(50).max(500_000),
  excerpt: z.string().max(1000).nullish(),
  author: authorSchema.nullish(),
  featured_image: url.nullish(),
  category_slug: z.string().optional(),
  faqs: z.array(z.object({ question: z.string().min(3), answer: z.string().min(3) })).max(30).optional(),
  seo_title: z.string().max(120).nullish(),
  seo_description: z.string().max(320).nullish(),
  status: z.enum(["draft", "published"]).default("published"),
  published_at: z.coerce.date().optional(),
  /** ASIN a asociar explícitamente (además de los detectados en el contenido). */
  related_asins: z.array(asin).max(50).optional(),
  /** Si es true (por defecto), detecta ASIN y nombres de producto en el texto para asociarlos. */
  auto_link_products: z.boolean().default(true),
});

export type ArticlePublishInput = z.infer<typeof articlePublishSchema>;
