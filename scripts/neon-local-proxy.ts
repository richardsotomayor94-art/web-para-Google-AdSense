/**
 * Proxy WebSocket → TCP para desarrollar contra un PostgreSQL local con el
 * driver de Neon (equivalente mínimo de https://github.com/neondatabase/wsproxy).
 *
 *   npm run db:proxy                       # escucha en ws://localhost:5488/v1
 *   NEON_LOCAL_WS_PROXY=localhost:5488/v1  # en .env.local
 *   DATABASE_URL=postgresql://user:pass@localhost:5432/ergotoplab
 *
 * Solo permite destinos locales. No lo uses en producción.
 */
import net from "node:net";
import { WebSocketServer } from "ws";

const PORT = Number(process.env.NEON_LOCAL_PROXY_PORT ?? 5488);
const ALLOWED_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

const wss = new WebSocketServer({ port: PORT, path: "/v1", host: "127.0.0.1" });

wss.on("connection", (socket, request) => {
  const address = new URL(request.url ?? "", "http://localhost").searchParams.get("address") ?? "";
  const separator = address.lastIndexOf(":");
  const host = address.slice(0, separator);
  const port = Number(address.slice(separator + 1));
  if (!ALLOWED_HOSTS.has(host) || !port) {
    socket.close(1008, "destino no permitido");
    return;
  }

  const tcp = net.connect({ host, port });
  tcp.on("data", (chunk) => socket.readyState === socket.OPEN && socket.send(chunk));
  tcp.on("close", () => socket.close());
  tcp.on("error", () => socket.close());
  socket.on("message", (data) => tcp.write(data as Buffer));
  socket.on("close", () => tcp.destroy());
  socket.on("error", () => tcp.destroy());
});

wss.on("listening", () => console.log(`Neon local WS proxy → ws://127.0.0.1:${PORT}/v1 (destinos: localhost)`));
