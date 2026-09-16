import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseEnabled = Boolean(url && anonKey);

/**
 * Only the publishable/anon key ever reaches the client — it's designed to
 * be public. Anything privileged (service_role key, direct DB access) stays
 * server-side, never here.
 */
export const supabase = supabaseEnabled ? createClient(url, anonKey) : null;
