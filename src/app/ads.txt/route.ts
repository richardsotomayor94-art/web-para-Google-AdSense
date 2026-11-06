/** /ads.txt — requerido por Google AdSense para autorizar al vendedor. */
export function GET() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const pub = client?.replace(/^ca-/, "");
  const body = pub ? `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n` : "# Configura NEXT_PUBLIC_ADSENSE_CLIENT_ID\n";
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
