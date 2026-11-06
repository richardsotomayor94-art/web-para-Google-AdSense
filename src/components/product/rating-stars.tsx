import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({
  rating,
  count,
  className,
  source = "Amazon",
}: {
  rating: number | null;
  count?: number;
  className?: string;
  source?: string;
}) {
  if (rating == null) return null;
  const full = Math.round(rating * 2) / 2;
  return (
    <div className={cn("flex items-center gap-1.5 text-sm", className)}>
      <div className="flex" aria-hidden>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={cn(
              "size-4",
              i + 1 <= full ? "fill-ink-3 text-ink-3" : i + 0.5 === full ? "fill-ink-3/40 text-ink-3" : "text-ink-3/40",
            )}
          />
        ))}
      </div>
      <span className="font-medium">{rating.toFixed(1)}</span>
      {count != null && count > 0 && (
        <span className="text-ink-3">
          ({count.toLocaleString("es-ES")} valoraciones en {source})
        </span>
      )}
      <span className="sr-only">
        {rating.toFixed(1)} de 5 estrellas en {source}
      </span>
    </div>
  );
}
