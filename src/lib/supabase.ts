import { isSupabaseConfigured, supabase } from '../supabaseClient.js';

export { isSupabaseConfigured, supabase };

export function getSupabaseClient() {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Add the Supabase URL and publishable key to .env.');
  }

  return supabase;
}
