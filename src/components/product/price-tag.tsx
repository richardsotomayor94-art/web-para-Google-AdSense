import { cn, formatPrice } from "@/lib/utils";

export function PriceTag({
  current,
  original,
  discount,
  currency,
  size = "md",
  className,
}: {
  current: number | null;
  original: number | null;
  discount: number | null;
  currency: string;
  size?: "md" | "lg";
  className?: string;
}) {
  const now = formatPrice(current, currency);
  if (!now) return <span className="text-sm text-ink-3">Consultar precio</span>;
  const before = original && current && original > current ? formatPrice(original, currency) : null;
  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-1", className)}>
      <span className={cn("font-bold tracking-tight", size === "lg" ? "text-3xl" : "text-xl")}>{now}</span>
      {before && <span className="text-sm text-ink-3 line-through">{before}</span>}
      {discount ? (
        <span className="rounded bg-destructive/10 px-1.5 py-0.5 text-xs font-semibold text-destructive">
          −{discount}%
        </span>
      ) : null}
    </div>
  );
}
