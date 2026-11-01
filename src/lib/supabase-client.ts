import { createClient } from "@supabase/supabase-js";

// Public (anon / publishable) credentials only — never put service-role keys here.
const DEFAULT_URL = "https://fdftfczxteyfjpbfonfc.supabase.co";
const DEFAULT_KEY = "sb_publishable_XXZ7R1pJ6e2Y9I5_oEy2Bw_ID7zBlXN";

const env = (import.meta as any).env ?? {};
export const SUPABASE_URL: string = env.VITE_SUPABASE_URL || DEFAULT_URL;
export const SUPABASE_ANON_KEY: string = env.VITE_SUPABASE_ANON_KEY || DEFAULT_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});
