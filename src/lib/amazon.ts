/**
 * Helper de enlaces de Amazon Afiliados (sin PA-API).
 *
 * Recibe cualquier URL de producto de Amazon o un ASIN y devuelve un enlace
 * limpio con el tag de afiliado correcto, más los atributos obligatorios
 * (`rel="sponsored nofollow noopener"` y `target="_blank"`).
 *
 * Los tags se leen de `AMAZON_AFFILIATE_TAG_ES` / `AMAZON_AFFILIATE_TAG_US`
 * (solo servidor). Llama a estas funciones en Server Components, route
 * handlers o scripts y pasa el resultado a los componentes cliente.
 */
import type { Marketplace } from "./types";

/* ─────────────────────────── Configuración ─────────────────────────── */

/** Tags por defecto si no se definen las variables de entorno. */
export const DEFAULT_AFFILIATE_TAGS: Record<Marketplace, string> = {
  es: "ergotoplab-21",
  us: "ergotoplabus-20",
};

/** Atributos obligatorios para cualquier enlace de afiliado. */
export const AFFILIATE_REL = "sponsored nofollow noopener";
export const AFFILIATE_TARGET = "_blank";

/** Nombre de la cookie que fija `proxy.ts` con el país del visitante (ISO-3166 alfa-2). */
export const COUNTRY_COOKIE = "eh_country";

export const ASIN_REGEX = /^[A-Z0-9]{10}$/;

const DOMAINS: Record<Marketplace, string> = {
  es: "www.amazon.es",
  us: "www.amazon.com",
};

/** Tag de afiliado vigente para un marketplace (variable de entorno o valor por defecto). */
export function getAffiliateTag(marketplace: Marketplace): string {
  const fromEnv =
    marketplace === "es" ? process.env.AMAZON_AFFILIATE_TAG_ES : process.env.AMAZON_AFFILIATE_TAG_US;
  return fromEnv?.trim() || DEFAULT_AFFILIATE_TAGS[marketplace];
}

/* ─────────────────────────── Geotargeting ─────────────────────────── */

/**
 * Países que se envían a Amazon.es. El resto del mundo hispanohablante
 * (LATAM, EE. UU.) va a Amazon.com, que envía internacionalmente.
 */
const ES_MARKETPLACE_COUNTRIES = new Set(["ES", "PT", "AD", "GI"]);

export function marketplaceForCountry(country: string | null | undefined): Marketplace {
  if (!country) return "es";
  return ES_MARKETPLACE_COUNTRIES.has(country.toUpperCase()) ? "es" : "us";
}

/* ─────────────────────────── Análisis de URLs ─────────────────────────── */

/** Rutas habituales donde Amazon coloca el ASIN. */
const ASIN_PATH_PATTERNS = [
  /\/dp\/([A-Z0-9]{10})(?=[/?#]|$)/i,
  /\/gp\/product\/([A-Z0-9]{10})(?=[/?#]|$)/i,
  /\/gp\/aw\/d\/([A-Z0-9]{10})(?=[/?#]|$)/i,
  /\/exec\/obidos\/(?:ASIN|tg\/detail\/-)\/([A-Z0-9]{10})(?=[/?#]|$)/i,
  /\/o\/ASIN\/([A-Z0-9]{10})(?=[/?#]|$)/i,
  /\/product-reviews\/([A-Z0-9]{10})(?=[/?#]|$)/i,
];

function parseUrl(input: string): URL | null {
  try {
    return new URL(/^https?:\/\//i.test(input) ? input : `https://${input}`);
  } catch {
    return null;
  }
}

/** `true` para cualquier dominio de Amazon (amazon.es, amazon.com, amazon.com.mx, amzn.to…). */
export function isAmazonUrl(input: string): boolean {
  const url = parseUrl(input.trim());
  if (!url) return false;
  return /(^|\.)amazon\.[a-z.]{2,6}$/i.test(url.hostname) || /(^|\.)(amzn\.to|amzn\.eu|a\.co)$/i.test(url.hostname);
}

/** Marketplace de una URL de Amazon soportada (`es` | `us`) o `null`. */
export function detectMarketplace(input: string): Marketplace | null {
  const url = parseUrl(input.trim());
  if (!url) return null;
  if (/(^|\.)amazon\.es$/i.test(url.hostname)) return "es";
  if (/(^|\.)amazon\.com$/i.test(url.hostname)) return "us";
  return null;
}

/** Extrae el ASIN de un ASIN suelto o de una URL de producto de Amazon. */
export function extractAsin(input: string): string | null {
  const value = input.trim();
  if (ASIN_REGEX.test(value.toUpperCase()) && !value.includes("/")) return value.toUpperCase();
  const url = parseUrl(value);
  if (!url || !isAmazonUrl(value)) return null;
  for (const pattern of ASIN_PATH_PATTERNS) {
    const match = url.pathname.match(pattern);
    if (match) return match[1].toUpperCase();
  }
  const fromQuery = url.searchParams.get("asin") ?? url.searchParams.get("ASIN");
  return fromQuery && ASIN_REGEX.test(fromQuery.toUpperCase()) ? fromQuery.toUpperCase() : null;
}

/* ─────────────────────────── Formateador ─────────────────────────── */

/** Construye un enlace de afiliado limpio `https://www.amazon.es/dp/ASIN?tag=TAG`. */
export function buildAffiliateUrl(asin: string, marketplace: Marketplace, tag?: string | null): string {
  const url = new URL(`https://${DOMAINS[marketplace]}/dp/${asin.toUpperCase()}`);
  url.searchParams.set("tag", tag || getAffiliateTag(marketplace));
  return url.toString();
}

export interface AffiliateLink {
  href: string;
  rel: typeof AFFILIATE_REL;
  target: typeof AFFILIATE_TARGET;
  asin: string | null;
  marketplace: Marketplace;
}

/**
 * Formateador universal: acepta un ASIN o cualquier URL de Amazon y devuelve
 * el enlace con el tag correcto y los atributos SEO. Devuelve `null` si la
 * entrada no es de Amazon.
 *
 * - Con ASIN: genera la URL canónica `/dp/ASIN?tag=…` y elimina parámetros de
 *   seguimiento (`ref`, `pd_rd_*`, `th`, `psc`…).
 * - Sin ASIN (búsquedas, tiendas de marca): conserva la URL y sustituye el tag.
 * - Enlaces cortos (`amzn.to`, `a.co`): se devuelven tal cual (ya llevan el tag
 *   de quien los creó y no se pueden reescribir sin resolverlos).
 *
 * Marketplace: el indicado › el del dominio de la URL › `es`. Las URLs de otros
 * Amazon (`.de`, `.com.mx`…) se reescriben a Amazon.es/.com usando su ASIN.
 *
 * @example
 *   toAffiliateLink("B0DEMO0001")
 *   // → { href: "https://www.amazon.es/dp/B0DEMO0001?tag=ergotoplab-21", rel: "sponsored nofollow noopener", target: "_blank", … }
 *   toAffiliateLink("https://www.amazon.com/Silla-X/dp/B0DEMO0001/ref=sr_1_3?th=1")
 *   // → href "https://www.amazon.com/dp/B0DEMO0001?tag=ergotoplabus-20"
 */
export function toAffiliateLink(input: string, marketplace?: Marketplace): AffiliateLink | null {
  const value = input?.trim();
  if (!value) return null;

  const asin = extractAsin(value);
  const isUrl = !(asin && asin === value.toUpperCase());
  if (isUrl && !isAmazonUrl(value)) return null;

  const target = marketplace ?? (isUrl ? detectMarketplace(value) : null) ?? "es";
  const base = { rel: AFFILIATE_REL, target: AFFILIATE_TARGET, asin, marketplace: target } as const;

  if (asin) return { ...base, href: buildAffiliateUrl(asin, target) };

  const url = parseUrl(value)!;
  const detected = detectMarketplace(value);
  if (!detected) return { ...base, href: url.toString() }; // enlace corto u otro marketplace sin ASIN
  url.protocol = "https:";
  url.searchParams.set("tag", getAffiliateTag(detected));
  return { ...base, marketplace: detected, href: url.toString() };
}

/** Atajo: solo la URL final (o la entrada sin cambios si no es de Amazon). */
export function toAffiliateUrl(input: string, marketplace?: Marketplace): string {
  return toAffiliateLink(input, marketplace)?.href ?? input;
}

/** Garantiza que una URL de Amazon lleva el tag del marketplace indicado. */
export function ensureAffiliateTag(rawUrl: string, marketplace: Marketplace): string {
  return toAffiliateUrl(rawUrl, marketplace);
}

/* ─────────────────────────── Productos ─────────────────────────── */

export interface AffiliateLinks {
  es: string;
  us: string;
}

/**
 * Enlaces ES/US de un producto. Se recalculan en cada render a partir del ASIN
 * o de la URL guardada, así que cambiar el tag en las variables de entorno
 * actualiza todos los enlaces sin tocar la base de datos.
 */
export function resolveAffiliateLinks(product: {
  asin: string;
  amazonUrlEs: string | null;
  amazonUrlUs: string | null;
}): AffiliateLinks {
  return {
    es: product.amazonUrlEs ? toAffiliateUrl(product.amazonUrlEs, "es") : buildAffiliateUrl(product.asin, "es"),
    us: product.amazonUrlUs ? toAffiliateUrl(product.amazonUrlUs, "us") : buildAffiliateUrl(product.asin, "us"),
  };
}
