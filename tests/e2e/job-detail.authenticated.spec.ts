/**
 * Job Detail Page Tests (Authenticated)
 *
 * Tests for viewing individual job details and taking actions.
 * These tests require authentication.
 *
 * Pattern: Given/When/Then format with data-testid selectors
 */
import { test, expect } from "../support/fixtures/merged-fixtures";

test.describe("Job Detail Page", () => {
  test("displays job information", async ({ page }) => {
    // Given: User navigates to dashboard first to find a job
    await page.goto("/dashboard");

    const jobCard = page.locator('[data-testid="job-card"]').first();

    // Skip if no jobs available
    if (!(await jobCard.isVisible())) {
      test.skip();
      return;
    }

    // When: User navigates to job detail
    const viewButton = jobCard.locator(
      'a:has-text("View"), button:has-text("View"), [data-testid="view-job"]'
    );

    if (await viewButton.isVisible()) {
      await viewButton.click();
    } else {
      await jobCard.click();
    }

    // Then: Job detail page shows key information
    await expect(page).toHaveURL(/.*jobs\/[^/]+/);

    // Job title should be visible
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // Company name should be visible
    await expect(page.locator("text=/company|employer/i")).toBeVisible();
  });

  test("displays score breakdown", async ({ page }) => {
    // Given: User is on a job detail page
    await page.goto("/dashboard");

    const jobCard = page.locator('[data-testid="job-card"]').first();

    if (!(await jobCard.isVisible())) {
      test.skip();
      return;
    }

    await jobCard.locator('a, button').first().click();
    await expect(page).toHaveURL(/.*jobs\/[^/]+/);

    // Then: Score breakdown section is visible
    const scoreSection = page.locator(
      '[data-testid="score-breakdown"], text=/score|match|rating/i'
    );

    await expect(scoreSection.first()).toBeVisible();
  });

  test("can take action on job (save/apply/hide)", async ({ page }) => {
    // Given: User is on a job detail page
    await page.goto("/dashboard");

    const jobCard = page.locator('[data-testid="job-card"]').first();

    if (!(await jobCard.isVisible())) {
      test.skip();
      return;
    }

    await jobCard.locator('a, button').first().click();
    await expect(page).toHaveURL(/.*jobs\/[^/]+/);

    // Then: Action buttons are available
    const actionButtons = page.locator(
      'button:has-text("Save"), button:has-text("Apply"), button:has-text("Hide"), [data-testid="job-actions"]'
    );

    await expect(actionButtons.first()).toBeVisible();
  });

  test("can navigate back to dashboard", async ({ page }) => {
    // Given: User is on a job detail page
    await page.goto("/dashboard");

    const jobCard = page.locator('[data-testid="job-card"]').first();

    if (!(await jobCard.isVisible())) {
      test.skip();
      return;
    }

    await jobCard.locator('a, button').first().click();
    await expect(page).toHaveURL(/.*jobs\/[^/]+/);

    // When: User clicks back or dashboard link
    const backButton = page.locator(
      'a:has-text("Back"), button:has-text("Back"), [data-testid="back-button"]'
    );
    const dashboardLink = page.getByRole("link", { name: /dashboard/i });

    if (await backButton.isVisible()) {
      await backButton.click();
    } else if (await dashboardLink.isVisible()) {
      await dashboardLink.click();
    } else {
      await page.goBack();
    }

    // Then: User is back on dashboard
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test("shows apply button that opens external link", async ({ page }) => {
    // Given: User is on a job detail page
    await page.goto("/dashboard");

    const jobCard = page.locator('[data-testid="job-card"]').first();

    if (!(await jobCard.isVisible())) {
      test.skip();
      return;
    }

    await jobCard.locator('a, button').first().click();
    await expect(page).toHaveURL(/.*jobs\/[^/]+/);

    // Then: Apply button is present
    const applyButton = page.locator(
      'a:has-text("Apply"), button:has-text("Apply"), [data-testid="apply-job"]'
    );

    if (await applyButton.isVisible()) {
      // Check it opens in new tab (has target="_blank") or external link
      const href = await applyButton.getAttribute("href");
      const target = await applyButton.getAttribute("target");

      // External links should open in new tab
      if (href && !href.startsWith("/")) {
        expect(target).toBe("_blank");
      }
    }
  });
});

test.describe("Job Detail - Score Reasons", () => {
  test("displays AI-generated reasoning", async ({ page }) => {
    // Given: User is on a job detail page
    await page.goto("/dashboard");

    const jobCard = page.locator('[data-testid="job-card"]').first();

    if (!(await jobCard.isVisible())) {
      test.skip();
      return;
    }

    await jobCard.locator('a, button').first().click();
    await expect(page).toHaveURL(/.*jobs\/[^/]+/);

    // Then: Reasons for the score are displayed
    // Look for reason sections
    const reasonSections = page.locator(
      '[data-testid="reason"], text=/reason|why|because|match/i'
    );

    await expect(reasonSections.first()).toBeVisible();
  });
});
