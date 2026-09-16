import { supabase } from "@/lib/supabase";

export const COLLECTIONS = [
  "devices",
  "scenes",
  "automations",
  "notifications",
  "maintenance_items",
  "alerts",
  "service_tickets",
  "invoices",
  "notices",
  "facility_bookings",
  "service_requests",
  "floor_units",
  "floor_amenities",
] as const;

export type CollectionName = (typeof COLLECTIONS)[number];

export async function persistRecord(collection: string, row: { id: string }) {
  if (!supabase) return;
  await supabase.from("app_records").upsert({
    collection,
    id: row.id,
    payload: row,
    updated_at: new Date().toISOString(),
  });
}

export async function deleteRecord(collection: string, id: string) {
  if (!supabase) return;
  await supabase.from("app_records").delete().eq("collection", collection).eq("id", id);
}

export async function fetchRecords<T extends { id: string }>(collection: string): Promise<T[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from("app_records").select("payload").eq("collection", collection);
  if (error || !data) return [];
  return data.map((r) => r.payload as T);
}

export async function seedCollection(collection: string, rows: { id: string }[]) {
  if (!supabase || rows.length === 0) return;
  const chunk = 80;
  for (let i = 0; i < rows.length; i += chunk) {
    const slice = rows.slice(i, i + chunk);
    await supabase.from("app_records").upsert(
      slice.map((row) => ({
        collection,
        id: row.id,
        payload: row,
        updated_at: new Date().toISOString(),
      })),
    );
  }
}

export async function hydrateAll(): Promise<Record<string, { id: string }[]>> {
  const out: Record<string, { id: string }[]> = {};
  await Promise.all(
    COLLECTIONS.map(async (collection) => {
      out[collection] = await fetchRecords(collection);
    }),
  );
  return out;
}

export function subscribeRecords(onRow: (collection: string, payload: { id: string }) => void) {
  if (!supabase) return () => undefined;
  const channel = supabase
    .channel("nestura-app-records")
    .on("postgres_changes", { event: "*", schema: "public", table: "app_records" }, (msg) => {
      const rec = msg.new as { collection?: string; payload?: { id: string } } | null;
      if (rec?.collection && rec.payload?.id) onRow(rec.collection, rec.payload);
    })
    .subscribe();
  return () => {
    if (supabase) void supabase.removeChannel(channel);
  };
}
