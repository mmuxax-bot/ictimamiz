import { supabase } from "./supabase-client";

export async function testSupabaseConnection() {
  const res = await supabase.from("meclis_qeydler").select("id").limit(1);
  if (res.error) {
    console.error("[supabase] bağlantı xətası:", res.error.message);
    return false;
  }
  return true;
}
