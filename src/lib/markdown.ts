import { slugify } from "./utils";

export const PRODUCT_SHORTCODE = /\{\{\s*product:([A-Za-z0-9]{10})\s*\}\}/g;

export interface TocItem {
  id: string;
  text: string;
}

const stripInline = (s: string) => s.replace(/[*_`[\]]/g, "").replace(/\(.*?\)/g, "").trim();

/** Índice de contenidos a partir de los encabezados `##`. */
export function extractToc(markdown: string): TocItem[] {
  return [...markdown.matchAll(/^##\s+(.+)$/gm)].map((m) => {
    const text = stripInline(m[1]);
    return { id: slugify(text), text };
  });
}

/** Divide el Markdown en secciones por `##` (la intro es la sección 0). */
export function splitSections(markdown: string): string[] {
  const parts = markdown.split(/\n(?=##\s)/g);
  return parts.map((p) => p.trim()).filter(Boolean);
}

export type ContentSegment = { type: "markdown"; value: string } | { type: "product"; asin: string };

/** Separa el texto de los shortcodes `{{product:ASIN}}`. */
export function splitShortcodes(markdown: string): ContentSegment[] {
  const segments: ContentSegment[] = [];
  let last = 0;
  for (const match of markdown.matchAll(PRODUCT_SHORTCODE)) {
    const index = match.index ?? 0;
    if (index > last) segments.push({ type: "markdown", value: markdown.slice(last, index) });
    segments.push({ type: "product", asin: match[1].toUpperCase() });
    last = index + match[0].length;
  }
  if (last < markdown.length) segments.push({ type: "markdown", value: markdown.slice(last) });
  return segments.filter((s) => s.type === "product" || s.value.trim());
}

/** ASIN mencionados en el contenido (shortcodes). */
export function extractAsins(markdown: string): string[] {
  return [...new Set([...markdown.matchAll(PRODUCT_SHORTCODE)].map((m) => m[1].toUpperCase()))];
}

/**
 * Índices de sección tras los que insertar un anuncio in-article:
 * uno a mitad del contenido y otro tras la primera sección si el texto es largo.
 */
export function adInsertionPoints(sectionCount: number): Set<number> {
  const points = new Set<number>();
  if (sectionCount >= 3) points.add(Math.floor(sectionCount / 2) - 1);
  if (sectionCount >= 6) points.add(0);
  if (sectionCount >= 8) points.add(Math.floor((sectionCount * 3) / 4) - 1);
  return points;
}

/** Texto plano (para llms.txt, descripciones, etc.). */
export function markdownToPlainText(markdown: string): string {
  return markdown
    .replace(PRODUCT_SHORTCODE, "")
    .replace(/!\[[^\]]*]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/[#>*_`|]/g, "")
    .replace(/\n{2,}/g, "\n")
    .trim();
}
