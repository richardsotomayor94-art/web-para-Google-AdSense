import Link from "next/link";
import type { ArticleSummary } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function ArticleCard({ article }: { article: ArticleSummary }) {
  return (
    <article className="test-sheet reveal group relative flex h-full flex-col gap-3 p-5 hover:border-ink">
      {article.publishedAt && (
        <time dateTime={article.publishedAt} className="text-xs text-ink-3">
          {formatDate(article.publishedAt)}
        </time>
      )}
      <h3 className="text-lg font-semibold leading-snug text-ink">
        <Link href={`/guias/${article.slug}`} className="after:absolute after:inset-0 group-hover:text-measure">
          {article.title}
        </Link>
      </h3>
      {article.excerpt && <p className="line-clamp-3 text-sm text-ink-2">{article.excerpt}</p>}
      <span className="mt-auto text-sm font-medium text-measure">Leer la guía</span>
    </article>
  );
}
