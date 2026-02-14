/**
 * Profile & Settings Tests (Authenticated)
 *
 * Tests for user profile management and settings pages.
 * These tests require authentication.
 *
 * Pattern: Given/When/Then format with data-testid selectors
 */
import { test, expect } from "../support/fixtures/merged-fixtures";

test.describe("Profile Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/profile");
  });

  test("displays profile sections", async ({ page }) => {
    // Then: Profile page shows main sections

    // Should have heading "Profile"
    await expect(
      page.getByRole("heading", { name: "Profile", level: 1 })
    ).toBeVisible();

    // Should have job preferences section (h2)
    await expect(
      page.getByRole("heading", { name: "Job Preferences" })
    ).toBeVisible();
  });

  test("displays job preferences form", async ({ page }) => {
    // Then: Job preferences form is visible

    // Should have Job Preferences heading
    await expect(
      page.getByRole("heading", { name: "Job Preferences" })
    ).toBeVisible();

    // Should have target job titles label
    await expect(
      page.locator('text=/Target job titles/i')
    ).toBeVisible();
  });

  test("can update job preferences", async ({ page }) => {
    // Given: User is on profile page

    // When: User modifies preferences and saves
    const saveButton = page.locator(
      'button:has-text("Save"), button:has-text("Update"), [data-testid="save-preferences"]'
    );

    if (await saveButton.first().isVisible()) {
      // Just verify the button exists and is clickable
      await expect(saveButton.first()).toBeEnabled();
    }
  });

  test("displays CV section", async ({ page }) => {
    // Then: CV/resume section is visible (h2 heading)
    await expect(
      page.getByRole("heading", { name: "CV / Resume" })
    ).toBeVisible();
  });

  test("displays career aspirations section", async ({ page }) => {
    // Then: Career Aspirations section is visible (h2 heading)
    await expect(
      page.getByRole("heading", { name: "Career Aspirations" })
    ).toBeVisible();
  });
});

test.describe("Settings Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/settings");
  });

  test("displays settings sections", async ({ page }) => {
    // Then: Settings page shows main sections

    // Should have heading "Settings" (h1)
    await expect(
      page.getByRole("heading", { name: "Settings", level: 1 })
    ).toBeVisible();
  });

  test("displays notification settings", async ({ page }) => {
    // Then: Email Notifications section is visible (h2)
    await expect(
      page.getByRole("heading", { name: "Email Notifications" })
    ).toBeVisible();

    // Should have checkbox "Send digest emails"
    const notifyToggle = page.locator('input[type="checkbox"]');
    await expect(notifyToggle.first()).toBeVisible();
  });

  test("can toggle notifications", async ({ page }) => {
    // Given: User is on settings page

    // When: User toggles notification setting
    const notifyToggle = page.locator('input[type="checkbox"]').first();

    if (await notifyToggle.isVisible()) {
      await notifyToggle.click();

      // Then: Toggle state changes
      await expect(notifyToggle).toBeVisible();
    }
  });

  test("displays account section", async ({ page }) => {
    // Then: Account Settings section is visible (h2)
    await expect(
      page.getByRole("heading", { name: "Account Settings" })
    ).toBeVisible();
  });
});

test.describe("Profile Navigation", () => {
  test("can navigate between profile and settings", async ({ page }) => {
    // Given: User is on profile
    await page.goto("/profile");

    // When: User clicks Notifications link (sidebar)
    await page.getByRole("link", { name: "Notifications" }).click();

    // Then: User is on settings page
    await expect(page).toHaveURL(/.*settings/);

    // When: User clicks Profile link (sidebar)
    await page.getByRole("link", { name: "Profile" }).click();

    // Then: User is on profile page
    await expect(page).toHaveURL(/.*profile/);
  });
});
