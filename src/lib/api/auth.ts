import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";

/** Valor de ejemplo de `.env.example`: nunca se acepta como clave real. */
export const API_KEY_PLACEHOLDER = "crea_una_clave_secreta_segura_aqui";
const MIN_KEY_LENGTH = 24;

export type ApiAuthResult = "ok" | "unauthorized" | "not_configured";

/** La clave del servidor solo cuenta como configurada si es larga y no es la de ejemplo. */
export function isApiKeyConfigured(): boolean {
  const key = process.env.API_SECRET_KEY?.trim();
  return Boolean(key && key !== API_KEY_PLACEHOLDER && key.length >= MIN_KEY_LENGTH);
}

const digest = (value: string) => createHash("sha256").update(value).digest();

/**
 * Valida la cabecera `x-api-key` contra `API_SECRET_KEY`.
 * Compara los hashes SHA-256 en tiempo constante (no filtra ni la longitud).
 */
export function checkApiKey(request: Request): ApiAuthResult {
  if (!isApiKeyConfigured()) return "not_configured";
  const provided = request.headers.get("x-api-key")?.trim();
  if (!provided) return "unauthorized";
  return timingSafeEqual(digest(provided), digest(process.env.API_SECRET_KEY!.trim())) ? "ok" : "unauthorized";
}
