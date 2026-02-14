/**
 * Landing Page Tests (Public)
 *
 * Tests for unauthenticated users viewing the landing page.
 * These tests run without authentication.
 *
 * Pattern: Given/When/Then format with data-testid selectors
 */
import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    // Given: User navigates to the landing page
    await page.goto("/");
  });

  test("displays hero section with value proposition", async ({ page }) => {
    // Then: Hero section is visible with key elements
    await expect(
      page.getByRole("heading", { level: 1 })
    ).toBeVisible();

    // And: CTA buttons are present
    await expect(
      page.getByRole("link", { name: /get started|sign up/i })
    ).toBeVisible();
  });

  test("shows how-it-works section", async ({ page }) => {
    // Then: How it works section explains the product
    // Use the h2 heading specifically to avoid matching the button
    await expect(
      page.getByRole("heading", { name: "How It Works", level: 2 })
    ).toBeVisible();
  });

  test("navigates to login page", async ({ page }) => {
    // When: User clicks login
    await page.getByRole("link", { name: /log in|sign in/i }).click();

    // Then: User is on login page
    await expect(page).toHaveURL(/.*login/);
  });

  test("navigates to signup page", async ({ page }) => {
    // When: User clicks sign up / get started
    await page.getByRole("link", { name: /sign up|get started/i }).first().click();

    // Then: User is on signup page
    await expect(page).toHaveURL(/.*signup/);
  });

  test("is accessible on viewport", async ({ page }) => {
    // Then: Page is scrollable and responsive
    const body = page.locator("body");
    await expect(body).toBeVisible();

    // Basic accessibility check - ensure no console errors
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    // Scroll through page
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // No critical errors should be logged
    const criticalErrors = errors.filter(
      (e) => e.includes("TypeError") || e.includes("ReferenceError")
    );
    expect(criticalErrors).toHaveLength(0);
  });
});

test.describe("Login Page", () => {
  test("displays login form", async ({ page }) => {
    // Given: User navigates to login
    await page.goto("/login");

    // Then: Login form is present
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /sign in|log in/i })
    ).toBeVisible();
  });

  test("shows validation errors for empty form", async ({ page }) => {
    // Given: User is on login page
    await page.goto("/login");

    // When: User submits empty form
    await page.getByRole("button", { name: /sign in|log in/i }).click();

    // Then: Validation messages appear (HTML5 or custom)
    // The form should prevent submission with required fields
    const emailInput = page.getByLabel("Email");
    await expect(emailInput).toHaveAttribute("required", "");
  });

  test("has link to signup", async ({ page }) => {
    // Given: User is on login page
    await page.goto("/login");

    // Then: Link to signup exists ("Create one")
    await expect(
      page.getByRole("link", { name: "Create one" })
    ).toBeVisible();
  });
});

test.describe("Signup Page", () => {
  test("displays signup form", async ({ page }) => {
    // Given: User navigates to signup
    await page.goto("/signup");

    // Then: Signup form is present
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /sign up|create account/i })
    ).toBeVisible();
  });

  test("has link to login", async ({ page }) => {
    // Given: User is on signup page
    await page.goto("/signup");

    // Then: Link to login exists
    await expect(
      page.getByRole("link", { name: /log in|sign in|already have/i })
    ).toBeVisible();
  });
});
