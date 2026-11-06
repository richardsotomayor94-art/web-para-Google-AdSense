import "server-only";
import { attachDatabasePool } from "@vercel/functions";
import { drizzle, type NeonDatabase } from "drizzle-orm/neon-serverless";
import { createNeonPool } from "./neon";
import * as schema from "./schema";

export type Database = NeonDatabase<typeof schema>;

declare global {
  var __ergotoplabDb: Database | undefined;
}

/** `true` cuando hay una base de datos configurada. Sin ella la web usa datos de demostración. */
export const isDatabaseConfigured = Boolean(process.env.DATABASE_URL);

/**
 * Cliente Drizzle sobre Neon Serverless (Pool por WebSocket, admite transacciones).
 *
 * Se crea una sola vez por instancia. `attachDatabasePool` (Vercel Fluid
 * Compute) mantiene viva la función el tiempo justo para cerrar las conexiones
 * inactivas antes de suspenderla; fuera de Vercel no hace nada.
 */
export function getDb(): Database {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL no está configurada");
  }
  if (!globalThis.__ergotoplabDb) {
    const pool = createNeonPool(url);
    attachDatabasePool(pool);
    globalThis.__ergotoplabDb = drizzle({ client: pool, schema });
  }
  return globalThis.__ergotoplabDb;
}

export { schema };
