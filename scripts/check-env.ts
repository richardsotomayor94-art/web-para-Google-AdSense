/**
 * Lista las variables de entorno de ErgoTopLab y su estado.
 *   npm run env:check            → informe (nunca falla)
 *   npm run env:check -- --strict → sale con código 1 si falta alguna obligatoria
 *
 * Se ejecuta también antes de `npm run build` (en Vercel aparece en el log).
 * Nunca imprime valores secretos.
 */
import { randomBytes } from "node:crypto";
import { config } from "dotenv";

config({ path: [".env.local", ".env"], quiet: true });

type Where = "Vercel" | "Vercel (valor de Supabase)" | "Vercel (valor de Google)";
interface Var {
  name: string;
  required: boolean;
  where: Where;
  how: string;
  secret?: boolean;
  invalid?: (value: string) => string | null;
}

const VARS: Var[] = [
  {
    name: "AMAZON_AFFILIATE_TAG_ES",
    required: true,
    where: "Vercel",
    how: 'Tu tag de Amazon.es (p. ej. "ergotoplab-21"). Sin ella se usa ergotoplab-21.',
    invalid: (v) => (/^[\w-]+-21$/.test(v) ? null : "los tags de Amazon.es suelen acabar en -21"),
  },
  {
    name: "AMAZON_AFFILIATE_TAG_US",
    required: true,
    where: "Vercel",
    how: 'Tu tag de Amazon.com (p. ej. "ergotoplabus-20"). Sin ella se usa ergotoplabus-20.',
    invalid: (v) => (/^[\w-]+-20$/.test(v) ? null : "los tags de Amazon.com suelen acabar en -20"),
  },
  {
    name: "API_SECRET_KEY",
    required: true,
    where: "Vercel",
    how: "Clave para n8n (cabecera x-api-key). Genera: openssl rand -hex 32. Pon la misma en n8n.",
    secret: true,
    invalid: (v) =>
      v === "crea_una_clave_secreta_segura_aqui"
        ? "sigue con el valor de ejemplo"
        : v.length < 24
          ? "demasiado corta (mín. 24 caracteres)"
          : null,
  },
  {
    name: "DATABASE_URL",
    required: true,
    where: "Vercel (valor de Supabase)",
    how: 'Supabase → Project Settings → Database → Connection string → "Transaction pooler" (puerto 6543).',
    secret: true,
    invalid: (v) =>
      !/^postgres(ql)?:\/\//.test(v) ? "debe empezar por postgresql://" : v.includes("TU_PASSWORD") ? "contiene el valor de ejemplo" : null,
  },
  {
    name: "NEXT_PUBLIC_SITE_URL",
    required: true,
    where: "Vercel",
    how: "https://ergotoplab.com",
    invalid: (v) => (/^https:\/\/[^/]+$/.test(v) ? null : "usa https:// y sin barra final"),
  },
  { name: "NEXT_PUBLIC_SITE_NAME", required: false, where: "Vercel", how: '"ErgoTopLab" (valor por defecto).' },
  { name: "DATABASE_MIGRATION_URL", required: false, where: "Vercel (valor de Supabase)", how: "Conexión directa (puerto 5432) para migraciones.", secret: true },
  { name: "NEXT_PUBLIC_GA_ID", required: false, where: "Vercel (valor de Google)", how: "GA4 → Flujos de datos → ID de medición (G-…)." },
  { name: "NEXT_PUBLIC_GTM_ID", required: false, where: "Vercel (valor de Google)", how: "Google Tag Manager (GTM-…), si lo usas." },
  {
    name: "NEXT_PUBLIC_ADSENSE_CLIENT_ID",
    required: false,
    where: "Vercel (valor de Google)",
    how: "AdSense → Cuenta → ID de editor (ca-pub-…).",
    invalid: (v) => (/^ca-pub-\d{10,}$/.test(v) ? null : "formato ca-pub-XXXXXXXXXXXXXXXX"),
  },
  { name: "NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE", required: false, where: "Vercel (valor de Google)", how: "ID del bloque in-article." },
  { name: "NEXT_PUBLIC_ADSENSE_SLOT_DISPLAY", required: false, where: "Vercel (valor de Google)", how: "ID del bloque display." },
];

const color = process.stdout.isTTY && !process.env.NO_COLOR;
const paint = (code: number, s: string) => (color ? `\x1b[${code}m${s}\x1b[0m` : s);
const ok = paint(32, "✓");
const bad = paint(31, "✗");
const warn = paint(33, "!");
const dim = (s: string) => paint(2, s);

let missingRequired = 0;
const lines: string[] = [];

for (const section of [true, false]) {
  lines.push("", paint(1, section ? "OBLIGATORIAS" : "OPCIONALES"));
  for (const v of VARS.filter((x) => x.required === section)) {
    const value = process.env[v.name]?.trim() ?? "";
    let mark: string;
    let note = "";
    if (!value) {
      mark = v.required ? bad : dim("·");
      note = v.required ? "FALTA" : "sin definir";
      if (v.required) missingRequired++;
    } else {
      const problem = v.invalid?.(value) ?? null;
      if (problem) {
        mark = v.required ? bad : warn;
        note = problem;
        if (v.required) missingRequired++;
      } else {
        mark = ok;
        note = v.secret ? "definida" : value;
      }
    }
    lines.push(`  ${mark} ${v.name.padEnd(36)} ${note}`);
    lines.push(dim(`      ${v.where}: ${v.how}`));
  }
}

console.log(paint(1, "\nErgoTopLab · variables de entorno") + dim("  (leídas de .env.local / .env / entorno)"));
console.log(lines.join("\n"));
console.log(
  "\n" +
    dim(
      [
        "Dónde configurarlas:",
        "  • Vercel  → Project → Settings → Environment Variables (Production y Preview). Redeploy tras cambiarlas.",
        "  • Supabase → solo de ahí se copia DATABASE_URL; después aplica el esquema con `npm run db:migrate`.",
        "  • n8n     → nodo HTTP Request: POST https://ergotoplab.com/api/v1/products/sync, cabecera x-api-key = API_SECRET_KEY.",
      ].join("\n"),
    ),
);

const keyMissing = !process.env.API_SECRET_KEY || process.env.API_SECRET_KEY === "crea_una_clave_secreta_segura_aqui";
if (keyMissing && !process.env.CI && !process.env.VERCEL) {
  console.log(`\nSugerencia de API_SECRET_KEY (generada ahora, no se guarda): ${randomBytes(32).toString("hex")}`);
}

console.log(
  missingRequired
    ? `\n${bad} Faltan o son inválidas ${missingRequired} variable(s) obligatoria(s).\n`
    : `\n${ok} Todas las variables obligatorias están configuradas.\n`,
);

if (missingRequired && process.argv.includes("--strict")) process.exit(1);
