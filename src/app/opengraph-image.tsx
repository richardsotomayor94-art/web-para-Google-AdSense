import { ogContentType, ogSize, renderOg } from "@/lib/og/template";
import { siteConfig } from "@/lib/site";

export const alt = siteConfig.name;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "Ergonomía · Teletrabajo · Reseñas", title: "Teletrabaja sin dolor. Te decimos qué comprar y cómo ajustarlo." });
}
