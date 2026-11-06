import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AD_SLOTS } from "@/components/ads/ad-slots";
import { AdSenseBanner } from "@/components/ads/adsense-banner";
import { ArticleBody } from "@/components/article/article-body";
import { AuthorBox, AuthorByline } from "@/components/article/author-box";
import { FaqSection } from "@/components/article/faq-section";
import { AffiliateDisclosure } from "@/components/layout/affiliate-disclosure";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { ProductCard } from "@/components/product/product-card";
import { JsonLd } from "@/components/seo/json-ld";
import { getArticleBySlug, getProductsByAsins, getProductsByIds, getPublishedArticles } from "@/lib/data";
import { extractAsins, extractToc } from "@/lib/markdown";
import { articleJsonLd, faqJsonLd, graph } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { defaultAuthor } from "@/lib/site";
import { formatDate, readingTimeMinutes } from "@/lib/utils";

export async function generateStaticParams() {
  const articles = await getPublishedArticles();
  // Cache Components exige al menos un parámetro en build.
  return articles.length ? articles.map((a) => ({ slug: a.slug })) : [{ slug: "__placeholder__" }];
}

export async function generateMetadata({ params }: PageProps<"/guias/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Guía no encontrada", robots: { index: false } };
  return pageMetadata({
    title: article.seoTitle ?? article.title,
    description: article.seoDescription ?? article.excerpt ?? "",
    path: `/guias/${article.slug}`,
    type: "article",
    images: article.featuredImage ? [article.featuredImage] : undefined,
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
    authors: [(article.author ?? defaultAuthor).name],
  });
}

export default async function GuidePage({ params }: PageProps<"/guias/[slug]">) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const [inlineProducts, related] = await Promise.all([
    getProductsByAsins(extractAsins(article.content)),
    getProductsByIds(article.relatedProductIds),
  ]);
  const toc = extractToc(article.content);
  const path = `/guias/${article.slug}`;
  const allProducts = [...new Map([...inlineProducts, ...related].map((p) => [p.id, p])).values()];

  return (
    <Container className="py-10">
      <JsonLd data={graph(articleJsonLd(article, path, allProducts), faqJsonLd(article.faqs))} />
      <Breadcrumbs
        items={[
          { name: "Guías", path: "/guias" },
          { name: article.title, path },
        ]}
      />

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px]">
        <article className="min-w-0">
          <header className="mb-8 space-y-4">
            <h1 className="text-3xl type-heading text-ink sm:text-4xl">{article.title}</h1>
            {article.excerpt && <p className="text-lg text-ink-3 text-pretty">{article.excerpt}</p>}
            <AuthorByline
              author={article.author}
              date={formatDate(article.publishedAt)}
              updated={formatDate(article.updatedAt)}
            />
            <p className="text-sm text-ink-3">{readingTimeMinutes(article.content)} min de lectura</p>
            {allProducts.length > 0 && <AffiliateDisclosure />}
          </header>

          <ArticleBody content={article.content} products={inlineProducts} />

          <FaqSection faqs={article.faqs} />

          {/* Anuncio final de artículo */}
          <AdSenseBanner slot={AD_SLOTS.display} />

          <AuthorBox author={article.author} />

          {related.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-6 type-heading text-2xl text-ink">Productos recomendados en esta guía</h2>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} placement="article_related" />
                ))}
              </div>
            </section>
          )}
        </article>

        {toc.length > 0 && (
          <aside className="hidden lg:block">
            <nav aria-label="Índice" className="sticky top-24 space-y-3 rounded-xl border p-4 text-sm">
              <p className="font-semibold">En esta guía</p>
              <ol className="space-y-2 text-ink-3">
                {toc.map((item) => (
                  <li key={item.id}>
                    <Link href={`#${item.id}`} className="hover:text-foreground">
                      {item.text}
                    </Link>
                  </li>
                ))}
                {article.faqs.length > 0 && (
                  <li>
                    <Link href="#faq" className="hover:text-foreground">
                      Preguntas frecuentes
                    </Link>
                  </li>
                )}
              </ol>
            </nav>
          </aside>
        )}
      </div>
    </Container>
  );
}
