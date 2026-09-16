/**
 * Creates demo Auth users via the publishable key (signUp).
 * Run: node scripts/seed-demo-accounts.mjs
 */
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
dotenv.config({ path: path.join(root, ".env.local") });
dotenv.config({ path: path.join(root, "server", ".env") });

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const password = "NesturaDemo!2026";

const accounts = [
  { email: "john.owner@example.com", name: "John Perera", role: "resident", tier: "owner" },
  { email: "resident@example.com", name: "Alex Perera", role: "resident", tier: "occupier" },
  { email: "sarah.tenant@example.com", name: "Sarah Fernando", role: "resident", tier: "tenant" },
  { email: "david.household@example.com", name: "David Perera", role: "resident", tier: "occupier" },
  { email: "operator@example.com", name: "Maya Jayawardena", role: "operator", cctv: true },
  { email: "developer@example.com", name: "Arjun Keells", role: "developer" },
  { email: "visitor@example.com", name: "Priya Silva", role: "visitor" },
];

if (!url || !key) {
  console.error("Missing Supabase URL or publishable key.");
  process.exit(1);
}

const supabase = createClient(url, key);

for (const account of accounts) {
  const { data, error } = await supabase.auth.signUp({
    email: account.email,
    password,
    options: { data: account },
  });
  if (error) {
    console.log(`${account.email}: ${error.message}`);
  } else {
    console.log(`${account.email}: ${data.user ? "created/signed" : "pending confirmation"}`);
  }
}
