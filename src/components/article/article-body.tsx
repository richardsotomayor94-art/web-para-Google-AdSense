import { Fragment } from "react";
import { AD_SLOTS } from "@/components/ads/ad-slots";
import { AdSenseBanner } from "@/components/ads/adsense-banner";
import { ProductInline } from "@/components/product/product-card";
import { adInsertionPoints, splitSections, splitShortcodes } from "@/lib/markdown";
import type { Product } from "@/lib/types";
import { Markdown } from "./markdown";

/**
 * Renderiza el Markdown de una guía:
 *  - sustituye `{{product:ASIN}}` por fichas de producto contextuales;
 *  - inserta anuncios AdSense in-article entre secciones `##` intermedias.
 */
export function ArticleBody({
  content,
  products,
  withAds = true,
}: {
  content: string;
  products: Product[];
  withAds?: boolean;
}) {
  const byAsin = new Map(products.map((p) => [p.asin, p]));
  const sections = splitSections(content);
  const adPoints = withAds ? adInsertionPoints(sections.length) : new Set<number>();

  return (
    <div className="prose-eh">
      {sections.map((section, i) => (
        <Fragment key={i}>
          {splitShortcodes(section).map((segment, j) => {
            if (segment.type === "markdown") return <Markdown key={j}>{segment.value}</Markdown>;
            const product = byAsin.get(segment.asin);
            return product ? <ProductInline key={j} product={product} /> : null;
          })}
          {adPoints.has(i) && <AdSenseBanner slot={AD_SLOTS.inArticle} layout="in-article" />}
        </Fragment>
      ))}
    </div>
  );
}
