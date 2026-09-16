import { supabase } from "@/lib/supabase";

export async function persistRecord(collection: string, row: { id: string }) {
  if (!supabase) return;
  await supabase.from("app_records").upsert({
    collection,
    id: row.id,
    payload: row,
    updated_at: new Date().toISOString(),
  });
}

export async function fetchRecords<T extends { id: string }>(collection: string): Promise<T[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from("app_records").select("payload").eq("collection", collection);
  if (error || !data) return [];
  return data.map((r) => r.payload as T);
}

export async function seedCollection(collection: string, rows: { id: string }[]) {
  if (!supabase || rows.length === 0) return;
  await supabase.from("app_records").upsert(
    rows.map((row) => ({
      collection,
      id: row.id,
      payload: row,
      updated_at: new Date().toISOString(),
    })),
  );
}
