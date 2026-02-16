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

/**
 * Shared helper to ensure page is authenticated.
 * Re-authenticates if storage state wasn't applied (fallback for flaky CI).
 */
export async function ensureAuthenticated(page: Page, targetUrl: string) {
  await page.goto(targetUrl);

  // Wait for any redirects to complete
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(1000); // Allow time for client-side auth checks

  // Check if on login page or showing login form
  const currentUrl = page.url();
  const loginForm = page.getByRole("textbox", { name: "Email address" });
  const isOnLoginPage =
    currentUrl.includes("/login") ||
    (await loginForm.isVisible({ timeout: 5000 }).catch(() => false));

  if (isOnLoginPage) {
    const email = process.env.TEST_USER_EMAIL;
    const password = process.env.TEST_USER_PASSWORD;

    if (!email || !password) {
      throw new Error("TEST_USER_EMAIL and TEST_USER_PASSWORD must be set");
    }

    // Fill login form
    await loginForm.fill(email);
    await page.getByRole("textbox", { name: "Password" }).fill(password);

    // Click sign in and wait for navigation
    const signInButton = page.getByRole("button", { name: /sign in/i });
    await Promise.all([
      page.waitForURL(/.*(?:dashboard|onboarding|profile|settings).*/, { timeout: 30000 }).catch(() => null),
      signInButton.click(),
    ]);

    await page.waitForLoadState("networkidle");

    // Handle onboarding redirect
    if (page.url().includes("/onboarding")) {
      await page.goto(targetUrl);
      await page.waitForLoadState("networkidle");
    }

    // Navigate to target if not already there
    const targetPath = targetUrl.replace(/^\//, "");
    if (!page.url().includes(targetPath)) {
      await page.goto(targetUrl);
      await page.waitForLoadState("networkidle");
    }
  }

  // Final wait for content
  await page.waitForLoadState("networkidle").catch(() => {});
}
