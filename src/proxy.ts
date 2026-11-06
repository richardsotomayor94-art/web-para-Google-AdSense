import { NextResponse, type NextRequest } from "next/server";
import { COUNTRY_COOKIE } from "@/lib/amazon";

/**
 * Geotargeting de enlaces de afiliado sin romper el HTML estático:
 * guarda el país del visitante (cabecera de Vercel/Cloudflare) en una cookie
 * legible por el cliente. `AffiliateButton` la usa para elegir Amazon.es o .com.
 */
export function proxy(request: NextRequest) {
  const country = (request.headers.get("x-vercel-ip-country") ?? request.headers.get("cf-ipcountry") ?? "")
    .slice(0, 2)
    .toUpperCase();
  const response = NextResponse.next();
  if (/^[A-Z]{2}$/.test(country) && request.cookies.get(COUNTRY_COOKIE)?.value !== country) {
    response.cookies.set(COUNTRY_COOKIE, country, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
      secure: request.nextUrl.protocol === "https:",
    });
  }
  return response;
}

export const config = {
  matcher: [
    // Solo páginas HTML: excluye API, estáticos, imágenes y ficheros de texto
    "/((?!api|_next/static|_next/image|.*\\.(?:txt|xml|ico|png|jpg|jpeg|svg|webp|avif)$).*)",
  ],
};
