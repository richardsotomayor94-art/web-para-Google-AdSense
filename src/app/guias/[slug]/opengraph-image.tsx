import { getArticleBySlug, getPublishedArticles } from "@/lib/data";
import { ogContentType, ogSize, renderOg } from "@/lib/og/template";
import { defaultAuthor } from "@/lib/site";

export const alt = "Guía de ergonomía ErgoHack";
export const size = ogSize;
export const contentType = ogContentType;

export async function generateStaticParams() {
  const articles = await getPublishedArticles();
  return articles.length ? articles.map((a) => ({ slug: a.slug })) : [{ slug: "__placeholder__" }];
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return renderOg({ eyebrow: "Guías", title: "Guías de ergonomía" });
  return renderOg({ eyebrow: "Guía", title: article.title, footer: `Por ${(article.author ?? defaultAuthor).name}` });
}
