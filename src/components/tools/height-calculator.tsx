"use client";

import { useId, useState } from "react";
import { Ruler } from "lucide-react";

/**
 * Calculadora orientativa de alturas ergonómicas a partir de la estatura.
 * Basada en proporciones antropométricas medias; los valores son un punto de
 * partida y deben ajustarse con la regla de los 90° (rodillas y codos).
 */
export function HeightCalculator() {
  const id = useId();
  const [height, setHeight] = useState(175);
  const valid = height >= 140 && height <= 210;

  const rows = valid
    ? [
        { label: "Altura del asiento", value: `${Math.round(height * 0.25)} cm` },
        { label: "Mesa (sentado)", value: `${Math.round(height * 0.4)} cm` },
        { label: "Mesa (de pie)", value: `${Math.round(height * 0.62)} cm` },
        { label: "Borde superior del monitor (sentado)", value: `${Math.round(height * 0.7)} cm` },
        { label: "Distancia a la pantalla", value: "50–75 cm" },
      ]
    : [];

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <Ruler className="size-5 text-primary" aria-hidden />
        <h3 className="font-semibold">Calculadora de altura ergonómica</h3>
      </div>
      <label htmlFor={id} className="text-sm text-muted-foreground">
        Tu estatura (cm)
      </label>
      <div className="mt-2 flex items-center gap-3">
        <input
          id={id}
          type="range"
          min={140}
          max={210}
          value={height}
          onChange={(e) => setHeight(Number(e.target.value))}
          className="w-full accent-[var(--primary)]"
        />
        <output htmlFor={id} className="w-16 text-right text-lg font-bold tabular-nums">
          {height}
        </output>
      </div>
      <dl className="mt-4 divide-y text-sm">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between gap-4 py-2">
            <dt className="text-muted-foreground">{r.label}</dt>
            <dd className="font-semibold tabular-nums">{r.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-xs text-muted-foreground">Valores orientativos. Ajusta para que rodillas y codos queden a ~90°.</p>
    </div>
  );
}
