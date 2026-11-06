import { ogContentType, ogSize, renderOg } from "@/lib/og/template";
import { siteConfig } from "@/lib/site";

export const alt = siteConfig.name;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "Laboratorio de ergonomía para teletrabajo", title: "Ergonomía medida, no opinada." });
}
