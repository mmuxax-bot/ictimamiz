import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL || 'https://pixvyrzckojqfyxjydcz.supabase.co';
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_BOwjzew3cwAds0zchXDfIA_gcxVXQnz';

export const supabase = createClient(url, key, {
  auth: { persistSession: false },
});
