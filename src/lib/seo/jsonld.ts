/**
 * Generadores de datos estructurados schema.org (JSON-LD).
 * Pensados tanto para Google (rich results) como para motores generativos
 * (Perplexity, ChatGPT, Claude…) que priorizan entidades bien descritas.
 */
import { resolveAffiliateLinks } from "../amazon";
import { absoluteUrl, defaultAuthor, siteConfig } from "../site";
import type { Article, ArticleAuthor, ArticleSummary, FaqItem, Product } from "../types";

type Thing = Record<string, unknown>;

const ORG_ID = `${siteConfig.url}/#organization`;
const WEBSITE_ID = `${siteConfig.url}/#website`;

const logo = (): Thing => ({
  "@type": "ImageObject",
  "@id": `${siteConfig.url}/#logo`,
  url: absoluteUrl("/logo.png"),
  contentUrl: absoluteUrl("/logo.png"),
  width: 512,
  height: 512,
  caption: siteConfig.name,
});

/** Editor (publisher) completo e independiente: válido aunque el nodo Organization esté en otro bloque. */
export function publisherJsonLd(): Thing {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: logo(),
  };
}

export function organizationJsonLd(): Thing {
  return {
    ...publisherJsonLd(),
    alternateName: siteConfig.alternateName,
    slogan: siteConfig.tagline,
    description: siteConfig.description,
    email: siteConfig.email,
    image: { "@id": `${siteConfig.url}/#logo` },
    publishingPrinciples: absoluteUrl("/sobre-nosotros#metodologia"),
    knowsAbout: ["Ergonomía", "Teletrabajo", "Sillas ergonómicas", "Escritorios elevables", "Salud postural"],
    contactPoint: { "@type": "ContactPoint", contactType: "editorial", email: siteConfig.email, availableLanguage: ["es"] },
  };
}

export function websiteJsonLd(): Thing {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: siteConfig.language,
    alternateName: siteConfig.alternateName,
    description: siteConfig.description,
    publisher: publisherJsonLd(),
  };
}

export function personJsonLd(author: ArticleAuthor | null | undefined): Thing {
  const a = author ?? defaultAuthor;
  return {
    "@type": a.slug === defaultAuthor.slug ? "Organization" : "Person",
    name: a.name,
    ...(a.url && { url: a.url }),
    ...(a.role && { jobTitle: a.role }),
    ...(a.bio && { description: a.bio }),
    ...(a.avatar && { image: a.avatar }),
    ...(a.sameAs?.length && { sameAs: a.sameAs }),
    ...(a.credentials?.length && {
      hasCredential: a.credentials.map((c) => ({ "@type": "EducationalOccupationalCredential", name: c })),
    }),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): Thing {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function productOfferJsonLd(product: Product): Thing | undefined {
  if (product.priceCurrent == null) return undefined;
  const links = resolveAffiliateLinks(product);
  return {
    "@type": "Offer",
    url: links.es,
    price: product.priceCurrent.toFixed(2),
    priceCurrency: product.currency,
    availability: product.isAvailable ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    itemCondition: "https://schema.org/NewCondition",
    seller: { "@type": "Organization", name: "Amazon.es" },
  };
}

/**
 * Product + Review editorial. No se emite `aggregateRating` con las
 * valoraciones de Amazon: las directrices de Google exigen que procedan del
 * propio sitio. Usamos nuestra nota editorial (0–10) como `reviewRating`.
 */
export function productReviewJsonLd(product: Product, path: string): Thing {
  const offer = productOfferJsonLd(product);
  const images = [product.imageUrl, ...product.galleryImages].filter(Boolean).map((src) => absoluteUrl(src!));
  return {
    "@type": "Product",
    "@id": `${absoluteUrl(path)}#product`,
    name: product.title,
    sku: product.asin,
    productID: `asin:${product.asin}`,
    ...(product.brand && { brand: { "@type": "Brand", name: product.brand } }),
    ...(images.length && { image: images }),
    description: product.verdict ?? product.title,
    ...(product.categoryName && { category: product.categoryName }),
    ...(offer && { offers: offer }),
    ...(product.editorialRating != null && {
      review: {
        "@type": "Review",
        name: `Análisis de ${product.title}`,
        url: absoluteUrl(path),
        datePublished: product.createdAt,
        dateModified: product.updatedAt,
        author: personJsonLd(defaultAuthor),
        publisher: publisherJsonLd(),
        reviewBody: product.verdict ?? undefined,
        itemReviewed: { "@id": `${absoluteUrl(path)}#product` },
        reviewRating: {
          "@type": "Rating",
          ratingValue: product.editorialRating,
          bestRating: 10,
          worstRating: 0,
        },
        ...(product.pros.length && {
          positiveNotes: {
            "@type": "ItemList",
            itemListElement: product.pros.map((name, i) => ({ "@type": "ListItem", position: i + 1, name })),
          },
        }),
        ...(product.cons.length && {
          negativeNotes: {
            "@type": "ItemList",
            itemListElement: product.cons.map((name, i) => ({ "@type": "ListItem", position: i + 1, name })),
          },
        }),
      },
    }),
  };
}

export function articleJsonLd(article: Article, path: string, products: Product[] = []): Thing {
  return {
    "@type": "TechArticle",
    "@id": `${absoluteUrl(path)}#article`,
    headline: article.seoTitle ?? article.title,
    name: article.title,
    description: article.seoDescription ?? article.excerpt ?? undefined,
    inLanguage: siteConfig.language,
    url: absoluteUrl(path),
    mainEntityOfPage: absoluteUrl(path),
    image: absoluteUrl(article.featuredImage ?? `${path}/opengraph-image`),
    datePublished: article.publishedAt ?? article.createdAt,
    dateModified: article.updatedAt,
    author: personJsonLd(article.author),
    publisher: publisherJsonLd(),
    isPartOf: { "@id": WEBSITE_ID },
    ...(products.length && {
      mentions: products.map((p) => ({ "@type": "Product", name: p.title, url: absoluteUrl(`/resenas/${p.slug}`) })),
    }),
  };
}

export function faqJsonLd(faqs: FaqItem[]): Thing | undefined {
  if (!faqs.length) return undefined;
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function itemListJsonLd(name: string, items: { name: string; path: string }[]): Thing {
  return {
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}

export function articleListJsonLd(articles: ArticleSummary[]): Thing {
  return itemListJsonLd(
    "Guías de ergonomía",
    articles.map((a) => ({ name: a.title, path: `/guias/${a.slug}` })),
  );
}

/** Combina varios nodos en un único `@graph`. */
export function graph(...nodes: (Thing | undefined | null | false)[]): Thing {
  return { "@context": "https://schema.org", "@graph": nodes.filter(Boolean) };
}
