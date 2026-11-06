import type { Metadata } from "next";
import { StaticPage } from "@/components/layout/static-page";
import { pageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Aviso legal",
  description: `Información legal de ${siteConfig.name} conforme a la LSSI-CE.`,
  path: "/aviso-legal",
});

export default function LegalPage() {
  return (
    <StaticPage title="Aviso legal" path="/aviso-legal" intro="Plantilla orientativa: completa los datos del titular antes de publicar.">
      <h2>Titular</h2>
      <p>Nombre o razón social: [completar] · NIF: [completar] · Domicilio: [completar] · Email: {siteConfig.email}</p>
      <h2>Objeto</h2>
      <p>
        {siteConfig.name} es una publicación informativa sobre ergonomía y equipamiento de oficina. Su contenido no
        constituye consejo médico; ante cualquier dolencia consulta con un profesional sanitario.
      </p>
      <h2>Propiedad intelectual</h2>
      <p>Los textos, gráficos y logotipos son titularidad de {siteConfig.name} salvo indicación en contrario.</p>
      <h2>Enlaces externos</h2>
      <p>
        Este sitio contiene enlaces de afiliado a Amazon. No nos responsabilizamos del contenido ni de las condiciones de
        venta de sitios de terceros.
      </p>
    </StaticPage>
  );
}
