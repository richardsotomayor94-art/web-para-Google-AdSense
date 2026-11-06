import { revalidateTag } from "next/cache";
import { isDatabaseConfigured } from "@/db";
import { checkApiKey } from "@/lib/api/auth";
import { logAutomation } from "@/lib/api/automation-log";
import { syncProducts } from "@/lib/api/products-sync";
import { authError, badRequest, dbNotConfigured, json, readJson, validationError } from "@/lib/api/responses";
import { productsSyncSchema } from "@/lib/api/schemas";
import { CACHE_TAGS } from "@/lib/data/tags";

/**
 * POST /api/v1/products/sync — entrada de productos desde n8n / Make.
 *
 * Cabecera: x-api-key: <API_SECRET_KEY>   → si no coincide: 401 Unauthorized
 * Cuerpo:   { "products": [{ "asin": "B0...", "title": "...", "price_current": 199.9, ... }] }
 *           o un array, o un único objeto. En lugar de `asin` se puede enviar
 *           `url` con cualquier enlace de producto de Amazon.
 *
 * Guarda o actualiza por ASIN en Neon PostgreSQL (Drizzle) e inyecta el
 * tag de afiliado en las URLs recibidas.
 */
export async function POST(request: Request) {
  const denied = authError(checkApiKey(request));
  if (denied) return denied;
  if (!isDatabaseConfigured) return dbNotConfigured();

  const body = await readJson(request);
  if (body === undefined) return badRequest("El cuerpo debe ser JSON válido");
  const normalized = Array.isArray(body)
    ? { products: body }
    : body && typeof body === "object" && ("asin" in body || "url" in body)
      ? { products: [body] }
      : body;

  const parsed = productsSyncSchema.safeParse(normalized);
  if (!parsed.success) return validationError(parsed.error);

  const startedAt = Date.now();
  const result = await syncProducts(parsed.data.products);

  if (result.created.length || result.updated.length) {
    revalidateTag(CACHE_TAGS.products, "max");
    revalidateTag(CACHE_TAGS.categories, "max");
  }

  const status = result.errors.length === 0 ? "success" : result.errors.length < parsed.data.products.length ? "partial" : "error";
  await logAutomation({
    source: "products_sync",
    status,
    itemsReceived: parsed.data.products.length,
    itemsCreated: result.created.length,
    itemsUpdated: result.updated.length,
    errors: result.errors.map((e) => `${e.asin}: ${e.error}`),
    startedAt,
  });

  return json(
    {
      ok: status !== "error",
      status,
      received: parsed.data.products.length,
      created: result.created,
      updated: result.updated,
      errors: result.errors,
    },
    { status: status === "error" ? 422 : 200 },
  );
}
