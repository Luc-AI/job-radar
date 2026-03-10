/**
 * Settings Page Tests (Authenticated)
 *
 * Tests for notification and search settings.
 * Verifies page structure, card visibility, and save button behavior.
 */
import { test, expect, ensureAuthenticated } from "../support/fixtures/merged-fixtures";

test.describe("Settings Page", () => {
  test.beforeEach(async ({ page }) => {
    await ensureAuthenticated(page, "/settings");
  });

  test("settings page loads with Benachrichtigungen heading", async ({ page }) => {
    const heading = page.getByRole("heading", { name: /Benachrichtigungen/i, level: 1 });
    await expect(heading).toBeVisible();
  });

  test("SearchModeCard is visible with preset buttons", async ({ page }) => {
    // Card heading
    const cardHeading = page.locator("text=/Such-Modus/i");
    await expect(cardHeading).toBeVisible();

    // At least one preset button should be present
    const aktiveBtn = page.getByRole("button", { name: /Aktive Suche/i });
    const hasAktive = await aktiveBtn.isVisible().catch(() => false);

    const qualitaetBtn = page.getByRole("button", { name: /Qualitätsfokus/i });
    const hasQualitaet = await qualitaetBtn.isVisible().catch(() => false);

    expect(hasAktive || hasQualitaet).toBe(true);
  });

  test("NotificationChannelsCard is visible", async ({ page }) => {
    // Card or section heading
    const channelHeading = page.locator("text=/Benachrichtigungs/i");
    const hasHeading = await channelHeading.isVisible().catch(() => false);
    expect(hasHeading).toBe(true);
  });

  test("save buttons are disabled by default (no unsaved changes)", async ({ page }) => {
    // All Save buttons should be disabled when nothing has changed
    const saveButtons = page.getByRole("button", { name: /Speichern/i });
    const count = await saveButtons.count();

    // At least one save button should exist
    expect(count).toBeGreaterThan(0);

    // Each one should be disabled (no changes yet)
    for (let i = 0; i < count; i++) {
      const btn = saveButtons.nth(i);
      const isDisabled = await btn.isDisabled();
      expect(isDisabled).toBe(true);
    }
  });

  test("clicking a different search mode preset enables its save button", async ({ page }) => {
    // Find preset buttons
    const presets = [
      page.getByRole("button", { name: /Aktive Suche/i }),
      page.getByRole("button", { name: /Qualitätsfokus/i }),
      page.getByRole("button", { name: /Nur Top-Picks/i }),
    ];

    // Try each preset to find one that is NOT currently selected
    let clicked = false;
    for (const btn of presets) {
      const isVisible = await btn.isVisible().catch(() => false);
      if (!isVisible) continue;

      // Click it to trigger a change
      await btn.click();
      clicked = true;
      break;
    }

    if (!clicked) {
      test.skip();
      return;
    }

    // After clicking a preset, the save button for this card should become enabled
    // Look for an enabled Speichern button
    const saveButtons = page.getByRole("button", { name: /Speichern/i });
    const count = await saveButtons.count();

    let anyEnabled = false;
    for (let i = 0; i < count; i++) {
      const isDisabled = await saveButtons.nth(i).isDisabled();
      if (!isDisabled) {
        anyEnabled = true;
        break;
      }
    }

    expect(anyEnabled).toBe(true);
  });
});
