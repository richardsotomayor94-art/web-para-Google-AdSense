import { cacheLife, cacheTag } from "next/cache";
import { getAllProducts, getArticleBySlug, getPublishedArticles } from "@/lib/data";
import { CACHE_TAGS } from "@/lib/data/tags";
import { PRODUCT_SHORTCODE } from "@/lib/markdown";
import { absoluteUrl, defaultAuthor, siteConfig } from "@/lib/site";
import { formatPrice, shortName } from "@/lib/utils";

/** /llms-full.txt — versión extendida con el texto íntegro de guías y reseñas. */
async function buildFull(): Promise<string> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.products, CACHE_TAGS.articles);

  const [summaries, products] = await Promise.all([getPublishedArticles(), getAllProducts()]);
  const articles = (await Promise.all(summaries.map((s) => getArticleBySlug(s.slug)))).filter(Boolean);
  const byAsin = new Map(products.map((p) => [p.asin, p]));

  const out: string[] = [`# ${siteConfig.name} — contenido completo`, "", `> ${siteConfig.description}`, ""];

  for (const a of articles) {
    if (!a) continue;
    const author = a.author ?? defaultAuthor;
    out.push(
      `## Guía: ${a.title}`,
      "",
      `URL: ${absoluteUrl(`/guias/${a.slug}`)}`,
      `Autor: ${author.name}${author.role ? ` (${author.role})` : ""}`,
      `Actualizado: ${a.updatedAt.slice(0, 10)}`,
      "",
      a.content.replace(PRODUCT_SHORTCODE, (_, asin: string) => {
        const p = byAsin.get(asin.toUpperCase());
        return p ? `[Producto recomendado: ${shortName(p.title)}](${absoluteUrl(`/resenas/${p.slug}`)})` : "";
      }),
      "",
      ...(a.faqs.length ? ["### Preguntas frecuentes", "", ...a.faqs.flatMap((f) => [`**${f.question}**`, f.answer, ""])] : []),
    );
  }

  for (const p of products) {
    out.push(
      `## Reseña: ${p.title}`,
      "",
      `URL: ${absoluteUrl(`/resenas/${p.slug}`)}`,
      `Categoría: ${p.categoryName ?? "—"} · Nota ErgoHack: ${p.editorialRating ?? "—"}/10 · Precio orientativo: ${formatPrice(p.priceCurrent, p.currency) ?? "—"}`,
      "",
      p.verdict ? `Veredicto: ${p.verdict}` : "",
      "",
      `Pros: ${p.pros.join("; ")}`,
      `Contras: ${p.cons.join("; ")}`,
      "",
      "Especificaciones:",
      ...Object.entries(p.features).map(([k, v]) => `- ${k}: ${v}`),
      "",
      p.description ?? "",
      "",
    );
  }
  return out.join("\n");
}

export async function GET() {
  return new Response(await buildFull(), { headers: { "content-type": "text/plain; charset=utf-8" } });
}
