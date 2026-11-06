import type { ArticleAuthor } from "./types";

/** Dominio oficial de producción. Se puede sobrescribir con NEXT_PUBLIC_SITE_URL (p. ej. en previews). */
const PRODUCTION_URL = "https://ergotoplab.com";

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "ErgoTopLab",
  alternateName: "ErgoTop Lab",
  tagline: "Laboratorio de Análisis y Ergonomía para Setup y Teletrabajo",
  description:
    "ErgoTopLab es un laboratorio independiente de análisis y ergonomía: pruebas reales, guías basadas en evidencia y comparativas de sillas, escritorios elevables, monitores y accesorios para tu setup de teletrabajo.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || PRODUCTION_URL).replace(/\/$/, ""),
  domain: "ergotoplab.com",
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
