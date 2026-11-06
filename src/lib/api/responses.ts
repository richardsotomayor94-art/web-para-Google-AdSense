import type { ZodError } from "zod";
import type { ApiAuthResult } from "./auth";

export const json = (data: unknown, init?: ResponseInit) =>
  Response.json(data, { ...init, headers: { "cache-control": "no-store", ...init?.headers } });

export const unauthorized = () =>
  json(
    { ok: false, error: "unauthorized", message: "401 Unauthorized: cabecera x-api-key inválida o ausente" },
    { status: 401, headers: { "www-authenticate": 'ApiKey header="x-api-key"' } },
  );

export const apiKeyNotConfigured = () =>
  json(
    {
      ok: false,
      error: "api_key_not_configured",
      message: "Define API_SECRET_KEY (mín. 24 caracteres, distinta del valor de ejemplo) en las variables de entorno.",
    },
    { status: 503 },
  );

/** Devuelve la respuesta de error de autenticación, o `null` si la petición está autorizada. */
export function authError(result: ApiAuthResult): Response | null {
  if (result === "ok") return null;
  return result === "not_configured" ? apiKeyNotConfigured() : unauthorized();
}

export const dbNotConfigured = () =>
  json(
    { ok: false, error: "database_not_configured", message: "Define DATABASE_URL para habilitar las escrituras." },
    { status: 503 },
  );

export const validationError = (error: ZodError) =>
  json({ ok: false, error: "validation_error", issues: error.issues }, { status: 422 });

export const badRequest = (message: string) => json({ ok: false, error: "bad_request", message }, { status: 400 });

export async function readJson(request: Request): Promise<unknown | undefined> {
  try {
    return await request.json();
  } catch {
    return undefined;
  }
}
