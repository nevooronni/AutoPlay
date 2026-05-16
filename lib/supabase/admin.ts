import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// Create a Supabase admin client with the service role key to bypass RLS.
// This is required for background tasks like webhooks where there's no active user session.
export function createAdminClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing env.SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
