import { createClient } from "@supabase/supabase-js";

// Paste your Supabase project URL here, or set VITE_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_URL in .env.
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  "{{SUPABASE_URL}}";

// Paste your Supabase public/publishable key here, or set it in .env.
const SUPABASE_PUBLIC_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "{{SUPABASE_KEY}}";

export const isSupabaseConfigured =
  Boolean(SUPABASE_URL) &&
  Boolean(SUPABASE_PUBLIC_KEY) &&
  !SUPABASE_URL.includes("{{") &&
  !SUPABASE_PUBLIC_KEY.includes("{{") &&
  !SUPABASE_URL.includes("example.supabase.co") &&
  SUPABASE_PUBLIC_KEY !== "public-anon-key" &&
  SUPABASE_PUBLIC_KEY !== "your-anon-key" &&
  SUPABASE_PUBLIC_KEY !== "your-publishable-key";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
