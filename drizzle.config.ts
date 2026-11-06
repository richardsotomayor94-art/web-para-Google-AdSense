import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: [".env.local", ".env"], quiet: true });

/**
 * drizzle-kit se usa para GENERAR migraciones (`npm run db:generate`, sin
 * conexión) y para `npm run db:studio`. Las migraciones se APLICAN con
 * `npm run db:migrate` (scripts/migrate.ts), que usa el driver de Neon.
 */
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // Neon: conexión directa (host sin "-pooler") con ?sslmode=require
    url: process.env.DATABASE_MIGRATION_URL || process.env.DATABASE_URL || "",
  },
  strict: true,
  verbose: true,
});
