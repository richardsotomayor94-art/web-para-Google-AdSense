"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type BoolLike = boolean | "true" | "false";

export interface AdSenseBannerProps {
  /** ID del bloque de anuncio (data-ad-slot). */
  slot?: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  responsive?: BoolLike;
  /** Para anuncios in-article: "in-article". */
  layout?: string;
  className?: string;
  /** Alto reservado para evitar CLS mientras carga el anuncio. */
  minHeight?: number;
  label?: string;
}

const CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

/**
 * Bloque de Google AdSense aislado en cliente. Cada instancia hace un único
 * `push` al montarse; al navegar entre páginas se monta una instancia nueva.
 */
export function AdSenseBanner({
  slot,
  format = "auto",
  responsive = true,
  layout,
  className,
  minHeight = 250,
  label = "Publicidad",
}: AdSenseBannerProps) {
  const ref = useRef<HTMLModElement>(null);
  const enabled = Boolean(CLIENT_ID && slot);

  useEffect(() => {
    if (!enabled || !ref.current || ref.current.dataset.adsbygoogleStatus) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* bloqueadores de anuncios, etc. */
    }
  }, [enabled]);

  if (!enabled) {
    if (process.env.NODE_ENV === "production") return null;
    return (
      <div
        className={cn(
          "my-8 flex items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground",
          className,
        )}
        style={{ minHeight }}
        aria-hidden
      >
        AdSense · {slot ? `slot ${slot}` : "configura NEXT_PUBLIC_ADSENSE_SLOT_*"}
      </div>
    );
  }

  const isResponsive = responsive === true || responsive === "true";

  return (
    <aside className={cn("my-8", className)} aria-label={label}>
      <p className="mb-1 text-center text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <ins
        ref={ref}
        className="adsbygoogle block"
        style={{ display: "block", minHeight, textAlign: layout === "in-article" ? "center" : undefined }}
        data-ad-client={CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={layout === "in-article" ? "fluid" : format}
        data-ad-layout={layout}
        data-full-width-responsive={isResponsive ? "true" : "false"}
      />
    </aside>
  );
}
