import { cn } from "@/lib/utils";

/** Nota editorial 0–10 como medidor de laboratorio (barra con una marca por punto). */
export function ScoreGauge({
  score,
  size = "md",
  className,
}: {
  score: number | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  if (score == null) return null;
  const tone = score >= 9 ? "pass" : "measure";
  return (
    <div className={cn("w-full", className)}>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="type-label">Nota del laboratorio</span>
        <span
          className={cn(
            "type-figure text-ink",
            size === "lg" ? "text-3xl" : size === "md" ? "text-xl" : "text-base",
          )}
        >
          {score.toFixed(1)}
          <span className="text-sm font-medium text-ink-3"> / 10</span>
        </span>
      </div>
      <div className="gauge-track" role="meter" aria-valuemin={0} aria-valuemax={10} aria-valuenow={score} aria-label="Nota del laboratorio">
        <div className="gauge-fill" data-tone={tone} style={{ width: `${score * 10}%` }} />
      </div>
    </div>
  );
}
