import Link from "next/link";
import { siteConfig } from "@/lib/site";
import type { Category } from "@/lib/types";
import { Container } from "./container";
import { Logo } from "./site-header";

export function SiteFooter({ categories }: { categories: Category[] }) {
  return (
    <footer className="mt-24 border-t bg-muted/30">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <Logo />
          <p className="text-sm text-muted-foreground">{siteConfig.tagline}.</p>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold">Categorías</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/resenas#${c.slug}`} className="hover:text-foreground">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold">Contenido</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/guias" className="hover:text-foreground">Guías de ergonomía</Link></li>
            <li><Link href="/resenas" className="hover:text-foreground">Reseñas</Link></li>
            <li><Link href="/comparar" className="hover:text-foreground">Comparativas</Link></li>
            <li><Link href="/sobre-nosotros#metodologia" className="hover:text-foreground">Cómo probamos</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold">Legal</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/sobre-nosotros" className="hover:text-foreground">Quiénes somos</Link></li>
            <li><Link href="/aviso-legal" className="hover:text-foreground">Aviso legal</Link></li>
            <li><Link href="/privacidad" className="hover:text-foreground">Privacidad y cookies</Link></li>
            <li><Link href="/afiliacion" className="hover:text-foreground">Transparencia y afiliación</Link></li>
          </ul>
        </div>
      </Container>
      <Container className="border-t py-6 text-xs leading-relaxed text-muted-foreground">
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
