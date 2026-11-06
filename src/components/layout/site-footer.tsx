import Link from "next/link";
import { siteConfig } from "@/lib/site";
import type { Category } from "@/lib/types";
import { Container } from "./container";
import { Logo } from "./site-header";

export function SiteFooter({ categories }: { categories: Category[] }) {
  return (
    <footer className="mt-24 bg-paper-2/70">
      <div className="ruler" aria-hidden />
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm text-ink-2">{siteConfig.tagline}.</p>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-ink">Categorías</p>
          <ul className="space-y-2 text-sm text-ink-3">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/resenas#${c.slug}`} className="hover:text-ink">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-ink">Contenido</p>
          <ul className="space-y-2 text-sm text-ink-3">
            <li><Link href="/guias" className="hover:text-ink">Guías de ergonomía</Link></li>
            <li><Link href="/resenas" className="hover:text-ink">Reseñas</Link></li>
            <li><Link href="/comparar" className="hover:text-ink">Comparativas</Link></li>
            <li><Link href="/sobre-nosotros#metodologia" className="hover:text-ink">Cómo probamos</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-ink">Legal</p>
          <ul className="space-y-2 text-sm text-ink-3">
            <li><Link href="/sobre-nosotros" className="hover:text-ink">El laboratorio</Link></li>
            <li><Link href="/aviso-legal" className="hover:text-ink">Aviso legal</Link></li>
            <li><Link href="/privacidad" className="hover:text-ink">Privacidad y cookies</Link></li>
            <li><Link href="/afiliacion" className="hover:text-ink">Transparencia y afiliación</Link></li>
          </ul>
        </div>
      </Container>
      <Container className="border-t py-6 text-xs leading-relaxed text-ink-3">
        <p>
          En calidad de Afiliado de Amazon, {siteConfig.name} obtiene ingresos por las compras adscritas que cumplen los
          requisitos aplicables. Los precios y la disponibilidad pueden cambiar; el precio vigente es el que figura en
          Amazon en el momento de la compra.
        </p>
        <p className="mt-2">© {siteConfig.name}. Contenido informativo: no sustituye el consejo médico profesional.</p>
      </Container>
    </footer>
  );
}
