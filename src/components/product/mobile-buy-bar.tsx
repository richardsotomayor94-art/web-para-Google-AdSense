import { resolveAffiliateLinks } from "@/lib/amazon";
import type { Product } from "@/lib/types";
import { formatPrice, shortName } from "@/lib/utils";
import { AffiliateButton } from "./affiliate-button";

/** Barra fija inferior en móvil: nombre, precio y botón de compra siempre a mano. */
export function MobileBuyBar({ product }: { product: Product }) {
  const links = resolveAffiliateLinks(product);
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-rule bg-background/95 px-4 py-3 backdrop-blur md:hidden">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">{shortName(product.title)}</p>
          <p className="type-figure text-sm text-ink-2">{formatPrice(product.priceCurrent, product.currency) ?? "Ver precio"}</p>
        </div>
        <AffiliateButton product={product} links={links} placement="review_mobile_bar" size="default" className="w-auto shrink-0" label="Ver en Amazon" />
      </div>
    </div>
  );
}
