-- ──────────────────────────────────────────────────────────────
-- updated_at automático también para escrituras fuera del ORM
-- (SQL Editor de Supabase, n8n con conexión directa, etc.)
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
-- Row Level Security (Supabase)
-- La app accede con la conexión Postgres del servidor (rol con BYPASSRLS).
-- Activamos RLS para que la API REST pública de Supabase (anon key) solo
-- pueda LEER contenido publicado y nunca escribir ni ver analítica/logs.
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
