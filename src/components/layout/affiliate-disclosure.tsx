import Link from "next/link";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function AffiliateDisclosure({ className }: { className?: string }) {
  return (
    <p className={cn("flex items-start gap-2 rounded-lg bg-muted/60 px-3 py-2 text-xs text-ink-3", className)}>
      <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
      <span>
        Contenido independiente. Si compras a través de nuestros enlaces podemos recibir una comisión sin coste extra para
        ti. <Link href="/afiliacion" className="underline hover:text-foreground">Más información</Link>.
      </span>
    </p>
  );
}
