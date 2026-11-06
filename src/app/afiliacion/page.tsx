import type { Metadata } from "next";
import { StaticPage } from "@/components/layout/static-page";
import { pageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Transparencia y enlaces de afiliado",
  description: `Cómo funcionan los enlaces de afiliado de ${siteConfig.name} y por qué no influyen en nuestras recomendaciones.`,
  path: "/afiliacion",
});

export default function AffiliatePage() {
  return (
    <StaticPage title="Transparencia y afiliación" path="/afiliacion">
      <p>
        {siteConfig.name} participa en el Programa de Afiliados de Amazon EU y Amazon.com, programas de publicidad para
        afiliados diseñados para ofrecer a sitios web un modo de obtener comisiones por publicidad, publicitando e
        incluyendo enlaces a Amazon.es y Amazon.com.
      </p>
      <p>
        En calidad de Afiliado de Amazon, obtenemos ingresos por las compras adscritas que cumplen los requisitos
        aplicables. El precio que pagas es el mismo.
      </p>
      <h2>¿Influye en las notas?</h2>
      <p>
        No. Las comisiones son similares entre productos de una misma categoría y las notas se calculan con la misma
        metodología para todos. Publicamos también los contras de cada producto.
      </p>
      <h2>Precios</h2>
      <p>
        Los precios mostrados son orientativos y se actualizan periódicamente. El precio y la disponibilidad vigentes son
        los que figuran en Amazon en el momento de la compra.
      </p>
    </StaticPage>
  );
}
