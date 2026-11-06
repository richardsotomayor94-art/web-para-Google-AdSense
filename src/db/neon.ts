/**
 * Configuración compartida del driver de Neon (`@neondatabase/serverless`).
 * La usan la app (src/db/index.ts) y los scripts (migrate, seed).
 *
 * El driver habla el protocolo de Postgres sobre WebSocket seguro (wss://),
 * así que la conexión va siempre cifrada con TLS y funciona en entornos
 * serverless sin conexiones TCP persistentes.
 */
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

let configured = false;
let webSocketOverride: typeof ws | undefined;

/** Permite a los scripts sustituir el constructor de WebSocket (p. ej. para salir por un proxy HTTPS). */
export function setNeonWebSocket(ctor: typeof ws) {
  webSocketOverride = ctor;
  if (configured) neonConfig.webSocketConstructor = ctor;
}

function configureNeon() {
  if (configured) return;
  configured = true;

  // Node.js: constructor de WebSocket explícito (necesario para Pool/transacciones).
  neonConfig.webSocketConstructor = webSocketOverride ?? ws;

  /**
   * Desarrollo sin cuenta de Neon: `NEON_LOCAL_WS_PROXY=localhost:5488/v1`
   * enruta el driver a un Postgres local a través de `npm run db:proxy`.
   * Ignorado en Vercel.
   */
  const localProxy = process.env.NEON_LOCAL_WS_PROXY;
  if (localProxy && !process.env.VERCEL) {
    neonConfig.wsProxy = (host, port) => `${localProxy}?address=${host}:${port}`;
    neonConfig.useSecureWebSocket = false;
    neonConfig.pipelineTLS = false;
    neonConfig.pipelineConnect = false;
  }
}

/** Crea un Pool de Neon. En la app hay uno solo por instancia; en scripts, uno por ejecución. */
export function createNeonPool(connectionString: string, options: { max?: number; idleTimeoutMillis?: number } = {}) {
  configureNeon();
  return new Pool({
    connectionString,
    max: options.max ?? 5,
    idleTimeoutMillis: options.idleTimeoutMillis ?? 10_000,
    connectionTimeoutMillis: 10_000,
  });
}

/** Comprueba que la URL es de Neon con SSL activado (aviso, no bloqueante). */
export function describeConnectionString(url: string): { host: string; isNeon: boolean; sslRequired: boolean; pooled: boolean } {
  try {
    const parsed = new URL(url);
    const sslmode = parsed.searchParams.get("sslmode");
    return {
      host: parsed.hostname,
      isNeon: /\.neon\.tech$/i.test(parsed.hostname),
      sslRequired: sslmode === "require" || sslmode === "verify-full" || sslmode === "verify-ca",
      pooled: parsed.hostname.includes("-pooler"),
    };
  } catch {
    return { host: "", isNeon: false, sslRequired: false, pooled: false };
  }
}
