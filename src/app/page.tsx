import Link from "next/link";
import { categoryIcon, IconAngle, IconChair, IconScore, IconShortlist, IconTimer } from "@/components/brand/lab-icons";
import { Container } from "@/components/layout/container";
import { ProductCard, ProductFeatured } from "@/components/product/product-card";
import { JsonLd } from "@/components/seo/json-ld";
import { AnthropometricLab } from "@/components/tools/anthropometric-lab";
import { Button } from "@/components/ui/button";
import { getAllProducts, getCategories, getComparisonPairs, getPublishedArticles } from "@/lib/data";
import { graph, itemListJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/site";
import { formatDate, shortName } from "@/lib/utils";

const proofs = [
  { icon: IconTimer, text: "Cuatro semanas de uso real por producto" },
  { icon: IconAngle, text: "Guías revisadas por una fisioterapeuta colegiada" },
  { icon: IconScore, text: "Ninguna marca paga por aparecer ni ve la nota antes" },
];

const protocol = [
  { icon: IconShortlist, title: "Selección", text: "Partimos de los modelos más vendidos y mejor valorados de cada categoría." },
  { icon: IconTimer, title: "Cuatro semanas de uso", text: "Jornadas completas de teletrabajo, no una tarde de pruebas en una oficina." },
  { icon: IconAngle, title: "Medición", text: "Rangos de ajuste, estabilidad, ruido y materiales, con los mismos criterios para todos." },
  { icon: IconScore, title: "Nota sobre 10", text: "Ergonomía 40 %, calidad 30 %, precio 20 % y garantía 10 %." },
];

export default async function HomePage() {
  const [categories, products, articles, pairs] = await Promise.all([
    getCategories(),
    getAllProducts(),
    getPublishedArticles(),
    getComparisonPairs(),
  ]);
  const ranked = [...products].sort((a, b) => (b.editorialRating ?? 0) - (a.editorialRating ?? 0));
  const [top, ...rest] = ranked;
  const countByCategory = new Map<string, number>();
  for (const p of products) if (p.categoryId) countByCategory.set(p.categoryId, (countByCategory.get(p.categoryId) ?? 0) + 1);

  return (
    <>
      <JsonLd
        data={graph(
          itemListJsonLd(
            "Productos mejor valorados por el laboratorio",
            ranked.slice(0, 4).map((p) => ({ name: p.title, path: `/resenas/${p.slug}` })),
          ),
        )}
      />

      {/* ── Hero: tesis + diagrama antropométrico (efecto firma) ── */}
      <section className="border-b border-rule">
        <Container className="grid items-center gap-10 py-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:gap-14 lg:py-20">
          <div>
            <p className="mb-5 text-sm font-medium text-ink-3">{siteConfig.tagline}</p>
            <h1 className="type-display text-[2.6rem] text-ink sm:text-6xl lg:text-[4.1rem]">Ergonomía medida, no opinada.</h1>
            <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-ink-2 text-pretty">
              Si te duele la espalda al acabar la jornada, casi siempre es cuestión de centímetros. Probamos sillas,
              escritorios y accesorios durante cuatro semanas en puestos reales y te damos su nota, sus defectos y las
              medidas exactas para tu cuerpo.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full">
                <Link href="/guias/puesto-teletrabajo-ergonomico">Ajusta tu puesto en 5 pasos</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link href="/resenas">Ver los análisis</Link>
              </Button>
            </div>
            <ul className="mt-10 space-y-3 border-t border-rule pt-6">
              {proofs.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-[0.9375rem] text-ink-2">
                  <Icon className="size-6 text-ink" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
          <AnthropometricLab />
        </Container>
      </section>

      {/* ── Protocolo de ensayo (secuencia real: va numerada) ── */}
      <section aria-labelledby="protocolo" className="reveal">
        <Container className="py-16 md:py-20">
          <div className="max-w-2xl">
            <h2 id="protocolo" className="type-heading text-3xl text-ink sm:text-4xl">
              Así se gana un producto su nota
            </h2>
            <p className="mt-3 text-ink-2">
              El mismo protocolo para todos. Si algo cojea a la segunda semana, lo vas a leer en la reseña.
            </p>
          </div>
          <ol className="relative mt-12 grid gap-10 md:grid-cols-4 md:gap-6">
            {/* Línea de proceso con marcas de cota */}
            <li aria-hidden className="pointer-events-none absolute top-[15px] right-0 left-0 hidden md:block">
              <div className="ruler" />
            </li>
            {protocol.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="relative">
                <div className="flex items-center gap-3">
                  <span className="relative z-10 grid size-8 place-items-center rounded-full bg-ink text-sm font-bold text-paper type-figure">
                    {i + 1}
                  </span>
                  <Icon className="size-7 bg-background text-ink" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-ink">{title}</h3>
                <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-2">{text}</p>
              </li>
            ))}
          </ol>
          <Link
            href="/sobre-nosotros#metodologia"
            className="mt-10 inline-block text-sm font-medium text-measure underline decoration-measure/40 underline-offset-4 hover:decoration-measure"
          >
            Leer la metodología completa
          </Link>
        </Container>
      </section>

      {/* ── Mejor medidos ── */}
      {top && (
        <section aria-labelledby="mejor-nota" className="border-y border-rule bg-paper-2/60">
          <Container className="py-16 md:py-20">
            <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 id="mejor-nota" className="type-heading text-3xl text-ink sm:text-4xl">
                  Lo que mejor ha salido en las pruebas
                </h2>
                <p className="mt-3 text-ink-2">Ordenado por nota del laboratorio, no por comisión.</p>
              </div>
              <Link href="/resenas" className="text-sm font-medium text-measure underline decoration-measure/40 underline-offset-4 hover:decoration-measure">
                Todos los análisis
              </Link>
            </div>
            <ProductFeatured product={top} placement="home_top" />
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.slice(0, 3).map((p) => (
                <ProductCard key={p.id} product={p} placement="home_featured" />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ── Índice de categorías ── */}
      <section aria-labelledby="que-medimos" className="reveal">
        <Container className="grid gap-10 py-16 md:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <div>
            <h2 id="que-medimos" className="type-heading text-3xl text-ink sm:text-4xl">
              Qué medimos
            </h2>
            <p className="mt-3 max-w-sm text-ink-2">
              Cinco piezas deciden cómo acaba tu cuerpo un viernes por la tarde. Las analizamos por separado.
            </p>
          </div>
          <ul className="divide-y divide-rule border-y border-rule">
            {categories.map((c) => {
              const Icon = categoryIcon[c.icon ?? ""] ?? IconChair;
              const count = countByCategory.get(c.id) ?? 0;
              return (
                <li key={c.id}>
                  <Link href={`/resenas#${c.slug}`} className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 py-5">
                    <Icon className="size-9 text-ink" />
                    <span>
                      <span className="block text-lg font-semibold text-ink group-hover:text-measure">{c.name}</span>
                      {c.description && <span className="mt-0.5 block text-sm text-ink-3">{c.description}</span>}
                    </span>
                    <span className="type-figure text-right text-sm text-ink-2">
                      {count} análisis
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* ── Guías y comparativas ── */}
      <section className="reveal border-t border-rule">
        <Container className="grid gap-14 py-16 md:py-20 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div>
            <h2 className="type-heading text-3xl text-ink sm:text-4xl">Guías para ajustar tu puesto</h2>
            <ul className="mt-8 divide-y divide-rule border-y border-rule">
              {articles.slice(0, 5).map((a) => (
                <li key={a.id}>
                  <Link href={`/guias/${a.slug}`} className="group block py-5">
                    <span className="block text-lg font-semibold leading-snug text-ink group-hover:text-measure">{a.title}</span>
                    {a.excerpt && <span className="mt-1 line-clamp-2 block text-[0.9375rem] text-ink-2">{a.excerpt}</span>}
                    {a.publishedAt && (
                      <time dateTime={a.publishedAt} className="mt-2 block text-xs text-ink-3">
                        {formatDate(a.publishedAt)}
                      </time>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/guias" className="mt-6 inline-block text-sm font-medium text-measure underline decoration-measure/40 underline-offset-4 hover:decoration-measure">
              Todas las guías
            </Link>
          </div>
          <aside aria-labelledby="comparativas">
            <h2 id="comparativas" className="type-heading text-2xl text-ink">
              Cara a cara
            </h2>
            <p className="mt-2 text-sm text-ink-2">Dos modelos, las mismas pruebas y un ganador claro.</p>
            <ul className="mt-6 space-y-3">
              {pairs.slice(0, 5).map((pair) => (
                <li key={pair.slug}>
                  <Link href={`/comparar/${pair.slug}`} className="test-sheet group block p-4 hover:border-ink">
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="font-semibold text-ink group-hover:text-measure">{shortName(pair.a.title)}</span>
                      <span className="type-figure text-sm text-ink-2">{pair.a.editorialRating?.toFixed(1)}</span>
                    </span>
                    <span className="my-1 block text-xs text-ink-3">frente a</span>
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="font-semibold text-ink group-hover:text-measure">{shortName(pair.b.title)}</span>
                      <span className="type-figure text-sm text-ink-2">{pair.b.editorialRating?.toFixed(1)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/comparar" className="mt-6 inline-block text-sm font-medium text-measure underline decoration-measure/40 underline-offset-4 hover:decoration-measure">
              Todas las comparativas
            </Link>
          </aside>
        </Container>
      </section>
    </>
  );
}
