import type { ArticleAuthor } from "./types";

export const siteConfig = {
  name: "ErgoHack",
  shortName: "ErgoHack",
  tagline: "Ergonomía y setup de teletrabajo, probados de verdad",
  description:
    "Guías de ergonomía basadas en evidencia, reseñas independientes y comparativas de sillas, escritorios elevables, monitores y accesorios para teletrabajar sin dolor.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  locale: "es_ES",
  language: "es",
  twitter: "@ergohack",
  email: "hola@ergohack.es",
} as const;

/** Autor por defecto para las piezas sin autor explícito (E-E-A-T). */
export const defaultAuthor: ArticleAuthor = {
  name: "Equipo editorial ErgoHack",
  slug: "equipo-editorial",
  role: "Redacción y laboratorio de pruebas",
  bio: "Fisioterapeutas, ingenieros y teletrabajadores que prueban cada producto durante semanas antes de recomendarlo.",
  url: `${siteConfig.url}/sobre-nosotros`,
  sameAs: [],
};

export const mainNav = [
  { href: "/guias", label: "Guías" },
  { href: "/resenas", label: "Reseñas" },
  { href: "/comparar", label: "Comparativas" },
  { href: "/sobre-nosotros", label: "Quiénes somos" },
] as const;

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
