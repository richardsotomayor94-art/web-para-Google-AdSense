import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Trophy, Wallet } from "lucide-react";
import { FaqSection } from "@/components/article/faq-section";
import { AffiliateDisclosure } from "@/components/layout/affiliate-disclosure";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { ComparisonTable } from "@/components/product/comparison-table";
import { ProsCons } from "@/components/product/pros-cons";
import { JsonLd } from "@/components/seo/json-ld";
import { getComparisonPairs, resolveComparison } from "@/lib/data";
import { toComparable } from "@/lib/product-view";
import { faqJsonLd, graph, itemListJsonLd, productReviewJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import type { FaqItem, Product } from "@/lib/types";
import { formatPrice, shortName } from "@/lib/utils";

export async function generateStaticParams() {
  const pairs = await getComparisonPairs();
  return pairs.length ? pairs.map((p) => ({ slug: p.slug })) : [{ slug: "__placeholder__" }];
}

export async function generateMetadata({ params }: PageProps<"/comparar/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const match = await resolveComparison(slug);
  if (!match) return { title: "Comparativa no encontrada", robots: { index: false } };
  const a = shortName(match.a.title);
  const b = shortName(match.b.title);
  return pageMetadata({
    title: `${a} vs ${b}: ¿cuál es mejor? Comparativa 2026`,
    description: `Comparamos ${a} y ${b} en precio, especificaciones, pros y contras. Descubre cuál te conviene más según tu uso.`,
    path: `/comparar/${match.canonical}`,
  });
}

function buildVerdict(a: Product, b: Product) {
  const winner = (a.editorialRating ?? 0) >= (b.editorialRating ?? 0) ? a : b;
  const loser = winner === a ? b : a;
  const cheaper =
    a.priceCurrent != null && b.priceCurrent != null && a.priceCurrent !== b.priceCurrent
      ? a.priceCurrent < b.priceCurrent
        ? a
        : b
      : null;
  return { winner, loser, cheaper };
}

function buildFaqs(a: Product, b: Product, verdict: ReturnType<typeof buildVerdict>): FaqItem[] {
  const an = shortName(a.title);
  const bn = shortName(b.title);
  const faqs: FaqItem[] = [
    {
      question: `¿Qué es mejor, ${an} o ${bn}?`,
      answer: `En nuestras pruebas ${shortName(verdict.winner.title)} obtiene ${verdict.winner.editorialRating?.toFixed(1) ?? "—"}/10 frente a ${verdict.loser.editorialRating?.toFixed(1) ?? "—"}/10 de ${shortName(verdict.loser.title)}. ${verdict.winner.verdict ?? ""}`.trim(),
    },
  ];
  if (verdict.cheaper) {
    const other = verdict.cheaper === a ? b : a;
    faqs.push({
      question: `¿Cuál es más barato?`,
      answer: `${shortName(verdict.cheaper.title)} cuesta ${formatPrice(verdict.cheaper.priceCurrent, verdict.cheaper.currency)} frente a ${formatPrice(other.priceCurrent, other.currency)} de ${shortName(other.title)} (precio orientativo en Amazon.es).`,
    });
  }
  return faqs;
}

export default async function ComparisonPage({ params }: PageProps<"/comparar/[slug]">) {
  const { slug } = await params;
  const match = await resolveComparison(slug);
  if (!match) notFound();
  if (match.canonical !== slug) permanentRedirect(`/comparar/${match.canonical}`);

  const { a, b } = match;
  const an = shortName(a.title);
  const bn = shortName(b.title);
  const verdict = buildVerdict(a, b);
  const faqs = buildFaqs(a, b, verdict);
  const path = `/comparar/${match.canonical}`;

  return (
    <Container className="py-10">
      <JsonLd
        data={graph(
          itemListJsonLd(`${an} vs ${bn}`, [
            { name: a.title, path: `/resenas/${a.slug}` },
            { name: b.title, path: `/resenas/${b.slug}` },
          ]),
          productReviewJsonLd(a, `/resenas/${a.slug}`),
          productReviewJsonLd(b, `/resenas/${b.slug}`),
          faqJsonLd(faqs),
        )}
      />
      <Breadcrumbs
        items={[
          { name: "Comparativas", path: "/comparar" },
          { name: `${an} vs ${bn}`, path },
        ]}
      />
      <header className="mt-6 mb-8 max-w-3xl space-y-3">
        <h1 className="text-3xl type-heading text-ink sm:text-4xl">
          {an} vs {bn}: ¿cuál comprar?
        </h1>
        <p className="text-lg text-ink-3">
          Comparamos precio, especificaciones y nuestra experiencia de uso con ambos modelos de{" "}
          {a.categoryName?.toLowerCase() ?? "la categoría"}.
        </p>
        <AffiliateDisclosure />
      </header>

      <section aria-label="Veredicto rápido" className="mb-10 grid gap-4 sm:grid-cols-2">
        <div className="flex gap-3 rounded-xl border border-primary/40 bg-primary/5 p-5">
          <Trophy className="mt-0.5 size-6 shrink-0 text-primary" aria-hidden />
          <div>
            <p className="text-sm text-ink-3">Mejor en conjunto</p>
            <p className="font-semibold">
              <Link href={`/resenas/${verdict.winner.slug}`} className="hover:underline">
                {shortName(verdict.winner.title)}
              </Link>{" "}
              · {verdict.winner.editorialRating?.toFixed(1)}/10
            </p>
            {verdict.winner.verdict && <p className="mt-1 text-sm text-ink-3">{verdict.winner.verdict}</p>}
          </div>
        </div>
        {verdict.cheaper && (
          <div className="flex gap-3 rounded-xl border border-success/40 bg-success/5 p-5">
            <Wallet className="mt-0.5 size-6 shrink-0 text-success" aria-hidden />
            <div>
              <p className="text-sm text-ink-3">Opción más económica</p>
              <p className="font-semibold">
                <Link href={`/resenas/${verdict.cheaper.slug}`} className="hover:underline">
                  {shortName(verdict.cheaper.title)}
                </Link>{" "}
                · {formatPrice(verdict.cheaper.priceCurrent, verdict.cheaper.currency)}
              </p>
            </div>
          </div>
        )}
      </section>

      <ComparisonTable products={[toComparable(a), toComparable(b)]} />

      <section className="mt-14 grid gap-10 lg:grid-cols-2">
        {[a, b].map((p) => (
          <div key={p.id} className="space-y-4">
            <h2 className="text-xl font-bold">
              <Link href={`/resenas/${p.slug}`} className="hover:underline">
                {shortName(p.title)}
              </Link>
            </h2>
            <ProsCons pros={p.pros} cons={p.cons} />
          </div>
        ))}
      </section>

      <div className="max-w-3xl">
        <FaqSection faqs={faqs} />
      </div>
    </Container>
  );
}
