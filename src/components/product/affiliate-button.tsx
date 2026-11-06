"use client";

import { useSyncExternalStore } from "react";
import { ExternalLink } from "lucide-react";
import type { VariantProps } from "class-variance-authority";
import { Button, type buttonVariants } from "@/components/ui/button";
import { AFFILIATE_REL, COUNTRY_COOKIE, marketplaceForCountry, type AffiliateLinks } from "@/lib/amazon";
import { beaconClick, trackEvent } from "@/lib/analytics";
import type { Marketplace } from "@/lib/types";
import { cn } from "@/lib/utils";

function readCountryCookie(): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${COUNTRY_COOKIE}=([A-Z]{2})`));
  return match ? match[1] : null;
}

const subscribe = () => () => {};

/**
 * Lee el país (fijado por `proxy.ts`) sin romper el HTML estático: en el
 * servidor siempre se renderiza el enlace de Amazon.es y tras hidratar se
 * cambia a Amazon.com si el visitante está fuera de España.
 */
function useMarketplace(): Marketplace {
  const country = useSyncExternalStore(subscribe, readCountryCookie, () => null);
  return marketplaceForCountry(country);
}

interface AffiliateButtonProps extends VariantProps<typeof buttonVariants> {
  product: { id: string; asin: string; priceCurrent: number | null; currency: string };
  links: AffiliateLinks;
  placement: string;
  label?: string;
  className?: string;
  showIcon?: boolean;
}

export function AffiliateButton({
  product,
  links,
  placement,
  label,
  className,
  variant = "cta",
  size = "lg",
  showIcon = true,
}: AffiliateButtonProps) {
  const marketplace = useMarketplace();
  const href = links[marketplace];
  const text = label ?? (marketplace === "es" ? "Ver precio en Amazon" : "Ver en Amazon.com");

  return (
    <Button asChild variant={variant} size={size} className={cn("w-full sm:w-auto", className)}>
      <a
        href={href}
        target="_blank"
        rel={AFFILIATE_REL}
        data-asin={product.asin}
        data-placement={placement}
        onClick={() => {
          trackEvent("amazon_click", {
            asin: product.asin,
            price: product.priceCurrent,
            currency: product.currency,
            country: marketplace === "es" ? "ES" : "INTL",
            marketplace,
            placement,
          });
          beaconClick({ productId: product.id, asin: product.asin, marketplace, placement });
        }}
      >
        {text}
        {showIcon && <ExternalLink aria-hidden />}
      </a>
    </Button>
  );
}
