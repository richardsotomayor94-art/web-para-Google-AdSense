import "server-only";
import { getDb, schema } from "@/db";

type Source = (typeof schema.automationSource.enumValues)[number];

export async function logAutomation(entry: {
  source: Source;
  status: "success" | "partial" | "error";
  itemsReceived?: number;
  itemsCreated?: number;
  itemsUpdated?: number;
  errors?: string[];
  startedAt: number;
}): Promise<void> {
  try {
    await getDb()
      .insert(schema.automationLogs)
      .values({
        source: entry.source,
        status: entry.status,
        itemsReceived: entry.itemsReceived ?? 0,
        itemsCreated: entry.itemsCreated ?? 0,
        itemsUpdated: entry.itemsUpdated ?? 0,
        errors: entry.errors?.slice(0, 100) ?? [],
        durationMs: Date.now() - entry.startedAt,
      });
  } catch (error) {
    console.error("[automation-log] no se pudo registrar", error);
  }
}
