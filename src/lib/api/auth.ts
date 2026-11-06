import "server-only";
import { timingSafeEqual } from "node:crypto";

/** Valida la cabecera `x-api-key` contra `API_SECRET_KEY` en tiempo constante. */
export function isAuthorized(request: Request): boolean {
  const expected = process.env.API_SECRET_KEY;
  const provided = request.headers.get("x-api-key");
  if (!expected || !provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
