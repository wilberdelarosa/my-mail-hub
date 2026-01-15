import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string) => {
  const metaEnv = (import.meta as any)?.env || {};
  if (metaEnv[key]) return metaEnv[key] as string;
  if (typeof process !== 'undefined' && process?.env?.[key]) return process.env[key] as string;
  return undefined;
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL') || getEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY') || getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

if (!supabaseUrl) {
  throw new Error('Missing env: VITE_SUPABASE_URL');
}

if (!supabaseAnonKey) {
  throw new Error('Missing env: VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
