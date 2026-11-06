import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { AffiliateDisclosure } from "@/components/layout/affiliate-disclosure";
import { ProductCard } from "@/components/product/product-card";
import { JsonLd } from "@/components/seo/json-ld";
import { getAllProducts, getCategories } from "@/lib/data";
import { graph, itemListJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Reseñas de sillas, escritorios elevables y accesorios ergonómicos",
  description:
    "Análisis independientes con nota, pros y contras de los productos ergonómicos más vendidos en Amazon. Probados durante semanas en teletrabajo real.",
  path: "/resenas",
});

export default async function ReviewsIndexPage() {
  const [categories, products] = await Promise.all([getCategories(), getAllProducts()]);
  const groups = categories
    .map((c) => ({ category: c, items: products.filter((p) => p.categoryId === c.id) }))
    .filter((g) => g.items.length);
  const uncategorized = products.filter((p) => !p.categoryId);

  return (
    <Container className="py-10">
      <JsonLd
        data={graph(itemListJsonLd(`Análisis ${siteConfig.name}`, products.map((p) => ({ name: p.title, path: `/resenas/${p.slug}` }))))}
      />
      <Breadcrumbs items={[{ name: "Reseñas", path: "/resenas" }]} />
      <header className="mt-6 mb-8 max-w-3xl space-y-3">
        <h1 className="text-4xl type-heading text-ink">Reseñas de productos ergonómicos</h1>
        <p className="text-lg text-ink-3">
          Cada producto pasa un mínimo de cuatro semanas en uso diario. Puntuamos ajustes, materiales, estabilidad y
          relación calidad-precio sobre 10.
        </p>
        <AffiliateDisclosure />
      </header>

      <nav aria-label="Categorías" className="mb-10 flex flex-wrap gap-2">
        {groups.map(({ category }) => (
          <a key={category.id} href={`#${category.slug}`} className="rounded-full border px-4 py-1.5 text-sm hover:bg-accent">
            {category.name}
          </a>
        ))}
      </nav>

      <div className="space-y-16">
        {groups.map(({ category, items }) => (
          <section key={category.id} id={category.slug} className="scroll-mt-24">
            <h2 className="type-heading text-2xl text-ink">{category.name}</h2>
            {category.description && <p className="mt-1 mb-6 text-ink-3">{category.description}</p>}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {items.map((p) => (
                <ProductCard key={p.id} product={p} placement="reviews_index" />
              ))}
            </div>
          </section>
        ))}
        {uncategorized.length > 0 && (
          <section>
            <h2 className="mb-6 type-heading text-2xl text-ink">Otros productos</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {uncategorized.map((p) => (
                <ProductCard key={p.id} product={p} placement="reviews_index" />
              ))}
            </div>
          </section>
        )}
      </div>
    </Container>
  );
}
