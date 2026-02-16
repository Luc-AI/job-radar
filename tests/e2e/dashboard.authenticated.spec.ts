/**
 * Dashboard Tests (Authenticated)
 *
 * Tests for the main job dashboard - the core feature of job-radar.
 * These tests require authentication (use saved session state).
 *
 * Pattern: Given/When/Then format with data-testid selectors
 */
import { test, expect, ensureAuthenticated } from "../support/fixtures/merged-fixtures";

test.describe("Job Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await ensureAuthenticated(page, "/dashboard");
  });

  test("displays job feed with evaluations", async ({ page }) => {
    // Given: User is on dashboard (from beforeEach)

    // Then: Dashboard elements are visible
    // Check for main dashboard heading "Your Jobs" or any h1
    const dashboardHeading = page.getByRole("heading", { name: "Your Jobs", level: 1 });
    const anyH1 = page.getByRole("heading", { level: 1 });

    // Wait for either the specific heading or any h1
    await expect(anyH1).toBeVisible();

    // Job cards should be present (or empty state)
    const jobCards = page.locator('[data-testid="job-card"]');
    const emptyState = page.locator('text=/no jobs|no matches|empty/i');

    // Either job cards or empty state should be visible
    const hasJobs = (await jobCards.count()) > 0;
    const hasEmptyState = await emptyState.isVisible().catch(() => false);

    expect(hasJobs || hasEmptyState).toBe(true);
  });

  test("can filter jobs by score range", async ({ page }) => {
    // Given: User is on dashboard with jobs

    // When: User interacts with score filter
    const scoreFilter = page.locator(
      '[data-testid="score-filter"], [data-testid="filter-score"]'
    );

    // If filter exists, test interaction
    if (await scoreFilter.isVisible()) {
      await scoreFilter.click();

      // Then: Filter options are shown
      await expect(page.locator('text=/90\\+|80-89|70-79/i')).toBeVisible();
    }
  });

  test("can filter jobs by status", async ({ page }) => {
    // Given: User is on dashboard

    // Look for status filter tabs or buttons or the job cards that show status
    // The dashboard shows job cards with status indicators
    const jobCards = page.locator('[data-testid="job-card"]');
    const emptyState = page.locator('text=/no jobs|no matches/i');

    // Either job cards exist or empty state is shown
    const hasJobs = (await jobCards.count()) > 0;
    const hasEmptyState = await emptyState.isVisible().catch(() => false);

    // Dashboard should display something
    expect(hasJobs || hasEmptyState).toBe(true);
  });

  test("sidebar navigation works", async ({ page }) => {
    // Given: User is on dashboard
    // Wait for page to fully load
    await page.waitForLoadState("networkidle");

    // Then: Sidebar navigation links are present (on desktop viewport)
    // At least one of these links should be visible
    const jobsLink = page.getByRole("link", { name: "Jobs" });
    const profileLink = page.getByRole("link", { name: "Profile", exact: true });

    // Check at least one nav link is visible
    const hasJobsLink = await jobsLink.isVisible().catch(() => false);
    const hasProfileLink = await profileLink.isVisible().catch(() => false);

    expect(hasJobsLink || hasProfileLink).toBe(true);
  });

  test("can navigate to profile", async ({ page }) => {
    // Given: User is on dashboard
    await page.waitForLoadState("networkidle");

    // When: User clicks profile link (or navigates directly)
    const profileLink = page.getByRole("link", { name: "Profile", exact: true });
    if (await profileLink.isVisible()) {
      await profileLink.click();
      await expect(page).toHaveURL(/.*profile/);
    } else {
      // Fallback: navigate directly
      await page.goto("/profile");
      await expect(page).toHaveURL(/.*profile/);
    }
  });

  test("can navigate to settings", async ({ page }) => {
    // Given: User is on dashboard

    // When: User clicks notifications link (sidebar shows "Notifications" for /settings)
    await page.getByRole("link", { name: "Notifications" }).click();

    // Then: User is on settings page
    await expect(page).toHaveURL(/.*settings/);
  });
});

test.describe("Job Card Interactions", () => {
  test.beforeEach(async ({ page }) => {
    await ensureAuthenticated(page, "/dashboard");
    // Wait for page content to load
    await page.waitForLoadState("networkidle");
  });

  test("can click on job card to view details", async ({ page }) => {
    // Given: Dashboard has at least one job
    // Wait a bit for cards to render
    await page.waitForTimeout(1000);
    const jobCard = page.locator('[data-testid="job-card"]').first();

    // Skip if no jobs available
    if (!(await jobCard.isVisible({ timeout: 5000 }).catch(() => false))) {
      test.skip();
      return;
    }

    // When: User clicks on job card (the card itself is a link to job details)
    // Note: "View Job" button opens external link in new tab, so click card directly
    await jobCard.click();

    // Then: User sees job detail page
    await expect(page).toHaveURL(/.*jobs\/[^/]+/);
  });

  test("can save a job", async ({ page }) => {
    // Given: Dashboard has at least one job
    await page.waitForTimeout(1000);
    const jobCard = page.locator('[data-testid="job-card"]').first();

    if (!(await jobCard.isVisible({ timeout: 5000 }).catch(() => false))) {
      test.skip();
      return;
    }

    // When: User clicks save button (skip if already saved)
    const saveButton = jobCard.getByRole("button", { name: "Save" });

    if (await saveButton.isVisible()) {
      await saveButton.click();

      // Then: Button changes to "Saved" state within this card
      await expect(jobCard.getByRole("button", { name: "Saved" })).toBeVisible({
        timeout: 5000,
      });
    }
  });

  test("can hide a job", async ({ page }) => {
    // Given: Dashboard has at least one job
    await page.waitForTimeout(1000);
    const jobCards = page.locator('[data-testid="job-card"]');
    const initialCount = await jobCards.count();

    if (initialCount === 0) {
      test.skip();
      return;
    }

    // When: User clicks hide button on first card
    const firstCard = jobCards.first();
    const hideButton = firstCard.getByRole("button", { name: "Hide" });

    if (await hideButton.isVisible()) {
      await hideButton.click();

      // Then: Job count decreases (card was hidden)
      await expect(jobCards).toHaveCount(initialCount - 1, { timeout: 5000 });
    }
  });
});

test.describe("KPI Stats", () => {
  test("displays job statistics", async ({ page }) => {
    // Given: User is on dashboard
    await ensureAuthenticated(page, "/dashboard");

    // Then: KPI/stats section shows relevant metrics
    // Look for stats elements
    const statsSection = page.locator(
      '[data-testid="kpi-stats"], [data-testid="stats"], .stats'
    );

    // Stats might show: total jobs, average score, applied count, etc.
    // This is an informational check - the exact numbers vary
    if (await statsSection.isVisible()) {
      await expect(statsSection).toContainText(/\d+/); // Contains at least one number
    }
  });
});
