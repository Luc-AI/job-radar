/**
 * Service Role Supabase Client for Test Data Seeding
 *
 * Creates a Supabase client with SERVICE_ROLE_KEY to bypass RLS.
 * Use this ONLY for test data setup/teardown - never in actual tests.
 */
import { createClient, SupabaseClient } from "@supabase/supabase-js";

let seedClient: SupabaseClient | null = null;

/**
 * Gets or creates the service role Supabase client.
 * Caches the client for reuse within a test run.
 */
export function getSeedClient(): SupabaseClient {
  if (seedClient) return seedClient;

  const url =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error(
      "SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL must be set for seeding"
    );
  }

  if (!serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY must be set for test data seeding. " +
        "Get it from your Supabase dashboard: Settings > API > service_role key"
    );
  }

  seedClient = createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return seedClient;
}

/**
 * Resets the cached client (useful for test isolation)
 */
export function resetSeedClient(): void {
  seedClient = null;
}
