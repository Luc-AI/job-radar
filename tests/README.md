# Job Radar E2E Tests

Production-ready Playwright test framework for job-radar.

## Quick Start

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run all tests
npm test

# Run with UI mode (interactive debugging)
npm run test:ui

# Run headed (see browser)
npm run test:headed
```

## Test Structure

```
tests/
├── e2e/                          # E2E test specs
│   ├── auth.setup.ts             # Authentication setup (runs first)
│   ├── landing.public.spec.ts    # Public pages (no auth)
│   ├── dashboard.authenticated.spec.ts
│   ├── job-detail.authenticated.spec.ts
│   ├── profile.authenticated.spec.ts
│   └── rls-security.authenticated.spec.ts  # RLS policy validation
├── support/
│   ├── fixtures/                 # Playwright fixtures
│   │   └── merged-fixtures.ts    # Custom fixtures (import this!)
│   ├── factories/                # Test data factories
│   │   ├── user-factory.ts
│   │   ├── job-factory.ts
│   │   └── evaluation-factory.ts
│   └── global-setup.ts           # Global test setup
├── .auth/                        # Saved auth sessions (gitignored)
└── .env.example                  # Environment template
```

## Test Projects

| Project | Description | File Pattern |
|---------|-------------|--------------|
| `setup` | Authenticates test user | `*.setup.ts` |
| `authenticated` | Tests requiring login | `*.authenticated.spec.ts` |
| `public` | Tests for public pages | `*.public.spec.ts` |
| `mobile` | Mobile viewport tests | `*.mobile.spec.ts` |

Run specific project:
```bash
npm run test:public      # Public tests only
npm run test:auth        # Authenticated tests only
npx playwright test --project=mobile
```

## Environment Setup

1. Copy the environment template:
   ```bash
   cp tests/.env.example tests/.env
   ```

2. Fill in your test credentials:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   TEST_USER_EMAIL=test@example.com
   TEST_USER_PASSWORD=secure-password
   ```

3. Create a dedicated test user in Supabase Auth for E2E testing.

## Writing Tests

### Import from merged fixtures

```typescript
import { test, expect } from "../support/fixtures/merged-fixtures";

test("example test", async ({ page, supabase, authUserId }) => {
  await page.goto("/dashboard");
  await expect(page.getByRole("heading")).toBeVisible();

  // Use supabase fixture for API-level testing
  const { data } = await supabase.from("users").select().eq("id", authUserId);
});
```

### Use factories for test data

```typescript
import { createUser, createJob } from "../support/factories";

const user = createUser({ email: "custom@test.com" });
const job = createJob({ remote_type: "Remote" });
```

### Given/When/Then pattern

```typescript
test("user can save a job", async ({ page }) => {
  // Given: User is on dashboard with jobs
  await page.goto("/dashboard");

  // When: User clicks save on a job
  await page.getByTestId("save-job").first().click();

  // Then: Job is saved
  await expect(page.getByText("Saved")).toBeVisible();
});
```

## Available Fixtures

| Fixture | Description |
|---------|-------------|
| `page` | Playwright page object |
| `supabase` | Authenticated Supabase client for API-level testing |
| `authUserId` | Current authenticated user's ID |
| `testUser` | Factory-generated test user data |
| `testEvaluation` | Factory-generated evaluation data |

## CI/CD Integration

### GitHub Actions

```yaml
- name: Install Playwright Browsers
  run: npx playwright install --with-deps

- name: Run E2E tests
  run: npm test
  env:
    SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
    SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
    TEST_USER_EMAIL: ${{ secrets.TEST_USER_EMAIL }}
    TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}

- name: Upload test results
  if: failure()
  uses: actions/upload-artifact@v4
  with:
    name: playwright-report
    path: playwright-report/
```

## Debugging

```bash
# Interactive UI mode
npm run test:ui

# Debug mode (pause on failures)
npm run test:debug

# View last report
npm run test:report

# Run specific test file
npx playwright test dashboard
```

## Configuration

See `playwright.config.ts` for:
- Timeout settings (action: 15s, navigation: 30s, test: 60s)
- Artifact retention (screenshots, videos, traces on failure)
- Browser projects (Chrome, mobile)
- Web server configuration

## Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [job-radar Architecture](../_bmad-output/planning-artifacts/architecture.md)
