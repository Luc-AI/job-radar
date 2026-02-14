/**
 * Global setup for Playwright tests
 *
 * Runs once before all tests to:
 * 1. Load environment variables
 * 2. Ensure auth storage directories exist
 *
 * Reference: https://playwright.dev/docs/test-global-setup-teardown
 */
import { config as dotenvConfig } from "dotenv";
import path from "path";
import fs from "fs";

// Load environment variables from tests/.env
dotenvConfig({
  path: path.resolve(__dirname, "../.env"),
});

// Also load from root .env.local for local development
dotenvConfig({
  path: path.resolve(__dirname, "../../.env.local"),
});

async function globalSetup() {
  console.log("Running global setup...");

  // Ensure auth storage directory exists
  const authDir = path.resolve(__dirname, "../.auth");
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  // Validate required environment variables
  const required = [
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY",
    "TEST_USER_EMAIL",
    "TEST_USER_PASSWORD",
  ];

  // Optional but recommended for test data seeding
  const optional = ["SUPABASE_SERVICE_ROLE_KEY"];

  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.warn(
      `Warning: Missing environment variables: ${missing.join(", ")}`
    );
    console.warn("Some tests may fail. See tests/.env.example for setup.");
  }

  const missingOptional = optional.filter((key) => !process.env[key]);
  if (missingOptional.length > 0) {
    console.warn(
      `Warning: Missing optional variables: ${missingOptional.join(", ")}`
    );
    console.warn(
      "Test data seeding requires SUPABASE_SERVICE_ROLE_KEY.\n" +
        "Get it from: Supabase Dashboard > Settings > API > service_role key"
    );
  }

  console.log("Global setup complete.");
}

export default globalSetup;
