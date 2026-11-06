import type { Metadata } from "next";
import { StaticPage } from "@/components/layout/static-page";
import { pageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: `Sobre ${siteConfig.name}: el laboratorio y cómo probamos`,
  description: `Conoce al equipo de ${siteConfig.name}, nuestra metodología de pruebas y cómo nos financiamos.`,
  path: "/sobre-nosotros",
});

export default function AboutPage() {
  return (
    <StaticPage
      title={`Sobre ${siteConfig.name}`}
      path="/sobre-nosotros"
      intro={`${siteConfig.name} es un ${siteConfig.tagline.charAt(0).toLowerCase()}${siteConfig.tagline.slice(1)}. Nacimos de una pregunta sencilla: ¿qué necesito de verdad para trabajar desde casa sin acabar con dolor de espalda?`}
    >
      <h2 id="equipo">El equipo</h2>
      <p>
        Somos un equipo pequeño de fisioterapeutas, ingenieros de producto y teletrabajadores. Cada guía de salud la revisa
        un profesional sanitario colegiado y cada reseña la firma quien ha usado el producto.
      </p>
      <h3 id="laura-mendez">Laura Méndez — Fisioterapeuta</h3>
      <p>
        Fisioterapeuta colegiada con más de 10 años tratando lesiones musculoesqueléticas en trabajadores de oficina.
        Máster en Ergonomía y Psicosociología Aplicada. Supervisa todas las guías de salud.
      </p>
      <h2 id="metodologia">Cómo probamos</h2>
      <ol>
        <li><strong>Selección</strong>: partimos de los productos más vendidos y mejor valorados de cada categoría.</li>
        <li><strong>Uso real</strong>: cada producto se usa un mínimo de 4 semanas en jornadas completas.</li>
        <li><strong>Medición</strong>: rangos de ajuste, estabilidad, ruido y materiales con criterios comunes.</li>
        <li><strong>Nota editorial</strong>: puntuamos de 0 a 10 ponderando ergonomía (40 %), calidad (30 %), precio (20 %) y garantía (10 %).</li>
        <li><strong>Actualización</strong>: revisamos precios a diario y las reseñas al menos cada 6 meses.</li>
      </ol>
      <h2 id="financiacion">Cómo nos financiamos</h2>
      <p>
        Mediante publicidad (Google AdSense) en las guías informativas y comisiones de afiliación de Amazon cuando compras
        a través de nuestros enlaces. Ninguna marca paga por aparecer ni puede revisar nuestros análisis antes de
        publicarse.
      </p>
      <h2 id="contacto">Contacto</h2>
      <p>
        Escríbenos a <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
      </p>
    </StaticPage>
  );
}
