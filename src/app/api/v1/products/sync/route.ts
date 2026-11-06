import { revalidateTag } from "next/cache";
import { isDatabaseConfigured } from "@/db";
import { isAuthorized } from "@/lib/api/auth";
import { logAutomation } from "@/lib/api/automation-log";
import { syncProducts } from "@/lib/api/products-sync";
import { badRequest, dbNotConfigured, json, readJson, unauthorized, validationError } from "@/lib/api/responses";
import { productsSyncSchema } from "@/lib/api/schemas";
import { CACHE_TAGS } from "@/lib/data/tags";

/**
 * POST /api/v1/products/sync
 * Cabecera: x-api-key: <API_SECRET_KEY>
 * Cuerpo:   { "products": [{ "asin": "B0...", "title": "...", "price_current": 199.9, ... }] }
 * También acepta un array directamente o un único objeto producto.
 */
export async function POST(request: Request) {
  if (!isAuthorized(request)) return unauthorized();
  if (!isDatabaseConfigured) return dbNotConfigured();

  const body = await readJson(request);
  if (body === undefined) return badRequest("El cuerpo debe ser JSON válido");
  const normalized = Array.isArray(body)
    ? { products: body }
    : body && typeof body === "object" && "asin" in body
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
