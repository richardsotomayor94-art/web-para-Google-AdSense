import { Star } from "lucide-react";
import { siteConfig } from "@/lib/site";
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
              i + 1 <= full ? "fill-warning text-warning" : i + 0.5 === full ? "fill-warning/50 text-warning" : "text-muted-foreground/40",
            )}
          />
        ))}
      </div>
      <span className="font-medium">{rating.toFixed(1)}</span>
      {count != null && count > 0 && (
        <span className="text-muted-foreground">
          ({count.toLocaleString("es-ES")} valoraciones en {source})
        </span>
      )}
      <span className="sr-only">
        {rating.toFixed(1)} de 5 estrellas en {source}
      </span>
    </div>
  );
}

export function EditorialScore({ score, className }: { score: number | null; className?: string }) {
  if (score == null) return null;
  const tone = score >= 9 ? "bg-success" : score >= 8 ? "bg-primary" : "bg-warning text-foreground";
  return (
    <div className={cn("inline-flex items-center gap-2", className)} title={`Nota editorial ${siteConfig.name}`}>
      <span className={cn("grid size-11 place-items-center rounded-lg text-lg font-bold text-white", tone)}>
        {score.toFixed(1)}
      </span>
      <span className="text-xs leading-tight text-muted-foreground">
        Nota
        <br />
        {siteConfig.name}
      </span>
    </div>
  );
}
