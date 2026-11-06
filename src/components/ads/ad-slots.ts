/** IDs de bloque configurados por entorno (NEXT_PUBLIC_* se inlinan en build). */
export const AD_SLOTS = {
  inArticle: process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE || undefined,
  display: process.env.NEXT_PUBLIC_ADSENSE_SLOT_DISPLAY || undefined,
} as const;
