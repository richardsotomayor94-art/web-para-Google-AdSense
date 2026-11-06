import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Slug ASCII apto para URL: "Silla Ergonómica Pro" → "silla-ergonomica-pro" */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 180);
}

export function formatPrice(value: number | null | undefined, currency = "EUR"): string | null {
  if (value == null) return null;
  return new Intl.NumberFormat("es-ES", { style: "currency", currency }).format(value);
}

export function formatDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  return new Intl.DateTimeFormat("es-ES", { dateStyle: "long", timeZone: "Europe/Madrid" }).format(new Date(iso));
}

export function computeDiscount(current?: number | null, original?: number | null): number | null {
  if (!current || !original || original <= current) return null;
  return Math.round(((original - current) / original) * 100);
}

export function readingTimeMinutes(markdown: string): number {
  const words = markdown.replace(/[#>*_`\-[\]()!|]/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/** Nombre corto de producto: "Ergovia Pro Mesh — Silla…" → "Ergovia Pro Mesh" */
export function shortName(title: string): string {
  return title.split(/\s[—–-]\s/)[0].trim();
}
