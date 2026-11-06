import { and, count, desc, eq, gte, lte, sql } from "drizzle-orm";
import { getDb, isDatabaseConfigured, schema } from "@/db";
import { isAuthorized } from "@/lib/api/auth";
import { badRequest, dbNotConfigured, json, unauthorized } from "@/lib/api/responses";

const DAY = 86_400_000;

/**
 * GET /api/v1/analytics/export?from=2026-10-01&to=2026-10-31&format=json|csv
 * Cabecera: x-api-key: <API_SECRET_KEY>
 * Por defecto devuelve los últimos 30 días agregados por producto, país, ubicación y día.
 * Con `format=csv` devuelve los clics en bruto.
 */
export async function GET(request: Request) {
  if (!isAuthorized(request)) return unauthorized();
  if (!isDatabaseConfigured) return dbNotConfigured();

  const params = new URL(request.url).searchParams;
  const to = params.get("to") ? new Date(params.get("to")!) : new Date();
  const from = params.get("from") ? new Date(params.get("from")!) : new Date(to.getTime() - 30 * DAY);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return badRequest("Fechas `from`/`to` inválidas (ISO 8601)");
  if (params.get("to") && params.get("to")!.length <= 10) to.setUTCHours(23, 59, 59, 999);

  const db = getDb();
  const c = schema.clickAnalytics;
  const p = schema.products;
  const range = and(gte(c.timestamp, from), lte(c.timestamp, to));

  if (params.get("format") === "csv") {
    const rows = await db
      .select({
        timestamp: c.timestamp,
        asin: c.asin,
        title: p.title,
        country: c.userCountry,
        marketplace: c.marketplace,
        placement: c.placement,
        page: c.pagePath,
        referrer: c.referrer,
      })
      .from(c)
      .leftJoin(p, eq(c.productId, p.id))
      .where(range)
      .orderBy(desc(c.timestamp))
      .limit(50_000);
    const esc = (v: unknown) => {
      const s = v == null ? "" : v instanceof Date ? v.toISOString() : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const header = ["timestamp", "asin", "title", "country", "marketplace", "placement", "page", "referrer"];
    const csv = [header.join(","), ...rows.map((r) => header.map((h) => esc(r[h as keyof typeof r])).join(","))].join("\n");
    return new Response(csv, {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="clicks_${from.toISOString().slice(0, 10)}_${to.toISOString().slice(0, 10)}.csv"`,
        "cache-control": "no-store",
      },
    });
  }

  const day = sql<string>`to_char(date_trunc('day', ${c.timestamp}), 'YYYY-MM-DD')`;
  const [[totals], byProduct, byCountry, byPlacement, byDay] = await Promise.all([
    db.select({ clicks: count() }).from(c).where(range),
    db
      .select({ productId: c.productId, asin: c.asin, title: p.title, slug: p.slug, price: p.priceCurrent, clicks: count() })
      .from(c)
      .leftJoin(p, eq(c.productId, p.id))
      .where(range)
      .groupBy(c.productId, c.asin, p.title, p.slug, p.priceCurrent)
      .orderBy(desc(count())),
    db.select({ country: c.userCountry, clicks: count() }).from(c).where(range).groupBy(c.userCountry).orderBy(desc(count())),
    db.select({ placement: c.placement, clicks: count() }).from(c).where(range).groupBy(c.placement).orderBy(desc(count())),
    db.select({ day, clicks: count() }).from(c).where(range).groupBy(day).orderBy(day),
  ]);

  return json({
    ok: true,
    range: { from: from.toISOString(), to: to.toISOString() },
    totals: { clicks: totals?.clicks ?? 0 },
    byProduct,
    byCountry,
    byPlacement,
    byDay,
  });
}
