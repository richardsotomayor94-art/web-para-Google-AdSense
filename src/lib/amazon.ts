import type { Marketplace } from "./types";

/** Nombre de la cookie que fija `proxy.ts` con el país del visitante (ISO-3166 alfa-2). */
export const COUNTRY_COOKIE = "eh_country";

/**
 * Países que se envían a Amazon.es. El resto del mundo hispanohablante
 * (LATAM, EE. UU.) va a Amazon.com, que envía internacionalmente.
 */
const ES_MARKETPLACE_COUNTRIES = new Set(["ES", "PT", "AD", "GI"]);

export function marketplaceForCountry(country: string | null | undefined): Marketplace {
  if (!country) return "es";
  return ES_MARKETPLACE_COUNTRIES.has(country.toUpperCase()) ? "es" : "us";
}

const DOMAINS: Record<Marketplace, string> = {
  es: "www.amazon.es",
  us: "www.amazon.com",
};

export const ASIN_REGEX = /^[A-Z0-9]{10}$/;

/** Construye un enlace de afiliado limpio `https://www.amazon.es/dp/ASIN?tag=TAG`. */
export function buildAffiliateUrl(asin: string, marketplace: Marketplace, tag?: string | null): string {
  const url = new URL(`https://${DOMAINS[marketplace]}/dp/${asin.toUpperCase()}`);
  const resolvedTag =
    tag ?? (marketplace === "es" ? process.env.AMAZON_AFFILIATE_TAG_ES : process.env.AMAZON_AFFILIATE_TAG_US);
  if (resolvedTag) url.searchParams.set("tag", resolvedTag);
  return url.toString();
}

/**
 * Garantiza que una URL de Amazon lleva el tag correcto (útil cuando n8n envía
 * la URL "cruda" del producto).
 */
export function ensureAffiliateTag(rawUrl: string, marketplace: Marketplace): string {
  try {
    const url = new URL(rawUrl);
    if (!/(^|\.)amazon\.(es|com)$/.test(url.hostname)) return rawUrl;
    const tag = marketplace === "es" ? process.env.AMAZON_AFFILIATE_TAG_ES : process.env.AMAZON_AFFILIATE_TAG_US;
    if (tag) url.searchParams.set("tag", tag);
    return url.toString();
  } catch {
    return rawUrl;
  }
}

export interface AffiliateLinks {
  es: string;
  us: string;
}

export function resolveAffiliateLinks(product: {
  asin: string;
  amazonUrlEs: string | null;
  amazonUrlUs: string | null;
}): AffiliateLinks {
  return {
    es: product.amazonUrlEs ?? buildAffiliateUrl(product.asin, "es"),
    us: product.amazonUrlUs ?? buildAffiliateUrl(product.asin, "us"),
  };
}

/** Atributos obligatorios para cualquier enlace de afiliado. */
export const AFFILIATE_REL = "sponsored nofollow noopener";
