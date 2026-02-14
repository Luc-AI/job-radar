/**
 * Test Data Seeding Setup
 *
 * Runs after authentication but before authenticated tests.
 * Seeds jobs and evaluations for the test user.
 *
 * Dependencies: auth.setup.ts must run first
 */
import { test as setup } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import { seedTestData, ensureUserProfile, SEED_JOBS } from "../support/seed";

setup("seed test data", async () => {
  console.log("\n📦 Seeding test data...\n");

  // Validate environment
  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_ANON_KEY must be set for seeding"
    );
  }

  if (!serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY must be set for test data seeding.\n" +
        "Get it from Supabase dashboard: Settings > API > service_role key\n" +
        "Add to tests/.env: SUPABASE_SERVICE_ROLE_KEY=your-key"
    );
  }

  if (!email || !password) {
    throw new Error(
      "TEST_USER_EMAIL and TEST_USER_PASSWORD must be set for seeding"
    );
  }

  // Sign in to get user ID (using anon key for auth)
  const client = createClient(supabaseUrl, supabaseKey);
  const { data: authData, error: authError } =
    await client.auth.signInWithPassword({
      email,
      password,
    });

  if (authError || !authData.user) {
    throw new Error(
      `Auth failed for seeding: ${authError?.message || "No user returned"}\n` +
        `Make sure TEST_USER_EMAIL (${email}) exists in Supabase Auth.`
    );
  }

  const userId = authData.user.id;
  console.log(`👤 Seeding data for user: ${userId}`);
  console.log(`📧 Email: ${email}\n`);

  // Ensure user profile exists in users table
  console.log("🔧 Ensuring user profile exists...");
  await ensureUserProfile(userId, email);
  console.log("✅ User profile ready\n");

  // Seed test data
  console.log(`🌱 Creating ${SEED_JOBS.length} test jobs with evaluations...`);
  const result = await seedTestData(userId);

  console.log("\n📊 Seeding Results:");
  console.log(`   Jobs created:        ${result.jobsCreated}`);
  console.log(`   Evaluations created: ${result.evaluationsCreated}`);

  if (result.errors.length > 0) {
    console.warn("\n⚠️  Errors:");
    result.errors.forEach((err) => console.warn(`   - ${err}`));
  }

  // Sign out
  await client.auth.signOut();

  if (result.jobsCreated === 0 || result.evaluationsCreated === 0) {
    throw new Error(
      "Seeding failed - no data was created. Check errors above."
    );
  }

  console.log("\n✅ Test data seeding complete!\n");
});
