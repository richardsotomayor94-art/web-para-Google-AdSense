-- ──────────────────────────────────────────────────────────────
-- updated_at automático también para escrituras fuera del ORM
-- (SQL Editor de Neon, n8n con conexión directa, etc.)
-- ──────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint
CREATE TRIGGER categories_set_updated_at BEFORE UPDATE ON "categories" FOR EACH ROW EXECUTE FUNCTION set_updated_at();
--> statement-breakpoint
CREATE TRIGGER products_set_updated_at BEFORE UPDATE ON "products" FOR EACH ROW EXECUTE FUNCTION set_updated_at();
--> statement-breakpoint
CREATE TRIGGER articles_set_updated_at BEFORE UPDATE ON "articles" FOR EACH ROW EXECUTE FUNCTION set_updated_at();
--> statement-breakpoint

-- ──────────────────────────────────────────────────────────────
-- Row Level Security
-- La app se conecta con el rol propietario de las tablas, que no está sujeto
-- a RLS, así que no le afecta. Si en el futuro activas la Data API de Neon
-- (o creas roles de solo lectura), esos roles solo podrán LEER contenido
-- publicado y nunca escribir ni ver analítica/logs.
-- ──────────────────────────────────────────────────────────────
ALTER TABLE "categories" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "products" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "articles" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "article_products" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "click_analytics" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "automation_logs" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY "public read categories" ON "categories" FOR SELECT USING (true);
--> statement-breakpoint
CREATE POLICY "public read products" ON "products" FOR SELECT USING (true);
--> statement-breakpoint
CREATE POLICY "public read published articles" ON "articles" FOR SELECT USING (status = 'published');
--> statement-breakpoint
CREATE POLICY "public read article_products" ON "article_products" FOR SELECT USING (true);
