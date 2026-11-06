import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd, graph } from "@/lib/seo/jsonld";

export interface Crumb {
  name: string;
  path: string;
}

export function Breadcrumbs({ items, withJsonLd = true }: { items: Crumb[]; withJsonLd?: boolean }) {
  const all = [{ name: "Inicio", path: "/" }, ...items];
  return (
    <>
      {withJsonLd && <JsonLd data={graph(breadcrumbJsonLd(all))} />}
      <nav aria-label="Ruta de navegación" className="text-sm text-ink-3">
        <ol className="flex flex-wrap items-center gap-1">
          {all.map((item, i) => (
            <li key={item.path} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="size-3.5" aria-hidden />}
              {i === all.length - 1 ? (
                <span aria-current="page" className="line-clamp-1 text-foreground">
                  {item.name}
                </span>
              ) : (
                <Link href={item.path} className="hover:text-foreground hover:underline">
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
