import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/lib/types";

export function FaqSection({ faqs, title = "Preguntas frecuentes" }: { faqs: FaqItem[]; title?: string }) {
  if (!faqs.length) return null;
  return (
    <section aria-labelledby="faq" className="mt-12">
      <h2 id="faq" className="mb-4 type-heading text-2xl text-ink">
        {title}
      </h2>
      <div className="divide-y rounded-xl border">
        {faqs.map((f) => (
          <details key={f.question} className="group p-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-4 font-medium">
              <h3 className="text-base">{f.question}</h3>
              <ChevronDown className="size-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden />
            </summary>
            <p className="mt-3 text-ink-3">{f.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
