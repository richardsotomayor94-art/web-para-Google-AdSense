import { Breadcrumbs } from "./breadcrumbs";
import { Container } from "./container";

export function StaticPage({ title, path, intro, children }: { title: string; path: string; intro?: string; children: React.ReactNode }) {
  return (
    <Container className="max-w-3xl py-10">
      <Breadcrumbs items={[{ name: title, path }]} />
      <header className="mt-6 mb-8 space-y-3">
        <h1 className="text-4xl type-heading text-ink">{title}</h1>
        {intro && <p className="text-lg text-ink-3">{intro}</p>}
      </header>
      <div className="prose-eh">{children}</div>
    </Container>
  );
}
