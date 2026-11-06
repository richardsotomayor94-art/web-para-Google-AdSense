import type { ArticleAuthor } from "./types";

/** Dominio definitivo de la marca (aún sin conectar durante la fase de pruebas). */
export const BRAND_DOMAIN = "ergotoplab.com";

/**
 * URL pública canónica, por orden de prioridad:
 *  1. NEXT_PUBLIC_SITE_URL (fase de pruebas: https://ergotoplab.vercel.app)
 *  2. NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL, la variable de sistema de Vercel con el
 *     dominio de producción del proyecto (p. ej. "ergotoplab.vercel.app"; pasa a ser
 *     "ergotoplab.com" en cuanto se conecte el dominio personalizado)
 *  3. https://ergotoplab.com
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  const vercelProduction = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;
  const url = explicit || (vercelProduction ? `https://${vercelProduction}` : `https://${BRAND_DOMAIN}`);
  return url.replace(/\/$/, "");
}

const SITE_URL = resolveSiteUrl();

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "ErgoTopLab",
  alternateName: "ErgoTop Lab",
  tagline: "Laboratorio de Análisis y Ergonomía para Setup y Teletrabajo",
  description:
    "ErgoTopLab es un laboratorio independiente de análisis y ergonomía: pruebas reales, guías basadas en evidencia y comparativas de sillas, escritorios elevables, monitores y accesorios para tu setup de teletrabajo.",
  url: SITE_URL,
  /** Host actual (ergotoplab.vercel.app en pruebas, ergotoplab.com en producción). */
  domain: new URL(SITE_URL).host,
  /**
   * `NEXT_PUBLIC_SITE_NOINDEX=true` → noindex global y robots.txt bloqueado.
   * Útil en la fase de pruebas para que Google no indexe el dominio temporal.
   */
  noIndex: process.env.NEXT_PUBLIC_SITE_NOINDEX === "true",
  locale: "es_ES",
  language: "es",
  twitter: "@ergotoplab",
  email: "hola@ergotoplab.com",
} as const;

/** Autor por defecto para las piezas sin autor explícito (E-E-A-T). */
export const defaultAuthor: ArticleAuthor = {
  name: `Laboratorio ${siteConfig.name}`,
  slug: "equipo-editorial",
  role: "Equipo de análisis y pruebas ergonómicas",
  bio: "Fisioterapeutas, ingenieros y teletrabajadores que prueban cada producto durante semanas en el laboratorio antes de recomendarlo.",
  url: `${siteConfig.url}/sobre-nosotros`,
  sameAs: [],
};

export const mainNav = [
  { href: "/guias", label: "Guías" },
  { href: "/resenas", label: "Reseñas" },
  { href: "/comparar", label: "Comparativas" },
  { href: "/sobre-nosotros", label: "El laboratorio" },
] as const;

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
