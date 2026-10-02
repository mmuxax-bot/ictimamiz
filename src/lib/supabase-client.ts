import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://pixvyrzckojqfyxjydcz.supabase.co',
  'sb_publishable_BOwjzew3cwAds0zchXDfIA_gcxVXQnz',
  { auth: { persistSession: false } }
);

console.log('[supabase] client hazir:', 'https://pixvyrzckojqfyxjydcz.supabase.co');
