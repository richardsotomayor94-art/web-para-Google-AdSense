import { getAllProducts, getProductBySlug } from "@/lib/data";
import { ogContentType, ogSize, renderOg } from "@/lib/og/template";
import { siteConfig } from "@/lib/site";
import { formatPrice, shortName } from "@/lib/utils";

export const alt = `Análisis de producto ${siteConfig.name}`;
export const size = ogSize;
export const contentType = ogContentType;

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.length ? products.map((p) => ({ slug: p.slug })) : [{ slug: "__placeholder__" }];
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return renderOg({ eyebrow: "Reseñas", title: "Análisis de productos ergonómicos" });
  const footer = [
    product.editorialRating != null ? `Nota ${product.editorialRating.toFixed(1)}/10` : null,
    formatPrice(product.priceCurrent, product.currency),
  ]
    .filter(Boolean)
    .join(" · ");
  return renderOg({ eyebrow: `Reseña · ${product.categoryName ?? "Ergonomía"}`, title: shortName(product.title), footer });
}
