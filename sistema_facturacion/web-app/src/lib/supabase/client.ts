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
  throw new Error(
    'Missing env: VITE_SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL). ' +
      'Set it in sistema_facturacion/web-app/.env.local (or .env) and restart the dev server.',
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    'Missing env: VITE_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY). ' +
      'Set it in sistema_facturacion/web-app/.env.local (or .env) and restart the dev server.',
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
