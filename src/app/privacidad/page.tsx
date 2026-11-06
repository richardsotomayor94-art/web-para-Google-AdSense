import type { Metadata } from "next";
import { StaticPage } from "@/components/layout/static-page";
import { pageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Política de privacidad y cookies",
  description: `Qué datos trata ${siteConfig.name}, con qué finalidad y qué cookies utiliza.`,
  path: "/privacidad",
});

export default function PrivacyPage() {
  return (
    <StaticPage title="Privacidad y cookies" path="/privacidad" intro="Plantilla orientativa: revísala con tu asesor legal antes de publicar.">
      <h2>Responsable</h2>
      <p>
        {siteConfig.name} · <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
      </p>
      <h2>Datos que tratamos</h2>
      <ul>
        <li>Datos de navegación anónimos y agregados (Google Analytics 4) para medir audiencia.</li>
        <li>Clics en enlaces a Amazon: país aproximado (derivado de la IP, que no se almacena), página y producto.</li>
        <li>Cookies publicitarias de Google AdSense, solo con tu consentimiento.</li>
      </ul>
      <h2>Cookies</h2>
      <ul>
        <li><strong>eh_country</strong> (propia, técnica, 7 días): país para mostrarte la tienda de Amazon adecuada.</li>
        <li><strong>theme</strong> (propia, técnica): preferencia de modo claro/oscuro.</li>
        <li><strong>_ga, _ga_*</strong> (Google, analítica, 2 años).</li>
        <li><strong>Cookies de Google AdSense</strong> (publicidad personalizada), sujetas a consentimiento.</li>
      </ul>
      <h2>Tus derechos</h2>
      <p>
        Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo
        a {siteConfig.email}, y reclamar ante la Agencia Española de Protección de Datos (aepd.es).
      </p>
    </StaticPage>
  );
}
