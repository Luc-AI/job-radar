/**
 * Authentication Setup
 *
 * This setup test authenticates a test user and saves the session
 * to be reused by authenticated tests.
 *
 * Runs before all authenticated tests via the "setup" project dependency.
 */
import { test as setup, expect } from "@playwright/test";
import path from "path";

const authFile = path.join(__dirname, "../.auth/user.json");

setup("authenticate", async ({ page }) => {
  // Navigate to login page
  await page.goto("/login");

  // Fill in credentials from environment variables
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "TEST_USER_EMAIL and TEST_USER_PASSWORD must be set for authenticated tests"
    );
  }

  // Fill login form
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);

  // Submit login
  await page.getByRole("button", { name: /sign in|log in/i }).click();

  // Wait for successful redirect to dashboard
  await expect(page).toHaveURL(/.*dashboard/, { timeout: 30000 });

  // Verify we're logged in by checking for the main dashboard heading
  await expect(
    page.getByRole("heading", { name: "Your Jobs", level: 1 })
  ).toBeVisible();

  // Save authentication state for reuse
  await page.context().storageState({ path: authFile });
});
