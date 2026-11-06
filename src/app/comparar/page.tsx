import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/seo/json-ld";
import { getCategories, getComparisonPairs } from "@/lib/data";
import { graph, itemListJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site";
import { shortName } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Comparativas de productos ergonómicos: A vs B",
  description:
    "Enfrentamos cara a cara las sillas, escritorios elevables y accesorios más populares para que elijas el que mejor encaja contigo.",
  path: "/comparar",
});

export default async function ComparisonsIndexPage() {
  const [pairs, categories] = await Promise.all([getComparisonPairs(), getCategories()]);
  const groups = categories
    .map((c) => ({ category: c, items: pairs.filter((p) => p.a.categoryId === c.id) }))
    .filter((g) => g.items.length);

  return (
    <Container className="py-10">
      <JsonLd
        data={graph(
          itemListJsonLd(
            `Comparativas ${siteConfig.name}`,
            pairs.map((p) => ({ name: `${shortName(p.a.title)} vs ${shortName(p.b.title)}`, path: `/comparar/${p.slug}` })),
          ),
        )}
      />
      <Breadcrumbs items={[{ name: "Comparativas", path: "/comparar" }]} />
      <header className="mt-6 mb-10 max-w-3xl space-y-3">
        <h1 className="text-4xl type-heading text-ink">Comparativas cara a cara</h1>
        <p className="text-lg text-ink-3">
          ¿Dudas entre dos modelos? Comparamos especificaciones, nota editorial y precio para darte un ganador claro.
        </p>
      </header>
      <div className="space-y-12">
        {groups.map(({ category, items }) => (
          <section key={category.id}>
            <h2 className="type-heading mb-4 text-xl text-ink">{category.name}</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {items.map((pair) => (
                <li key={pair.slug}>
                  <Link
                    href={`/comparar/${pair.slug}`}
                    className="flex items-center justify-between gap-3 rounded-xl border bg-card p-4 hover:border-primary"
                  >
                    <span className="font-medium">
                      {shortName(pair.a.title)} <span className="text-ink-3">vs</span> {shortName(pair.b.title)}
                    </span>
                    <ArrowRight className="size-4 shrink-0 text-ink-3" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Container>
  );
}
