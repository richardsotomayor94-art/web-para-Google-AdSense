import { revalidateTag } from "next/cache";
import { isDatabaseConfigured } from "@/db";
import { publishArticle } from "@/lib/api/articles-publish";
import { checkApiKey } from "@/lib/api/auth";
import { logAutomation } from "@/lib/api/automation-log";
import { authError, badRequest, dbNotConfigured, json, readJson, validationError } from "@/lib/api/responses";
import { articlePublishSchema } from "@/lib/api/schemas";
import { CACHE_TAGS } from "@/lib/data/tags";
import { absoluteUrl } from "@/lib/site";

/**
 * POST /api/v1/articles/publish
 * Cabecera: x-api-key: <API_SECRET_KEY>
 * Cuerpo:   { "title": "...", "content": "Markdown con {{product:B0XXXXXXX}}", "faqs": [...], ... }
 * Crea o actualiza (por slug) y asocia productos automáticamente.
 */
export async function POST(request: Request) {
  const denied = authError(checkApiKey(request));
  if (denied) return denied;
  if (!isDatabaseConfigured) return dbNotConfigured();

  const body = await readJson(request);
  if (body === undefined) return badRequest("El cuerpo debe ser JSON válido");
  const parsed = articlePublishSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const startedAt = Date.now();
  try {
    const result = await publishArticle(parsed.data);
    revalidateTag(CACHE_TAGS.articles, "max");
    revalidateTag(`article:${result.slug}`, { expire: 0 });

    await logAutomation({
      source: "articles_publish",
      status: "success",
      itemsReceived: 1,
      itemsCreated: result.created ? 1 : 0,
      itemsUpdated: result.created ? 0 : 1,
      startedAt,
    });

    return json(
      { ok: true, ...result, url: result.status === "published" ? absoluteUrl(`/guias/${result.slug}`) : null },
      { status: result.created ? 201 : 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await logAutomation({ source: "articles_publish", status: "error", itemsReceived: 1, errors: [message], startedAt });
    return json({ ok: false, error: "publish_failed", message }, { status: 500 });
  }
}
