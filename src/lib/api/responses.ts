import type { ZodError } from "zod";

export const json = (data: unknown, init?: ResponseInit) =>
  Response.json(data, { ...init, headers: { "cache-control": "no-store", ...init?.headers } });

export const unauthorized = () => json({ ok: false, error: "unauthorized", message: "x-api-key inválida o ausente" }, { status: 401 });

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
