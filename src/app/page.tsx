import Link from "next/link";
import { Armchair, ArrowRight, Footprints, FlaskConical, Monitor, Mouse, ShieldCheck, Stethoscope, Table2 } from "lucide-react";
import { ArticleCard } from "@/components/article/article-card";
import { Container } from "@/components/layout/container";
import { ProductCard } from "@/components/product/product-card";
import { JsonLd } from "@/components/seo/json-ld";
import { HeightCalculator } from "@/components/tools/height-calculator";
import { Button } from "@/components/ui/button";
import { getCategories, getComparisonPairs, getFeaturedProducts, getPublishedArticles } from "@/lib/data";
import { graph, itemListJsonLd } from "@/lib/seo/jsonld";
import { shortName } from "@/lib/utils";

const categoryIcons: Record<string, typeof Armchair> = {
  armchair: Armchair,
  table: Table2,
  monitor: Monitor,
  mouse: Mouse,
  footprints: Footprints,
};

const trust = [
  { icon: FlaskConical, title: "Probado semanas, no minutos", text: "Cada producto se usa en jornadas reales de teletrabajo antes de opinar." },
  { icon: Stethoscope, title: "Revisado por fisioterapeutas", text: "Las guías de salud las supervisa personal sanitario colegiado." },
  { icon: ShieldCheck, title: "Independiente", text: "Ninguna marca paga por aparecer ni revisa nuestros análisis." },
];

export default async function HomePage() {
  const [categories, featured, articles, pairs] = await Promise.all([
    getCategories(),
    getFeaturedProducts(4),
    getPublishedArticles(),
    getComparisonPairs(),
  ]);

  return (
    <>
      <JsonLd
        data={graph(
          itemListJsonLd(
            "Productos ergonómicos destacados",
            featured.map((p) => ({ name: p.title, path: `/resenas/${p.slug}` })),
          ),
        )}
      />

      {/* Hero E-E-A-T */}
      <section className="border-b bg-gradient-to-b from-accent/60 to-background">
        <Container className="grid items-center gap-10 py-14 md:py-20 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="size-2 rounded-full bg-success" /> Actualizado en noviembre de 2026
            </p>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-balance sm:text-5xl">
              Teletrabaja <span className="text-primary">sin dolor</span>. Te decimos qué comprar y cómo ajustarlo.
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground text-pretty">
              Guías de ergonomía basadas en evidencia y reseñas independientes de sillas, escritorios elevables y
              accesorios, probados durante semanas por fisioterapeutas e ingenieros.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/guias/puesto-teletrabajo-ergonomico">
                  Configura tu puesto en 5 pasos <ArrowRight aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/resenas">Ver reseñas</Link>
              </Button>
            </div>
          </div>
          <HeightCalculator />
        </Container>
        <Container className="grid gap-4 pb-12 sm:grid-cols-3">
          {trust.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-3 rounded-xl border bg-background/70 p-4">
              <Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-muted-foreground">{text}</p>
              </div>
            </div>
          ))}
        </Container>
      </section>

      {/* Categorías */}
      <Container className="py-14">
        <h2 className="mb-6 text-2xl font-bold tracking-tight">Explora por categoría</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((c) => {
            const Icon = categoryIcons[c.icon ?? ""] ?? Armchair;
            return (
              <Link
                key={c.id}
                href={`/resenas#${c.slug}`}
                className="group flex flex-col gap-3 rounded-xl border bg-card p-5 transition-colors hover:border-primary"
              >
                <Icon className="size-7 text-primary" aria-hidden />
                <span className="font-semibold group-hover:underline">{c.name}</span>
                {c.description && <span className="line-clamp-2 text-xs text-muted-foreground">{c.description}</span>}
              </Link>
            );
          })}
        </div>
      </Container>

      {/* Destacados */}
      <section className="border-y bg-muted/30">
        <Container className="py-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Nuestras recomendaciones</h2>
              <p className="text-muted-foreground">Los productos que mejor puntuaron en nuestras pruebas.</p>
            </div>
            <Link href="/resenas" className="hidden text-sm font-medium text-primary hover:underline sm:block">
              Ver todas →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} placement="home_featured" />
            ))}
          </div>
        </Container>
      </section>

      {/* Guías + comparativas */}
      <Container className="grid gap-12 py-14 lg:grid-cols-[2fr_1fr]">
        <section>
          <h2 className="mb-6 text-2xl font-bold tracking-tight">Guías de ergonomía</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {articles.slice(0, 4).map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
        <aside>
          <h2 className="mb-6 text-2xl font-bold tracking-tight">Comparativas</h2>
          <ul className="divide-y rounded-xl border bg-card">
            {pairs.slice(0, 6).map((pair) => (
              <li key={pair.slug}>
                <Link href={`/comparar/${pair.slug}`} className="flex items-center justify-between gap-3 p-4 text-sm hover:bg-accent">
                  <span>
                    <span className="font-medium">{shortName(pair.a.title)}</span>{" "}
                    <span className="text-muted-foreground">vs</span>{" "}
                    <span className="font-medium">{shortName(pair.b.title)}</span>
                    <span className="block text-xs text-muted-foreground">{pair.a.categoryName}</span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/comparar" className="mt-3 inline-block text-sm font-medium text-primary hover:underline">
            Todas las comparativas →
          </Link>
        </aside>
      </Container>
    </>
  );
}
