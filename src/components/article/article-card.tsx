import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ArticleSummary } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function ArticleCard({ article }: { article: ArticleSummary }) {
  return (
    <article className="group relative flex h-full flex-col gap-3 rounded-xl border bg-card p-5 transition-shadow hover:shadow-md">
      <p className="text-xs text-muted-foreground">{formatDate(article.publishedAt)}</p>
      <h3 className="text-lg font-semibold leading-snug">
        <Link href={`/guias/${article.slug}`} className="after:absolute after:inset-0 group-hover:underline">
          {article.title}
        </Link>
      </h3>
      {article.excerpt && <p className="line-clamp-3 text-sm text-muted-foreground">{article.excerpt}</p>}
      <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary">
        Leer guía <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </span>
    </article>
  );
}
