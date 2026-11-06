import { toAffiliateLink } from "@/lib/amazon";
import type { Marketplace } from "@/lib/types";

/**
 * Enlace de afiliado a partir de cualquier URL de Amazon o ASIN (Server Component).
 *
 * @example
 *   <AmazonLink href="B0DEMO0001">Ver en Amazon</AmazonLink>
 *   <AmazonLink href="https://www.amazon.com/dp/B0DEMO0001?ref=xyz" marketplace="us">Amazon.com</AmazonLink>
 */
export function AmazonLink({
  href,
  marketplace,
  children,
  ...props
}: Omit<React.ComponentProps<"a">, "href" | "rel" | "target"> & { href: string; marketplace?: Marketplace }) {
  const link = toAffiliateLink(href, marketplace);
  if (!link) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  }
  return (
    <a href={link.href} rel={link.rel} target={link.target} data-asin={link.asin ?? undefined} {...props}>
      {children}
    </a>
  );
}
