import Link from "next/link";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { mainNav, siteConfig } from "@/lib/site";
import { Container } from "./container";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-bold tracking-tight" aria-label={`${siteConfig.name} — inicio`}>
      <span className="grid size-8 place-items-center rounded-lg bg-primary text-sm text-primary-foreground">ET</span>
      <span className="text-lg">
        ErgoTop<span className="text-primary">Lab</span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          {/* Menú móvil sin JavaScript */}
          <details className="group relative md:hidden">
            <summary className="grid size-9 cursor-pointer list-none place-items-center rounded-md hover:bg-accent [&::-webkit-details-marker]:hidden">
              <Menu className="size-5" aria-hidden />
              <span className="sr-only">Abrir menú</span>
            </summary>
            <nav
              aria-label="Móvil"
              className="absolute right-0 mt-2 flex w-56 flex-col rounded-xl border bg-popover p-2 shadow-lg"
            >
              {mainNav.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-md px-3 py-2 text-sm hover:bg-accent">
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
