import { cacheLife, cacheTag } from "next/cache";
import { getAllProducts, getCategories, getComparisonPairs, getPublishedArticles } from "@/lib/data";
import { CACHE_TAGS } from "@/lib/data/tags";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { formatPrice, shortName } from "@/lib/utils";

/**
 * /llms.txt — mapa del sitio en Markdown para rastreadores de IA
 * (especificación https://llmstxt.org). Se regenera al invalidar las etiquetas.
 */
async function buildLlmsTxt(): Promise<string> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.products, CACHE_TAGS.articles, CACHE_TAGS.categories);

  const [categories, products, articles, pairs] = await Promise.all([
    getCategories(),
    getAllProducts(),
    getPublishedArticles(),
    getComparisonPairs(),
  ]);

  const top = [...products].sort((a, b) => (b.editorialRating ?? 0) - (a.editorialRating ?? 0));
  const lines: string[] = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    `${siteConfig.name} es una publicación independiente en español sobre ergonomía y equipamiento para teletrabajo. ` +
      "Las reseñas se basan en pruebas de uso prolongado (mínimo 4 semanas) y las guías de salud están revisadas por fisioterapeutas colegiados. " +
      "Las notas editoriales van de 0 a 10. Los precios proceden de Amazon.es y son orientativos.",
    "",
    "## Guías",
    ...articles.map((a) => `- [${a.title}](${absoluteUrl(`/guias/${a.slug}`)})${a.excerpt ? `: ${a.excerpt}` : ""}`),
    "",
    "## Reseñas mejor valoradas",
    ...top.map((p) => {
      const price = formatPrice(p.priceCurrent, p.currency);
      const meta = [p.categoryName, p.editorialRating != null ? `nota ${p.editorialRating}/10` : null, price ? `desde ${price}` : null]
        .filter(Boolean)
        .join(", ");
      return `- [${shortName(p.title)}](${absoluteUrl(`/resenas/${p.slug}`)}): ${meta}.${p.verdict ? ` ${p.verdict}` : ""}`;
    }),
    "",
    "## Categorías",
    ...categories.map((c) => `- [${c.name}](${absoluteUrl(`/resenas#${c.slug}`)})${c.description ? `: ${c.description}` : ""}`),
    "",
    "## Comparativas",
    ...pairs.map((p) => `- [${shortName(p.a.title)} vs ${shortName(p.b.title)}](${absoluteUrl(`/comparar/${p.slug}`)})`),
    "",
    "## Optional",
    `- [Contenido completo para LLMs](${absoluteUrl("/llms-full.txt")}): texto íntegro de guías y reseñas`,
    `- [Quiénes somos y metodología](${absoluteUrl("/sobre-nosotros")})`,
    `- [Política de afiliación](${absoluteUrl("/afiliacion")})`,
    `- [Sitemap XML](${absoluteUrl("/sitemap.xml")})`,
    "",
  ];
  return lines.join("\n");
}

export async function GET() {
  return new Response(await buildLlmsTxt(), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
