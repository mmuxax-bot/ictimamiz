import { supabase } from './supabase-client';

export async function testSupabaseConnection() {
  console.log('[test] Supabase-e qoshulur...');
  const res = await supabase.from('meclis_qeydler').select('id').limit(1);
  if (res.error) {
    console.error('[test] XETA:', res.error.message, res.error);
    return false;
  }
  console.log('[test] UQURLU! Meclis sayi:', res.data?.length ?? 0);
  return true;
}
