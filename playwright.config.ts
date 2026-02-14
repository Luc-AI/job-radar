import { defineConfig, devices } from "@playwright/test";
import path from "path";

/**
 * Playwright configuration for job-radar
 *
 * Projects:
 * - setup: Authenticates test user, saves session
 * - seed: Seeds test data (jobs, evaluations) after auth
 * - authenticated: Tests requiring login (dashboard, profile, settings)
 * - public: Tests for public pages (landing, login, signup)
 *
 * Run with: npx playwright test
 * Run specific project: npx playwright test --project=authenticated
 */

const baseURL = process.env.BASE_URL || "http://localhost:3000";

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: "./test-results",

  /* Run tests in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI for stability */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter configuration */
  reporter: [
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["junit", { outputFile: "test-results/results.xml" }],
    ["list"],
  ],

  /* Shared settings for all projects */
  use: {
    baseURL,

    /* Timeouts */
    actionTimeout: 15000,
    navigationTimeout: 30000,

    /* Collect trace on first retry */
    trace: "on-first-retry",

    /* Screenshot on failure */
    screenshot: "only-on-failure",

    /* Video on failure */
    video: "retain-on-failure",

    /* Test ID attribute for selectors */
    testIdAttribute: "data-testid",
  },

  /* Global test timeout */
  timeout: 60000,

  /* Expect timeout */
  expect: {
    timeout: 10000,
  },

  /* Global setup - runs once before all tests */
  globalSetup: path.join(__dirname, "tests/support/global-setup.ts"),

  /* Configure projects for authenticated and public testing */
  projects: [
    /* Auth setup - authenticates and saves session state */
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
    },

    /* Seed setup - creates test data after authentication */
    {
      name: "seed",
      testMatch: /seed\.setup\.ts/,
      dependencies: ["setup"],
    },

    /* Authenticated tests - requires login AND seeded data */
    {
      name: "authenticated",
      dependencies: ["seed"],
      // Limit parallelism for authenticated tests to avoid race conditions
      fullyParallel: false,
      use: {
        ...devices["Desktop Chrome"],
        storageState: path.join(__dirname, "tests/.auth/user.json"),
      },
      testMatch: /.*\.authenticated\.spec\.ts/,
    },

    /* Public tests - no auth required */
    {
      name: "public",
      use: {
        ...devices["Desktop Chrome"],
      },
      testMatch: /.*\.public\.spec\.ts/,
    },

    /* Mobile Chrome - responsive testing */
    {
      name: "mobile",
      use: {
        ...devices["Pixel 5"],
      },
      testMatch: /.*\.mobile\.spec\.ts/,
    },
  ],

  /* Run local dev server before starting tests */
  webServer: {
    command: "npm run dev",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
