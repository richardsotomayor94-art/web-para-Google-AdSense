import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { AD_SLOTS } from "@/components/ads/ad-slots";
import { AdSenseBanner } from "@/components/ads/adsense-banner";
import { ArticleCard } from "@/components/article/article-card";
import { AuthorByline } from "@/components/article/author-box";
import { Markdown } from "@/components/article/markdown";
import { AffiliateDisclosure } from "@/components/layout/affiliate-disclosure";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { AffiliateButton } from "@/components/product/affiliate-button";
import { PriceTag } from "@/components/product/price-tag";
import { ProductBadge } from "@/components/product/product-badge";
import { ProductCard } from "@/components/product/product-card";
import { ProductImage } from "@/components/product/product-image";
import { ProsCons } from "@/components/product/pros-cons";
import { EditorialScore, RatingStars } from "@/components/product/rating-stars";
import { SpecsTable } from "@/components/product/specs-table";
import { JsonLd } from "@/components/seo/json-ld";
import { resolveAffiliateLinks } from "@/lib/amazon";
import {
  comparisonSlug,
  getAllProducts,
  getArticlesForProduct,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/data";
import { graph, productReviewJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { formatDate, shortName } from "@/lib/utils";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.length ? products.map((p) => ({ slug: p.slug })) : [{ slug: "__placeholder__" }];
}

export async function generateMetadata({ params }: PageProps<"/resenas/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Reseña no encontrada", robots: { index: false } };
  const name = shortName(product.title);
  return pageMetadata({
    title: `${name}: análisis, opiniones y precio`,
    description:
      product.verdict ??
      `Análisis completo de ${name}: pros, contras, especificaciones y dónde comprarlo al mejor precio.`,
    path: `/resenas/${product.slug}`,
    type: "article",
    modifiedTime: product.updatedAt,
  });
}

export default async function ReviewPage({ params }: PageProps<"/resenas/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, guides] = await Promise.all([getRelatedProducts(product, 3), getArticlesForProduct(product.id)]);
  const links = resolveAffiliateLinks(product);
  const path = `/resenas/${product.slug}`;
  const name = shortName(product.title);

  return (
    <Container className="py-10">
      <JsonLd data={graph(productReviewJsonLd(product, path))} />
      <Breadcrumbs
        items={[
          { name: "Reseñas", path: "/resenas" },
          ...(product.categoryName && product.categorySlug
            ? [{ name: product.categoryName, path: `/resenas#${product.categorySlug}` }]
            : []),
          { name, path },
        ]}
      />

      {/* ── Primer pliegue: SIN AdSense, foco total en el CTA de Amazon ── */}
      <section className="mt-6 grid gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="rounded-2xl border bg-white p-2">
          <ProductImage src={product.imageUrl} alt={product.title} priority sizes="(min-width: 768px) 40vw, 100vw" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <ProductBadge badge={product.badge} />
            {product.brand && <span className="text-sm text-muted-foreground">{product.brand}</span>}
          </div>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-balance">{product.title}</h1>
          <div className="flex flex-wrap items-center gap-4">
            <EditorialScore score={product.editorialRating} />
            <RatingStars rating={product.rating} count={product.reviewCount} />
          </div>
          {product.verdict && (
            <p className="rounded-xl border-l-4 border-primary bg-accent/50 p-4 text-base">
              <strong className="font-semibold">Veredicto: </strong>
              {product.verdict}
            </p>
          )}
          <PriceTag
            current={product.priceCurrent}
            original={product.priceOriginal}
            discount={product.discountPercent}
            currency={product.currency}
            size="lg"
          />
          <AffiliateButton product={product} links={links} placement="review_hero" size="xl" />
          <p className="text-xs text-muted-foreground">
            Precio orientativo en Amazon.es, actualizado el {formatDate(product.updatedAt)}. Puede variar.
          </p>
          <AffiliateDisclosure />
        </div>
      </section>

      <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-12">
          <section aria-labelledby="pros-cons">
            <h2 id="pros-cons" className="mb-4 text-2xl font-bold tracking-tight">
              Pros y contras
            </h2>
            <ProsCons pros={product.pros} cons={product.cons} />
          </section>

          <section aria-labelledby="specs">
            <h2 id="specs" className="mb-4 text-2xl font-bold tracking-tight">
              Especificaciones clave
            </h2>
            <SpecsTable features={product.features} />
          </section>

          {product.description && (
            <section aria-label="Análisis" className="space-y-4">
              <AuthorByline author={null} updated={formatDate(product.updatedAt)} />
              <div className="prose-eh">
                <Markdown>{product.description}</Markdown>
              </div>
            </section>
          )}

          {/* AdSense solo por debajo del pliegue, tras el contenido principal */}
          <AdSenseBanner slot={AD_SLOTS.display} />

          <section className="flex flex-col items-start gap-4 rounded-2xl border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold">{name}</p>
              <PriceTag
                current={product.priceCurrent}
                original={product.priceOriginal}
                discount={product.discountPercent}
                currency={product.currency}
              />
            </div>
            <AffiliateButton product={product} links={links} placement="review_bottom" />
          </section>
        </div>

        <aside className="space-y-8">
          {related.length > 0 && (
            <div className="rounded-xl border p-4">
              <p className="mb-3 font-semibold">Compáralo con</p>
              <ul className="space-y-2 text-sm">
                {related.map((r) => (
                  <li key={r.id}>
                    <Link
                      href={`/comparar/${comparisonSlug(product, r)}`}
                      className="flex items-center justify-between gap-2 rounded-md p-2 hover:bg-accent"
                    >
                      <span>
                        {name} <span className="text-muted-foreground">vs</span> {shortName(r.title)}
                      </span>
                      <ArrowRight className="size-4 shrink-0" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {guides.length > 0 && (
            <div className="space-y-3">
              <p className="font-semibold">Guías relacionadas</p>
              {guides.map((g) => (
                <ArticleCard key={g.id} article={g} />
              ))}
            </div>
          )}
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold tracking-tight">Alternativas a {name}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} placement="review_alternatives" />
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}
