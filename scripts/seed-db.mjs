import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const envPath = path.join(root, ".env.local");
const env = Object.fromEntries(
  fs
    .readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .filter((line) => line.includes("=") && !line.trim().startsWith("#"))
    .map((line) => {
      const i = line.indexOf("=");
      return [line.slice(0, i).trim(), line.slice(i + 1).trim().replace(/^"|"$/g, "")];
    }),
);

const url = env.VITE_SUPABASE_URL;
const key = env.VITE_SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key);

const rows = [
  { collection: "service_requests", id: "sr1", payload: { id: "sr1", unitId: "12A", residentName: "John Perera", kind: "cleaning", requestedAt: "Today, 09:15", scheduledFor: "Today, 2:00 PM", notes: "Standard clean of 2BR unit.", status: "pending" } },
  { collection: "service_requests", id: "sr2", payload: { id: "sr2", unitId: "8F", residentName: "Amara Silva", kind: "maintenance", requestedAt: "Today, 08:40", scheduledFor: "Tomorrow, 10:00 AM", notes: "AC not cooling below 26°C.", status: "pending" } },
  { collection: "service_requests", id: "sr3", payload: { id: "sr3", unitId: "18B", residentName: "Saman Liyanage", kind: "moving", requestedAt: "Yesterday, 17:30", scheduledFor: "Sat, 9:00 AM", notes: "Move-in coordination.", status: "scheduled" } },
  { collection: "notifications", id: "n-seed-1", payload: { id: "n-seed-1", icon: "Sparkles", title: "Nestura is live", body: "Demo records were written to Supabase.", time: "Just now", read: false, category: "ai" } },
];

const { error } = await supabase.from("app_records").upsert(
  rows.map((r) => ({ ...r, updated_at: new Date().toISOString() })),
);
if (error) {
  console.error("Seed failed:", error.message);
  process.exit(1);
}
console.log(`Seeded ${rows.length} demo rows into app_records.`);
