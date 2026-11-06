import Link from "next/link";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { mainNav, siteConfig } from "@/lib/site";
import { Container } from "./container";

/** Logotipo: escuadra de medición + nombre en Archivo expandido. */
export function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label={`${siteConfig.name}, inicio`}>
      <svg viewBox="0 0 32 32" className="size-8" aria-hidden>
        <rect x="1" y="1" width="30" height="30" rx="7" fill="var(--ink)" />
        <path d="M10 8.5v14h13.5" fill="none" stroke="var(--paper)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="20" cy="12" r="3" fill="var(--measure)" />
      </svg>
      <span className="type-heading text-[1.125rem] leading-none tracking-tight">
        ErgoTop<span className="font-semibold text-ink-3">Lab</span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-[0.9375rem] font-medium text-ink-2 transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          {/* Menú móvil sin JavaScript */}
          <details className="group relative md:hidden">
            <summary className="grid size-9 cursor-pointer list-none place-items-center rounded-md hover:bg-paper-2 [&::-webkit-details-marker]:hidden">
              <Menu className="size-5" aria-hidden />
              <span className="sr-only">Abrir menú</span>
            </summary>
            <nav aria-label="Móvil" className="absolute right-0 mt-2 flex w-56 flex-col rounded-lg border border-rule bg-popover p-2 shadow-lg">
              {mainNav.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-md px-3 py-2 text-sm hover:bg-paper-2">
                  {item.label}
                </Link>
              ))}
            </nav>
          </details>
        </div>
      </Container>
    </header>
  );
}
