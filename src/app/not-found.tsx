import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center gap-4 py-24 text-center">
      <p className="text-sm font-semibold text-primary">Error 404</p>
      <h1 className="text-4xl type-heading text-ink">No encontramos esta página</h1>
      <p className="max-w-md text-ink-3">Puede que el producto ya no esté disponible o que la URL haya cambiado.</p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/guias">Ver guías</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/resenas">Ver reseñas</Link>
        </Button>
      </div>
    </Container>
  );
}
