import { after } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb, isDatabaseConfigured, schema } from "@/db";

const payloadSchema = z.object({
  productId: z.string().max(64),
  asin: z.string().regex(/^[A-Z0-9]{10}$/),
  marketplace: z.enum(["es", "us"]),
  placement: z.string().max(40).optional(),
  path: z.string().max(500).optional(),
  referrer: z.string().max(1000).nullish(),
});

const BOT_UA = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless/i;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** POST /api/track/click — registro público de clics salientes (navigator.sendBeacon). */
export async function POST(request: Request) {
  const ua = request.headers.get("user-agent") ?? "";
  if (BOT_UA.test(ua)) return new Response(null, { status: 204 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(null, { status: 400 });
  }
  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) return new Response(null, { status: 400 });

  const country = (request.headers.get("x-vercel-ip-country") ?? request.headers.get("cf-ipcountry") ?? "").slice(0, 2).toUpperCase() || null;
  const data = parsed.data;

  if (!isDatabaseConfigured) {
    if (process.env.NODE_ENV !== "production") console.info("[click]", { ...data, country });
    return new Response(null, { status: 204 });
  }

  // Responder de inmediato y escribir después (no bloquea al usuario).
  after(async () => {
    try {
      const db = getDb();
      let productId: string | null = UUID.test(data.productId) ? data.productId : null;
      if (!productId) {
        const [row] = await db.select({ id: schema.products.id }).from(schema.products).where(eq(schema.products.asin, data.asin)).limit(1);
        productId = row?.id ?? null;
      }
      await db.insert(schema.clickAnalytics).values({
        productId,
        asin: data.asin,
        userCountry: country,
        marketplace: data.marketplace,
        referrer: data.referrer ?? null,
        pagePath: data.path ?? null,
        placement: data.placement ?? null,
      });
    } catch (error) {
      console.error("[click] error al registrar", error);
    }
  });

  return new Response(null, { status: 204 });
}
