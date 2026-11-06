/**
 * Aplica las migraciones SQL de ./drizzle a la base de datos de Neon
 * usando el mismo driver que la app (@neondatabase/serverless).
 *   npm run db:migrate
 * Usa DATABASE_MIGRATION_URL (conexión directa, recomendada) o DATABASE_URL.
 */
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-serverless";
import { migrate } from "drizzle-orm/neon-serverless/migrator";
import { createNeonPool, describeConnectionString } from "../src/db/neon";

config({ path: [".env.local", ".env"], quiet: true });

async function main() {
  const url = process.env.DATABASE_MIGRATION_URL || process.env.DATABASE_URL;
  if (!url) throw new Error("Define DATABASE_URL (o DATABASE_MIGRATION_URL) en .env.local");

  const info = describeConnectionString(url);
  console.log(`→ Migrando ${info.host || "(host desconocido)"}${info.pooled ? " (pooled)" : ""}`);
  if (info.isNeon && !info.sslRequired) console.warn("  ⚠ Añade ?sslmode=require a la URL de Neon.");
  if (info.pooled) console.warn("  ⚠ Para migraciones se recomienda la conexión directa (host sin -pooler) en DATABASE_MIGRATION_URL.");

  const pool = createNeonPool(url, { max: 1 });
  const started = Date.now();
  try {
    await migrate(drizzle({ client: pool }), { migrationsFolder: "./drizzle" });
    console.log(`✓ Migraciones aplicadas en ${Date.now() - started} ms`);
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error("✗ Error en la migración:", error instanceof Error ? error.message : error);
  process.exit(1);
});
