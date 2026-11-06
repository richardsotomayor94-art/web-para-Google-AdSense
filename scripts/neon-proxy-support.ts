/**
 * Solo para scripts (migrate, seed): si existe HTTPS_PROXY, el WebSocket del
 * driver de Neon sale por ese proxy. Útil detrás de proxies corporativos o en
 * contenedores sin salida directa a internet. La app (Vercel) no lo usa.
 */
import { HttpsProxyAgent } from "https-proxy-agent";
import ws from "ws";
import { setNeonWebSocket } from "../src/db/neon";

export function useHttpsProxyIfConfigured(): void {
  const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
  if (!proxy || process.env.NEON_LOCAL_WS_PROXY) return;
  const agent = new HttpsProxyAgent(proxy);
  class ProxiedWebSocket extends ws {
    constructor(address: string | URL, protocols?: string | string[]) {
      super(address, protocols, { agent });
    }
  }
  setNeonWebSocket(ProxiedWebSocket as unknown as typeof ws);
}
