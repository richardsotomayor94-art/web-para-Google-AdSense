"use client";

import { sendGAEvent } from "@next/third-parties/google";

type EventParams = Record<string, string | number | boolean | null | undefined>;

/** Envía un evento personalizado a GA4 (y queda en `dataLayer` para GTM). */
export function trackEvent(name: string, params: EventParams = {}): void {
  if (typeof window === "undefined") return;
  try {
    if (process.env.NEXT_PUBLIC_GA_ID) {
      sendGAEvent("event", name, params);
    } else {
      const w = window as unknown as { dataLayer?: unknown[] };
      w.dataLayer = w.dataLayer ?? [];
      w.dataLayer.push({ event: name, ...params });
    }
  } catch {
    /* la analítica nunca debe romper la navegación */
  }
}

/** Registra el clic saliente en nuestra base de datos sin bloquear la navegación. */
export function beaconClick(payload: {
  productId: string;
  asin: string;
  marketplace: string;
  placement?: string;
}): void {
  if (typeof navigator === "undefined") return;
  const body = JSON.stringify({ ...payload, path: window.location.pathname, referrer: document.referrer || null });
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track/click", new Blob([body], { type: "application/json" }));
    } else {
      void fetch("/api/track/click", { method: "POST", body, keepalive: true, headers: { "content-type": "application/json" } });
    }
  } catch {
    /* noop */
  }
}
