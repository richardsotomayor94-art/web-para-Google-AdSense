import { BadgeCheck } from "lucide-react";
import { defaultAuthor } from "@/lib/site";
import type { ArticleAuthor } from "@/lib/types";

export function AuthorByline({ author, date, updated }: { author: ArticleAuthor | null; date?: string | null; updated?: string | null }) {
  const a = author ?? defaultAuthor;
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
      <span className="grid size-9 place-items-center rounded-full bg-accent font-semibold text-accent-foreground">
        {a.name.charAt(0)}
      </span>
      <span>
        Por <span className="font-medium text-foreground">{a.name}</span>
        {a.role && <span className="hidden sm:inline"> · {a.role}</span>}
      </span>
      {date && <span>· Publicado el {date}</span>}
      {updated && updated !== date && <span>· Actualizado el {updated}</span>}
    </div>
  );
}

export function AuthorBox({ author }: { author: ArticleAuthor | null }) {
  const a = author ?? defaultAuthor;
  return (
    <section aria-label="Sobre el autor" className="mt-12 flex gap-4 rounded-xl border bg-card p-5">
      <span className="grid size-14 shrink-0 place-items-center rounded-full bg-accent text-xl font-semibold text-accent-foreground">
        {a.name.charAt(0)}
      </span>
      <div className="space-y-1">
        <p className="flex items-center gap-1 font-semibold">
          {a.name} <BadgeCheck className="size-4 text-primary" aria-label="Autor verificado" />
        </p>
        {a.role && <p className="text-sm text-primary">{a.role}</p>}
        {a.bio && <p className="text-sm text-muted-foreground">{a.bio}</p>}
        {a.credentials?.length ? (
          <ul className="flex flex-wrap gap-2 pt-1">
            {a.credentials.map((c) => (
              <li key={c} className="rounded-md bg-muted px-2 py-0.5 text-xs">
                {c}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
