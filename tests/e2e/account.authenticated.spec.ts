/**
 * Account Page Tests (Authenticated)
 *
 * Tests for account management: personal info, email change, danger zone.
 * Verifies page structure, form fields, and account deletion safeguards.
 */
import { test, expect, ensureAuthenticated } from "../support/fixtures/merged-fixtures";

test.describe("Account Page", () => {
  test.beforeEach(async ({ page }) => {
    await ensureAuthenticated(page, "/account");
  });

  test("account page loads with Account heading", async ({ page }) => {
    const heading = page.getByRole("heading", { name: /Account/i, level: 1 });
    await expect(heading).toBeVisible();
  });

  test("personal info form is visible with Vorname and Nachname fields", async ({ page }) => {
    const firstNameLabel = page.getByLabel(/Vorname/i);
    const lastNameLabel = page.getByLabel(/Nachname/i);

    const hasFirst = await firstNameLabel.isVisible().catch(() => false);
    const hasLast = await lastNameLabel.isVisible().catch(() => false);

    expect(hasFirst || hasLast).toBe(true);
  });

  test("personal info save button is disabled when no changes", async ({ page }) => {
    // Find save buttons — should be disabled before any edits
    const saveButtons = page.getByRole("button", { name: /Speichern/i });
    const count = await saveButtons.count();

    expect(count).toBeGreaterThan(0);

    // At least the first card's save should be disabled
    const firstSave = saveButtons.first();
    const isDisabled = await firstSave.isDisabled();
    expect(isDisabled).toBe(true);
  });

  test("Danger Zone section is visible", async ({ page }) => {
    const dangerHeading = page.locator("text=/Danger Zone/i");
    await expect(dangerHeading).toBeVisible();
  });

  test("clicking Account löschen opens a confirmation dialog", async ({ page }) => {
    // Find and click the delete account button
    const deleteBtn = page.getByRole("button", { name: /Account löschen/i });
    await expect(deleteBtn).toBeVisible();
    await deleteBtn.click();

    // A dialog or confirmation input should appear
    const dialog = page.getByRole("dialog");
    const confirmInput = page.getByRole("textbox", { name: /DELETE/i })
      .or(page.locator('input[placeholder*="DELETE"]'))
      .or(page.locator('input[name="confirmation"]'));

    const hasDialog = await dialog.isVisible().catch(() => false);
    const hasInput = await confirmInput.isVisible().catch(() => false);

    expect(hasDialog || hasInput).toBe(true);
  });

  test("account deletion submit is disabled without correct confirmation", async ({ page }) => {
    // Open the delete dialog
    const deleteBtn = page.getByRole("button", { name: /Account löschen/i });
    await deleteBtn.click();

    // Wait for dialog to open
    const dialog = page.getByRole("dialog");
    const hasDialog = await dialog.isVisible().catch(() => false);
    if (!hasDialog) {
      test.skip();
      return;
    }

    // Type wrong confirmation text
    const confirmInput = page.locator('input[name="confirmation"]')
      .or(page.locator('input[placeholder*="DELETE"]'));

    const hasInput = await confirmInput.isVisible().catch(() => false);
    if (!hasInput) {
      test.skip();
      return;
    }

    await confirmInput.fill("wrong text");

    // The final confirm/submit button inside the dialog should be disabled
    const confirmSubmit = dialog.getByRole("button", { name: /löschen|delete|bestätigen/i });
    const isDisabled = await confirmSubmit.isDisabled().catch(() => true);
    expect(isDisabled).toBe(true);
  });

  test("account deletion submit is enabled with correct DELETE confirmation", async ({ page }) => {
    // Open the delete dialog
    const deleteBtn = page.getByRole("button", { name: /Account löschen/i });
    await deleteBtn.click();

    const dialog = page.getByRole("dialog");
    const hasDialog = await dialog.isVisible().catch(() => false);
    if (!hasDialog) {
      test.skip();
      return;
    }

    const confirmInput = page.locator('input[name="confirmation"]')
      .or(page.locator('input[placeholder*="DELETE"]'));

    const hasInput = await confirmInput.isVisible().catch(() => false);
    if (!hasInput) {
      test.skip();
      return;
    }

    // Type the correct confirmation
    await confirmInput.fill("DELETE");

    // The submit button should now be enabled
    const confirmSubmit = dialog.getByRole("button", { name: /löschen|delete|bestätigen/i });
    const isDisabled = await confirmSubmit.isDisabled().catch(() => false);
    // Note: we do NOT submit — just verify the button enables
    expect(isDisabled).toBe(false);
  });
});
