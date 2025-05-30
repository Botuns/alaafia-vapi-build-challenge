import { createClient } from "@supabase/supabase-js";

// For client-side usage (with auth)
const createBrowserClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

  return createClient(supabaseUrl, supabaseAnonKey);
};

// For server-side usage (with service role if needed)
const createServerClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL as string;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

  return createClient(supabaseUrl, supabaseServiceKey);
};

// Singleton pattern for client-side to prevent multiple instances
let browserClient: ReturnType<typeof createClient> | null = null;

export const getSupabaseBrowserClient = () => {
  if (!browserClient) {
    browserClient = createBrowserClient() as ReturnType<typeof createClient>;
  }
  return browserClient;
};

export const getSupabaseServerClient = () => {
  return createServerClient();
};
