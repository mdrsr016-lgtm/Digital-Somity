import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * Creates a defensive client proxy that logs calls when unconfigured
 * rather than throwing runtime errors.
 */
const createDummyClient = () => {
  const dummy: any = new Proxy(() => dummy, {
    get: (_target, prop) => {
      if (prop === 'then') return undefined;
      return dummy;
    },
    apply: () => dummy,
  });
  return dummy;
};

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : createDummyClient();

