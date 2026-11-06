import { Check, X } from "lucide-react";

export function ProsCons({ pros, cons }: { pros: string[]; cons: string[] }) {
  if (!pros.length && !cons.length) return null;
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border border-success/30 bg-success/5 p-5">
        <h3 className="mb-3 font-semibold text-success">Lo mejor</h3>
        <ul className="space-y-2">
          {pros.map((p) => (
            <li key={p} className="flex gap-2 text-sm">
              <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
              {p}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
        <h3 className="mb-3 font-semibold text-destructive">Lo peor</h3>
        <ul className="space-y-2">
          {cons.map((c) => (
            <li key={c} className="flex gap-2 text-sm">
              <X className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
              {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
