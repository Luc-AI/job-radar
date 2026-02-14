# Test Design for QA: job-radar

**Purpose:** Test execution recipe for QA team. Defines what to test, how to test it, and what QA needs from other teams.

**Date:** 2026-02-13
**Author:** Master Test Architect (TEA)
**Status:** Draft
**Project:** job-radar

**Related:** See Architecture doc ([test-design-architecture.md](test-design-architecture.md)) for testability concerns and architectural blockers.

---

## Executive Summary

**Scope:** System-level test coverage for job-radar MVP (4 epics, 43 FRs, 14 NFRs)

**Risk Summary:**

- Total Risks: 7 (2 high-priority score >= 6, 3 medium, 2 low)
- Critical Categories: SEC (RLS security), TECH (no test framework)

**Coverage Summary:**

- P0 tests: ~9 (critical paths, security)
- P1 tests: ~18 (important features, integration)
- P2 tests: ~10 (edge cases, regression)
- P3 tests: ~0 (lean MVP)
- **Total**: ~37 tests (~1.5-2 weeks with 1 QA)

---

## Dependencies & Test Blockers

**CRITICAL:** QA cannot proceed without these items from other teams.

### Backend/Architecture Dependencies (Sprint 0)

**Source:** See Architecture doc "Quick Guide" for detailed mitigation plans

1. **Playwright Configuration** - Dev - Sprint 0
   - QA needs: Working Playwright setup with `playwright.config.ts`
   - Why it blocks: Cannot run any automated tests

2. **Test Data Fixtures** - Dev - Sprint 0
   - QA needs: Evaluation and job fixture data for testing
   - Why it blocks: Cannot test job discovery without sample evaluations

### QA Infrastructure Setup (Sprint 0)

1. **Test Data Factories** - QA
   - User factory with faker-based randomization
   - Evaluation factory with score ranges
   - Auto-cleanup fixtures for parallel safety

2. **Test Environments** - QA
   - Local: Supabase local dev + Next.js dev server
   - CI/CD: GitHub Actions with Playwright shards
   - Staging: Vercel preview deployments

**Example factory pattern:**

```typescript
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

// User factory
function createUser(overrides = {}) {
  return {
    email: faker.internet.email(),
    password: 'TestPassword123!',
    name: faker.person.fullName(),
    ...overrides,
  };
}

// Evaluation factory
function createEvaluation(overrides = {}) {
  return {
    score_total: faker.number.float({ min: 6, max: 10, fractionDigits: 1 }),
    status: 'new',
    reason_role: faker.lorem.sentence(),
    ...overrides,
  };
}

test('example test @P0', async ({ page }) => {
  const user = createUser();

  await page.goto('/signup');
  await page.fill('[data-testid="email"]', user.email);
  await page.fill('[data-testid="password"]', user.password);
  await page.click('[data-testid="submit"]');

  await expect(page).toHaveURL('/onboarding/step-1');
});
```

---

## Risk Assessment

**Note:** Full risk details in Architecture doc. This section summarizes risks relevant to QA test planning.

### High-Priority Risks (Score >= 6)

| Risk ID | Category | Description | Score | QA Test Coverage |
|---------|----------|-------------|-------|------------------|
| **R-001** | SEC | CV data exposed to other users | **6** | SEC-001, SEC-002: Cross-user access tests |
| **R-002** | TECH | No test automation | **6** | Sprint 0 setup: Write P0 tests first |

### Medium/Low-Priority Risks

| Risk ID | Category | Description | Score | QA Test Coverage |
|---------|----------|-------------|-------|------------------|
| R-003 | PERF | Job feed slow with 100+ jobs | 4 | PERF-001: Load test with pagination |
| R-005 | BUS | n8n evaluations missing | 4 | Verify fixture data availability |
| R-007 | SEC | OAuth callback manipulation | 3 | 1.2-E2E-001: OAuth flow validation |

---

## Test Coverage Plan

**IMPORTANT:** P0/P1/P2/P3 = **priority and risk level** (what to focus on if time-constrained), NOT execution timing. See "Execution Strategy" for when tests run.

### P0 (Critical)

**Criteria:** Blocks core functionality + High risk (>= 6) + No workaround + Affects majority of users

| Test ID | Requirement | Test Level | Risk Link | Notes |
|---------|-------------|------------|-----------|-------|
| **1.1-E2E-001** | User signs up with email/password | E2E | - | Core auth flow |
| **1.1-E2E-003** | User logs in with valid credentials | E2E | - | Core auth flow |
| **1.3-E2E-001** | Complete onboarding Step 1 | E2E | - | Onboarding critical path |
| **1.4-E2E-001** | CV upload via file (PDF) | E2E | R-001 | CV security |
| **2.1-E2E-001** | Dashboard displays jobs sorted by score | E2E | - | Core value delivery |
| **2.1-API-001** | Evaluations query returns user's jobs only | API | R-001 | RLS security |
| **2.4-E2E-001** | Job detail page shows full info | E2E | - | Core journey |
| **SEC-001** | User cannot access other user's evaluations | API | R-001 | RLS critical |
| **SEC-002** | User cannot access other user's CV | API | R-001 | PII protection |

**Total P0:** ~9 tests

---

### P1 (High)

**Criteria:** Important features + Medium risk (3-4) + Common workflows + Workaround exists but difficult

| Test ID | Requirement | Test Level | Risk Link | Notes |
|---------|-------------|------------|-----------|-------|
| **1.1-E2E-002** | Existing email shows error | E2E | - | Error handling |
| **1.1-E2E-004** | User logs out and session cleared | E2E | - | Session security |
| **1.2-E2E-001** | Google OAuth signup/login | E2E | R-007 | OAuth flow |
| **1.3-API-001** | Preferences saved to DB | API | - | Data persistence |
| **1.4-E2E-002** | CV paste text fallback | E2E | - | Alternative path |
| **1.4-API-001** | CV text stored in cv_raw | API | R-001 | CV security |
| **1.5-E2E-001** | Complete Step 3 (aspirations) | E2E | - | Onboarding |
| **2.1-E2E-002** | Load more pagination works | E2E | R-003 | Performance |
| **2.4-E2E-002** | AI match breakdown visible | E2E | - | Key feature |
| **2.5-API-001** | Save job updates status | API | - | Action persistence |
| **2.5-API-002** | Hide job updates status | API | - | Action persistence |
| **2.5-API-003** | Mark applied updates status | API | - | Action persistence |
| **2.5-E2E-001** | Job actions provide visual feedback | E2E | - | UX validation |
| **2.6-E2E-001** | Apply button opens external URL | E2E | - | Core action |
| **3.1-E2E-001** | Edit job preferences | E2E | - | Returner journey |
| **3.2-E2E-001** | Replace CV via upload | E2E | R-001 | CV update |
| **3.4-E2E-001** | Toggle notifications on/off | E2E | - | User control |
| **SEC-003** | Expired token rejected | API | - | Auth security |

**Total P1:** ~18 tests

---

### P2 (Medium)

**Criteria:** Secondary features + Low risk (1-2) + Edge cases + Regression prevention

| Test ID | Requirement | Test Level | Risk Link | Notes |
|---------|-------------|------------|-----------|-------|
| **1.6-E2E-001** | Success screen shows confirmation | E2E | - | User feedback |
| **2.2-E2E-001** | Filter by score range | E2E | - | Secondary feature |
| **2.2-E2E-002** | Filter by status | E2E | - | Secondary feature |
| **2.3-E2E-001** | Sort by score/date | E2E | - | Secondary feature |
| **3.1-API-001** | Preferences update persists | API | - | Data integrity |
| **3.3-E2E-001** | Update career aspirations | E2E | - | Secondary feature |
| **3.4-API-001** | Notification settings persist | API | - | Data integrity |
| **3.5-E2E-001** | Delete account with confirmation | E2E | - | Destructive action |
| **4.1-E2E-002** | Authenticated user redirected | E2E | - | Auth redirect |
| **4.2-E2E-001** | CTA navigates to signup | E2E | - | Conversion |

**Total P2:** ~10 tests

---

### P3 (Low)

**Criteria:** Nice-to-have + Exploratory + Performance benchmarks

| Test ID | Requirement | Test Level | Notes |
|---------|-------------|------------|-------|
| **PERF-001** | Job feed loads <2s with 100 jobs | E2E | NFR1 validation |
| **PERF-002** | Page transitions <500ms | E2E | NFR2 validation |
| **UX-001** | Onboarding completes <5 minutes | E2E | NFR8 validation |

**Total P3:** ~3 tests (deferred until MVP stable)

---

## Execution Strategy

**Philosophy:** Run everything in PRs unless there's significant infrastructure overhead. Playwright with parallelization is extremely fast.

**Organized by TOOL TYPE:**

### Every PR: Playwright Tests (~10 min)

**All functional tests** (from any priority level):

- All E2E and API tests (P0, P1, P2)
- Parallelized across 4 workers
- Total: ~37 Playwright tests

**Why run in PRs:** Fast feedback, catches regressions immediately

### Nightly: Full Suite + Stability (~15 min)

**Extended validation:**

- All tests with retry=0 (detect flaky tests)
- Generate HTML report
- Total: Same ~37 tests, stricter config

**Why defer to nightly:** Stability monitoring without blocking PRs

### Weekly: Performance Benchmarks (~5 min)

**Performance tests:**

- PERF-001: Load test with 100+ evaluations
- PERF-002: Page transition timing

**Why defer to weekly:** Not critical for MVP, validates NFRs periodically

---

## QA Effort Estimate

**QA test development effort only** (excludes DevOps, Backend work):

| Priority | Count | Effort Range | Notes |
|----------|-------|--------------|-------|
| P0 | ~9 | ~15-25 hours | Auth flows, RLS security tests |
| P1 | ~18 | ~20-35 hours | Actions, OAuth, integrations |
| P2 | ~10 | ~10-15 hours | Filters, edge cases |
| P3 | ~3 | ~2-5 hours | Performance (deferred) |
| **Total** | ~37 | **~47-80 hours** | **~1.5-2 weeks, 1 QA engineer** |

**Assumptions:**

- Includes test design, implementation, debugging, CI integration
- Excludes ongoing maintenance (~10% effort)
- Assumes test infrastructure (factories, fixtures) ready from Sprint 0

---

## Appendix A: Code Examples & Tagging

**Playwright Tags for Selective Execution:**

```typescript
import { test, expect } from '@playwright/test';

// P0 critical test - security
test('@P0 @Security user cannot access other user CV', async ({ request }) => {
  // Login as User A
  const userA = await loginAs('usera@test.com');

  // Attempt to access User B's data
  const response = await request.get('/api/users/user-b-id', {
    headers: { Authorization: `Bearer ${userA.token}` },
  });

  // Should be forbidden by RLS
  expect(response.status()).toBe(404); // RLS hides the row
});

// P1 integration test
test('@P1 @Integration job action updates status', async ({ page }) => {
  await page.goto('/dashboard');

  // Click save on first job
  await page.click('[data-testid="job-card"]:first-child [data-testid="save-btn"]');

  // Verify toast feedback
  await expect(page.getByText('Job saved')).toBeVisible();

  // Verify status badge updated
  await expect(page.locator('[data-testid="job-card"]:first-child [data-testid="status-badge"]'))
    .toHaveText('Saved');
});
```

**Run specific tags:**

```bash
# Run only P0 tests
npx playwright test --grep @P0

# Run P0 + P1 tests
npx playwright test --grep "@P0|@P1"

# Run only security tests
npx playwright test --grep @Security

# Run all Playwright tests in PR (default)
npx playwright test
```

---

## Appendix B: Knowledge Base References

- **Risk Governance**: `risk-governance.md` - Risk scoring methodology (P x I)
- **Test Priorities Matrix**: `test-priorities-matrix.md` - P0-P3 criteria
- **Test Levels Framework**: `test-levels-framework.md` - E2E vs API vs Unit selection
- **Test Quality**: `test-quality.md` - Definition of Done (no hard waits, <300 lines, <1.5 min)

---

**Generated by:** BMad TEA Agent
**Workflow:** `_bmad/tea/workflows/testarch/test-design`
**Version:** 5.0 (Step-File Architecture)
