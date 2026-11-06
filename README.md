# ErgoTopLab

> **Laboratorio de Análisis y Ergonomía para Setup y Teletrabajo** · [ergotoplab.com](https://ergotoplab.com)

Plataforma de afiliación + contenido (SEO/GEO) sobre **ergonomía y setup de teletrabajo** para el mercado hispanohablante. Se monetiza con **Google AdSense** (guías informativas) y **Amazon Afiliados** (reseñas y comparativas), con geotargeting Amazon.es / Amazon.com.

## Stack

| Capa | Tecnología |
| --- | --- |
| Framework | Next.js 16 (App Router, **Cache Components + Partial Prefetching**), TypeScript estricto |
| Estilos | Tailwind CSS v4 + componentes estilo shadcn/ui (`components.json` listo para `npx shadcn add`) |
| Datos | **Neon** (PostgreSQL serverless) + **Drizzle ORM** con el driver `@neondatabase/serverless` |
| SEO | Metadata API, JSON-LD, `sitemap.ts`, `robots.ts`, OG dinámicas con `next/og` (motor de `@vercel/og`), `/llms.txt` |
| Analítica | GA4 / GTM con `@next/third-parties/google`, tabla propia `click_analytics` |
| Tema | `next-themes` (claro / oscuro / sistema) |

## Conexiones externas (configuración mínima)

Sin SDKs externos: Amazon funciona con enlaces de afiliado (sin PA-API), n8n habla con la API por HTTP y la base de datos es Neon PostgreSQL vía `DATABASE_URL`.

| Variable | Dónde | Para qué |
| --- | --- | --- |
| `AMAZON_AFFILIATE_TAG_ES` | Vercel | Tag de Amazon.es (por defecto `ergotoplab-21`) |
| `AMAZON_AFFILIATE_TAG_US` | Vercel | Tag de Amazon.com (por defecto `ergotoplabus-20`) |
| `API_SECRET_KEY` | Vercel + n8n | Cabecera `x-api-key` de los webhooks (mín. 24 caracteres; el valor de ejemplo se rechaza con `503`) |
| `DATABASE_URL` | Vercel (valor copiado de Neon) | Cadena de conexión de Neon con pooling y `?sslmode=require` |
| `NEXT_PUBLIC_SITE_URL` | Vercel | `https://ergotoplab.com` |

```bash
npm run env:check            # lista el estado de cada variable (también se ejecuta antes de cada build)
npm run env:check -- --strict  # sale con error si falta alguna obligatoria
```

### Helper de enlaces de Amazon (`src/lib/amazon.ts`)

```ts
import { toAffiliateLink, toAffiliateUrl } from "@/lib/amazon";

toAffiliateLink("B0XXXXXXXX");
// { href: "https://www.amazon.es/dp/B0XXXXXXXX?tag=ergotoplab-21", rel: "sponsored nofollow noopener", target: "_blank", asin, marketplace }

toAffiliateUrl("https://www.amazon.com/Silla/dp/B0XXXXXXXX/ref=sr_1_3?th=1");
// "https://www.amazon.com/dp/B0XXXXXXXX?tag=ergotoplabus-20"   (limpia el tracking y pone tu tag)
```

- Acepta ASIN o cualquier URL de producto (`/dp/`, `/gp/product/`, `/gp/aw/d/`…), sustituye tags ajenos y conserva las URLs de búsqueda poniéndoles tu tag. Los enlaces cortos `amzn.to` se dejan tal cual.
- `<AmazonLink href="B0XXXXXXXX">` renderiza el `<a>` completo, y cualquier enlace a Amazon escrito en el Markdown de las guías se convierte automáticamente.
- Los enlaces de producto se recalculan en cada render, así que al cambiar un tag en Vercel (y redesplegar) se actualizan todos.

### n8n → `POST /api/v1/products/sync`

Nodo **HTTP Request**: método `POST`, URL `https://ergotoplab.com/api/v1/products/sync`, cabecera `x-api-key` = `API_SECRET_KEY`, body JSON. Basta con la URL de Amazon en lugar del ASIN:

```json
{ "url": "https://www.amazon.es/dp/B0XXXXXXXX", "title": "Silla X — …", "price_current": 199.9, "price_original": 249.9 }
```

Respuestas: `200` guardado o actualizado · `401` clave incorrecta o ausente · `422` datos inválidos · `503` falta `API_SECRET_KEY` o `DATABASE_URL`.

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # rellena los valores
npm run dev
```

Sin `DATABASE_URL` la web funciona en **modo demo** con datos ficticios (`src/lib/data/demo-data.ts`, ASIN `B0DEMO…`); las escrituras de la API devuelven `503`.

### Base de datos (Neon PostgreSQL)

1. Crea un proyecto en [Neon](https://neon.tech) (región `eu-central-1`, Fráncfort, si tu público está en España).
2. En **Connect**, copia la cadena con **Connection pooling activado** (host con `-pooler`) en `DATABASE_URL`. Debe acabar en `?sslmode=require` (Neon la incluye por defecto).
3. Opcional, pero recomendado: copia la misma cadena con el pooling **desactivado** (host sin `-pooler`) en `DATABASE_MIGRATION_URL`. Es la que usan las migraciones.
4. Crea las tablas y, si quieres, carga los datos de ejemplo:

```bash
npm run db:migrate
npm run db:seed
```

**Cómo se conecta.** La app usa `drizzle-orm/neon-serverless`: un `Pool` de `@neondatabase/serverless` que habla el protocolo de Postgres por WebSocket seguro (`wss://`), así que la conexión siempre va cifrada y admite transacciones (las usa `articles/publish`). Hay un único pool por instancia y `attachDatabasePool` (de `@vercel/functions`) cierra las conexiones inactivas antes de que Vercel suspenda la función. Configuración en `src/db/neon.ts` y `src/db/index.ts`.

**Migraciones.** `npm run db:generate` (drizzle-kit, sin conexión) crea el SQL en `drizzle/` a partir de `src/db/schema.ts`. `npm run db:migrate` (`scripts/migrate.ts`) lo aplica con el mismo driver de Neon, es idempotente y registra lo aplicado en `drizzle.__drizzle_migrations`. Ficheros actuales: `0000_init.sql` (tablas, índices, FK) y `0001_rls_and_triggers.sql` (triggers `updated_at` y RLS de solo lectura para roles que no sean el propietario, por si activas la Data API de Neon).

**Detrás de un proxy.** Si existe `HTTPS_PROXY`, `db:migrate` y `db:seed` abren el WebSocket de Neon a través de ese proxy (`scripts/neon-proxy-support.ts`). La app desplegada no lo usa.

**Ramas de Neon.** Puedes crear una rama de la base de datos para cada entorno (p. ej. `preview`) y poner su URL en las variables *Preview* de Vercel.

### Desarrollo local sin cuenta de Neon

El driver de Neon necesita un proxy WebSocket para hablar con un PostgreSQL normal. El repo incluye uno mínimo:

```bash
npm run db:proxy   # ws://127.0.0.1:5488/v1 → Postgres local (déjalo abierto)
```

```dotenv
# .env.local
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ergotoplab
NEON_LOCAL_WS_PROXY=localhost:5488/v1
```

Después usa `npm run db:migrate`, `npm run db:seed` y `npm run dev` como siempre. `NEON_LOCAL_WS_PROXY` se ignora en Vercel.

### Scripts

| Script | Uso |
| --- | --- |
| `dev` / `build` / `start` | Next.js |
| `lint` / `typecheck` | ESLint / `next typegen && tsc` |
| `db:generate` / `db:studio` | drizzle-kit (generar SQL / explorar datos) |
| `db:migrate` / `db:seed` | Aplicar migraciones / cargar datos de ejemplo en Neon |
| `db:proxy` | Proxy WebSocket para desarrollo local sin Neon |
| `env:check` | Estado de las variables de entorno |

## Arquitectura

```
src/
├─ app/
│  ├─ page.tsx                 Home (hero E-E-A-T, calculadora, categorías, destacados)
│  ├─ guias/[slug]             Guías (AdSense in-article + final, FAQPage, TechArticle)
│  ├─ resenas/[slug]           Reseñas (sin AdSense en el primer pliegue, Product + Review)
│  ├─ comparar/[slug]          A vs B (slug canónico ordenado, 308 si se invierte)
│  ├─ api/v1/…                 Webhooks n8n/Make (x-api-key)
│  ├─ api/track/click          Registro público de clics (sendBeacon)
│  ├─ llms.txt, llms-full.txt  Mapa y contenido íntegro para motores generativos
│  ├─ ads.txt, sitemap.ts, robots.ts, opengraph-image.tsx
├─ components/ (ui, product, article, ads, layout, seo, theme, tools)
├─ db/ (schema.ts, index.ts)
├─ lib/ (data, api, seo, amazon.ts, markdown.ts, analytics.ts)
└─ proxy.ts                    Cookie de país para el geotargeting
```

**Caché.** Todas las lecturas (`src/lib/data`) usan `"use cache"` + `cacheTag`. Las páginas se prerenderizan en build y los webhooks invalidan con `revalidateTag` (`products`, `articles`, `categories`), así que precios y artículos nuevos aparecen sin redeploy. Las rutas nuevas que no existían en build se generan en la primera visita y quedan cacheadas. Una URL inexistente responde la primera vez `200` con `noindex` y, desde la segunda, `404` real (lo mismo para las redirecciones `308` de comparativas invertidas).

**Geotargeting.** `proxy.ts` guarda el país (`x-vercel-ip-country`) en la cookie `eh_country`. `AffiliateButton` renderiza Amazon.es en el HTML estático y, tras hidratar, cambia a Amazon.com fuera de ES/PT/AD/GI. Así las páginas siguen siendo estáticas.

**Enlaces de afiliado.** Siempre `rel="sponsored nofollow noopener"` y `target="_blank"`. El tag se añade automáticamente (`AMAZON_AFFILIATE_TAG_ES/US`) aunque n8n envíe la URL sin él. Cada clic dispara `trackEvent('amazon_click', { asin, price, country, marketplace, placement })` en GA4 y se guarda en `click_analytics`.

**AdSense.** `<AdSenseBanner slot format responsive layout />` (cliente, alto reservado contra CLS). En guías se inserta automáticamente entre secciones `##` intermedias y al final. En reseñas solo aparece bajo el contenido principal. Configura los IDs de bloque con `NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE` y `NEXT_PUBLIC_ADSENSE_SLOT_DISPLAY`.

**Contenido.** Las guías son Markdown (GFM). El shortcode `{{product:ASIN}}` inserta una ficha de producto con CTA en ese punto del texto.

**JSON-LD.** `Organization` (ErgoTopLab, `https://ergotoplab.com`, logo PNG en `/logo.png`) + `WebSite` (global), `publisher` completo en artículos y reseñas, `BreadcrumbList`, `Product` + `Offer` + `Review` (nota editorial 0–10 con `positiveNotes` / `negativeNotes`), `TechArticle` con autor `Person` y credenciales, `FAQPage` e `ItemList`. No se emite `aggregateRating` con las valoraciones de Amazon: Google exige que las valoraciones procedan del propio sitio.

## API v1 (n8n / Make)

Todas requieren la cabecera `x-api-key: $API_SECRET_KEY` (comparación en tiempo constante). Cada llamada queda registrada en `automation_logs`.

### `POST /api/v1/products/sync`

Crea o actualiza por ASIN. Solo se modifican los campos enviados, así que la actualización diaria de precios puede mandar únicamente el precio. Acepta `{ products: [...] }`, un array o un único objeto (máx. 500).

```bash
curl -X POST https://ergotoplab.com/api/v1/products/sync \
  -H "x-api-key: $API_SECRET_KEY" -H "content-type: application/json" \
  -d '{
    "products": [
      {
        "asin": "B0XXXXXXXX",
        "title": "Silla X — Silla ergonómica con lumbar regulable",
        "price_current": 199.9, "price_original": 249.9,
        "category_slug": "sillas-ergonomicas",
        "image_url": "https://m.media-amazon.com/images/I/xxxx.jpg",
        "features": { "Reposabrazos": "4D" },
        "pros": ["…"], "cons": ["…"],
        "rating": 4.5, "review_count": 1200,
        "editorial_rating": 8.7, "badge": "Mejor Calidad-Precio"
      },
      { "asin": "B0YYYYYYYY", "price_current": 89.99 }
    ]
  }'
```

Respuesta: `{ ok, status: "success"|"partial"|"error", created[], updated[], errors[] }`. `discount_percent` se calcula solo si no se envía. Si la categoría no existe, se crea.

### `POST /api/v1/articles/publish`

Crea o actualiza por `slug` (se genera a partir del título si falta). Asocia productos por `related_asins`, por los shortcodes `{{product:ASIN}}` y, con `auto_link_products` (activo por defecto), por ASIN o nombres de producto citados en el texto.

```json
{
  "title": "Cómo elegir silla ergonómica",
  "content": "Intro…\n\n## Qué mirar\n\n{{product:B0XXXXXXXX}}",
  "excerpt": "…",
  "seo_title": "…", "seo_description": "…",
  "author": { "name": "Laura Méndez", "role": "Fisioterapeuta", "credentials": ["Grado en Fisioterapia"] },
  "faqs": [{ "question": "…", "answer": "…" }],
  "related_asins": ["B0XXXXXXXX"],
  "status": "published"
}
```

### `GET /api/v1/analytics/export`

`?from=2026-10-01&to=2026-10-31` (por defecto los últimos 30 días). Devuelve los totales y los clics agregados por producto, país, ubicación y día. Con `&format=csv` descarga los clics en bruto.

## Despliegue en Vercel

1. Importa el repo y configura las variables de `.env.example` (`NEXT_PUBLIC_SITE_URL=https://ergotoplab.com`, `NEXT_PUBLIC_SITE_NAME="ErgoTopLab"`). Añade `ergotoplab.com` como dominio principal en Vercel y redirige `www.ergotoplab.com` → `ergotoplab.com` para que coincida con la URL canónica. En los entornos Preview puedes sobrescribir `NEXT_PUBLIC_SITE_URL`.
2. Conecta Neon: añade `DATABASE_URL` a mano o instala la integración de Neon desde el Marketplace de Vercel, que crea la variable sola (comprueba que incluya `-pooler` y `sslmode=require`). El build se conecta a la base de datos para prerenderizar, así que la variable debe estar disponible también en build.
3. Antes del primer despliegue, crea las tablas en Neon desde tu ordenador con `npm run db:migrate`, usando la URL de producción en `.env.local`. Repite el comando cada vez que generes una migración nueva.
4. Comprueba `/ads.txt`, `/llms.txt`, `/sitemap.xml` y envía el sitemap a Search Console.

> **Edge Runtime:** Next.js 16 lo marca como obsoleto y no es compatible con Cache Components. Todo se ejecuta en el runtime Node.js por defecto (Vercel Fluid Compute), que es lo que recomienda Vercel.

## Pendiente antes de producción

- **CMP / consentimiento de cookies**: Google exige una CMP certificada (TCF v2.2) para servir AdSense en el EEE/Reino Unido. Puedes usar la de Google (AdSense → Privacidad y mensajes) o una externa.
- Completar los datos del titular en `/aviso-legal` y revisar `/privacidad` con un asesor legal.
- Sustituir los datos de demostración por productos reales vía `products/sync`.
