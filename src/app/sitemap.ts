import type { MetadataRoute } from "next";
import { getAllProducts, getComparisonPairs, getPublishedArticles } from "@/lib/data";
import { absoluteUrl } from "@/lib/site";

/** Sitemap dinámico: se regenera cuando los webhooks invalidan productos/artículos. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, articles, pairs] = await Promise.all([getAllProducts(), getPublishedArticles(), getComparisonPairs()]);
  const latest = (dates: string[]) => dates.sort().at(-1);

  const statics: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "daily", priority: 1, lastModified: latest(products.map((p) => p.updatedAt)) },
    { url: absoluteUrl("/guias"), changeFrequency: "daily", priority: 0.9, lastModified: latest(articles.map((a) => a.updatedAt)) },
    { url: absoluteUrl("/resenas"), changeFrequency: "daily", priority: 0.9, lastModified: latest(products.map((p) => p.updatedAt)) },
    { url: absoluteUrl("/comparar"), changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/sobre-nosotros"), changeFrequency: "yearly", priority: 0.4 },
    { url: absoluteUrl("/afiliacion"), changeFrequency: "yearly", priority: 0.2 },
  ];

  return [
    ...statics,
    ...articles.map((a) => ({
      url: absoluteUrl(`/guias/${a.slug}`),
      lastModified: a.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...products.map((p) => ({
      url: absoluteUrl(`/resenas/${p.slug}`),
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      ...(p.imageUrl?.startsWith("http") && { images: [p.imageUrl] }),
    })),
    ...pairs.map((pair) => ({
      url: absoluteUrl(`/comparar/${pair.slug}`),
      lastModified: latest([pair.a.updatedAt, pair.b.updatedAt]),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
