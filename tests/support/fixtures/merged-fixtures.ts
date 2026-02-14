/**
 * Merged Playwright fixtures for job-radar
 *
 * Extends base Playwright test with custom project fixtures.
 * Import { test, expect } from this file in all test files for consistent access.
 *
 * Available fixtures:
 * - testUser: Factory-created test user data
 * - testEvaluation: Factory-created evaluation data
 * - supabase: Authenticated Supabase client for API testing
 * - authUserId: Current authenticated user's ID
 * - authenticatedPage: Page fixture that verifies auth before use
 */
import { test as base, expect, Page } from "@playwright/test";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { createUser, type User } from "../factories/user-factory";
import {
  createEvaluation,
  type Evaluation,
} from "../factories/evaluation-factory";

// Fixture types
type CustomFixtures = {
  /** Factory-generated test user data */
  testUser: User;
  /** Factory-generated test evaluation data */
  testEvaluation: Evaluation;
  /** Authenticated Supabase client for API-level testing */
  supabase: SupabaseClient;
  /** Current authenticated user's ID from Supabase */
  authUserId: string;
  /** Ensures page is authenticated before use */
  authenticatedPage: Page;
};

export const test = base.extend<CustomFixtures>({
  /**
   * Provides a factory-generated user for each test.
   * User data is unique per test run (parallel-safe).
   */
  testUser: async ({}, use) => {
    const user = createUser();
    await use(user);
  },

  /**
   * Provides a factory-generated evaluation for each test.
   * Evaluation data is unique per test run (parallel-safe).
   */
  testEvaluation: async ({ testUser }, use) => {
    const evaluation = createEvaluation({ user_id: testUser.id });
    await use(evaluation);
  },

  /**
   * Provides an authenticated Supabase client.
   * Uses the same test user credentials as Playwright auth.
   */
  supabase: async ({}, use) => {
    // Check for both SUPABASE_ and NEXT_PUBLIC_SUPABASE_ prefixes
    const supabaseUrl =
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const email = process.env.TEST_USER_EMAIL;
    const password = process.env.TEST_USER_PASSWORD;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        "SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL and SUPABASE_ANON_KEY/NEXT_PUBLIC_SUPABASE_ANON_KEY must be set"
      );
    }
    if (!email || !password) {
      throw new Error("TEST_USER_EMAIL and TEST_USER_PASSWORD must be set");
    }

    const client = createClient(supabaseUrl, supabaseKey);
    const { error } = await client.auth.signInWithPassword({ email, password });

    if (error) {
      throw new Error(`Supabase auth failed: ${error.message}`);
    }

    await use(client);

    // Cleanup: sign out
    await client.auth.signOut();
  },

  /**
   * Provides the authenticated user's ID.
   * Useful for RLS testing - comparing against other users' data.
   */
  authUserId: async ({ supabase }, use) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("No authenticated user found");
    }
    await use(user.id);
  },

  /**
   * Provides a page that verifies authentication is working.
   * Navigates to dashboard and ensures we're not on login page.
   */
  authenticatedPage: async ({ page }, use) => {
    // Navigate to dashboard to verify auth
    await page.goto("/dashboard");

    // Wait for navigation to complete
    await page.waitForLoadState("networkidle");

    // Check if we're on the dashboard (not redirected to login)
    const url = page.url();
    if (url.includes("/login")) {
      throw new Error(
        "Authentication failed - redirected to login. Check storage state."
      );
    }

    await use(page);
  },
});

export { expect };
