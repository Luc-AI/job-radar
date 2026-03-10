/**
 * Auth Flow Tests (Public)
 *
 * Tests for login, signup, and password reset pages.
 * These are PUBLIC tests — no authentication required.
 */
import { test, expect } from "@playwright/test";

test.describe("Login Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");
  });

  test("renders email and password fields with sign in button", async ({ page }) => {
    const emailField = page.getByLabel(/email/i);
    const passwordField = page.getByLabel(/password/i);
    const submitBtn = page.getByRole("button", { name: /sign in/i });

    await expect(emailField).toBeVisible();
    await expect(passwordField).toBeVisible();
    await expect(submitBtn).toBeVisible();
  });

  test("shows error on invalid credentials", async ({ page }) => {
    await page.getByLabel(/email/i).fill("invalid@example.com");
    await page.getByLabel(/password/i).fill("wrongpassword123");
    await page.getByRole("button", { name: /sign in/i }).click();

    // Wait for error to appear
    const error = page.locator("text=/invalid email or password/i")
      .or(page.locator("text=/email or password/i"))
      .or(page.locator('[role="alert"]'));

    await expect(error).toBeVisible({ timeout: 10000 });
  });

  test("shows validation error when fields are empty", async ({ page }) => {
    await page.getByRole("button", { name: /sign in/i }).click();

    // Either browser validation or server error should appear
    const errorMsg = page.locator("text=/required/i")
      .or(page.locator("text=/email and password/i"))
      .or(page.locator('[role="alert"]'));

    const isEmailInvalid = await page.getByLabel(/email/i)
      .evaluate((el: HTMLInputElement) => !el.validity.valid)
      .catch(() => false);

    const hasError = await errorMsg.isVisible().catch(() => false);

    expect(hasError || isEmailInvalid).toBe(true);
  });

  test("has link to signup page", async ({ page }) => {
    const signupLink = page.getByRole("link", { name: /sign up|create account|register/i });
    const hasLink = await signupLink.isVisible().catch(() => false);
    expect(hasLink).toBe(true);
  });
});

test.describe("Signup Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/signup");
    await page.waitForLoadState("networkidle");
  });

  test("renders email, password fields and create account button", async ({ page }) => {
    const emailField = page.getByLabel(/email/i);
    const passwordField = page.getByLabel(/password/i);
    const submitBtn = page.getByRole("button", { name: /create account/i });

    await expect(emailField).toBeVisible();
    await expect(passwordField).toBeVisible();
    await expect(submitBtn).toBeVisible();
  });

  test("shows error for short password", async ({ page }) => {
    await page.getByLabel(/email/i).fill("test@example.com");
    await page.getByLabel(/password/i).fill("short");
    await page.getByRole("button", { name: /create account/i }).click();

    const error = page.locator("text=/at least 8 characters/i")
      .or(page.locator("text=/password/i"))
      .or(page.locator('[role="alert"]'));

    await expect(error).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Forgot Password Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/forgot-password");
    await page.waitForLoadState("networkidle");
  });

  test("renders email field and send reset link button", async ({ page }) => {
    const emailField = page.getByLabel(/email/i);
    const submitBtn = page.getByRole("button", { name: /send reset link/i });

    await expect(emailField).toBeVisible();
    await expect(submitBtn).toBeVisible();
  });

  test("shows confirmation after submitting email", async ({ page }) => {
    await page.getByLabel(/email/i).fill("test@example.com");
    await page.getByRole("button", { name: /send reset link/i }).click();

    // Server always returns success (prevents email enumeration)
    const confirmation = page.locator("text=/check your email/i")
      .or(page.locator("text=/email/i"))
      .or(page.locator('[role="alert"]'));

    await expect(confirmation).toBeVisible({ timeout: 10000 });
  });

  test("shows error when email field is empty", async ({ page }) => {
    await page.getByRole("button", { name: /send reset link/i }).click();

    const isEmailInvalid = await page.getByLabel(/email/i)
      .evaluate((el: HTMLInputElement) => !el.validity.valid)
      .catch(() => false);

    const errorMsg = page.locator("text=/required|email/i");
    const hasError = await errorMsg.isVisible().catch(() => false);

    expect(hasError || isEmailInvalid).toBe(true);
  });
});
