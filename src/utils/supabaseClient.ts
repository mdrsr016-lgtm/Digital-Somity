import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found in environment variables. Database features will be disabled.');
}

/**
 * Creates a recursive proxy that prevents the app from crashing 
 * when calling methods on a non-existent Supabase client.
 */
const createDummyClient = () => {
  const dummy: any = new Proxy(() => dummy, {
    get: (_target, prop) => {
      // Handle the client being used as a promise or function
      if (prop === 'then') return undefined; 
      return dummy;
    },
    apply: () => dummy
  });
  return dummy;
};

// Export the real client if credentials exist, otherwise the dummy proxy.
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : createDummyClient();
