import type { Metadata } from "next";
import { ArticleCard } from "@/components/article/article-card";
import { AD_SLOTS } from "@/components/ads/ad-slots";
import { AdSenseBanner } from "@/components/ads/adsense-banner";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/seo/json-ld";
import { getPublishedArticles } from "@/lib/data";
import { articleListJsonLd, graph } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Guías de ergonomía y salud en el teletrabajo",
  description:
    "Guías prácticas revisadas por fisioterapeutas: cómo configurar tu puesto, prevenir el dolor de espalda, cuello y muñecas, y elegir el mejor equipamiento.",
  path: "/guias",
});

export default async function GuidesIndexPage() {
  const articles = await getPublishedArticles();
  return (
    <Container className="py-10">
      <JsonLd data={graph(articleListJsonLd(articles))} />
      <Breadcrumbs items={[{ name: "Guías", path: "/guias" }]} />
      <header className="mt-6 mb-10 max-w-3xl space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight">Guías de ergonomía</h1>
        <p className="text-lg text-muted-foreground">
          Soluciones prácticas a los problemas reales del teletrabajo: dolor lumbar, cervicales, muñecas y fatiga visual.
          Cada guía cita medidas concretas y está revisada por profesionales sanitarios.
        </p>
      </header>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
      <AdSenseBanner slot={AD_SLOTS.display} className="mt-12" />
    </Container>
  );
}
