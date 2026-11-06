import "server-only";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export type Database = PostgresJsDatabase<typeof schema>;

declare global {
  var __ergotoplabDb: Database | undefined;
}

/** `true` cuando hay una base de datos configurada. Sin ella la web usa datos de demostración. */
export const isDatabaseConfigured = Boolean(process.env.DATABASE_URL);

/**
 * Cliente Drizzle perezoso y reutilizado entre invocaciones (evita agotar
 * conexiones en serverless). `prepare: false` es obligatorio con el
 * "Transaction pooler" de Supabase (PgBouncer).
 */
export function getDb(): Database {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL no está configurada");
  }
  if (!globalThis.__ergotoplabDb) {
    const client = postgres(url, { prepare: false, max: 5, idle_timeout: 20 });
    globalThis.__ergotoplabDb = drizzle(client, { schema });
  }
  return globalThis.__ergotoplabDb;
}

export { schema };
