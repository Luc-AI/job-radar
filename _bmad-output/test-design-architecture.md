# Test Design for Architecture: job-radar

**Purpose:** Architectural concerns, testability gaps, and NFR requirements for review by Architecture/Dev teams. Serves as a contract between QA and Engineering on what must be addressed before test development begins.

**Date:** 2026-02-13
**Author:** Master Test Architect (TEA)
**Status:** Architecture Review Pending
**Project:** job-radar
**PRD Reference:** [prd.md](_bmad-output/planning-artifacts/prd.md)
**ADR Reference:** [architecture.md](_bmad-output/planning-artifacts/architecture.md)

---

## Executive Summary

**Scope:** System-level test design for job-radar MVP - a personal job opportunity monitoring system (4 epics, 43 FRs, 14 NFRs)

**Business Context** (from PRD):

- **Impact:** Dogfooding project for personal use + portfolio
- **Problem:** Job seekers waste time on job boards; jobs should find you
- **Target:** Friends-only launch, 100 WAU at 3 months

**Architecture** (from ADR):

- **Key Decision 1:** Next.js 16 App Router with Server Actions
- **Key Decision 2:** Supabase Auth + Postgres with Row-Level Security
- **Key Decision 3:** Playwright for E2E testing (configured but not implemented)

**Expected Scale** (from ADR):

- ~10-50 users initially, 100+ evaluated jobs per user

**Risk Summary:**

- **Total risks**: 7
- **High-priority (score >= 6)**: 2 risks requiring immediate mitigation
- **Test effort**: ~37 tests (~1.5-2 weeks for 1 QA)

---

## Quick Guide

### BLOCKERS - Team Must Decide (Can't Proceed Without)

**Sprint 0 Critical Path** - These MUST be completed before QA can write integration tests:

1. **R-002: Configure Playwright Test Framework** - No test infrastructure exists; configure Playwright with fixtures and CI (Owner: Dev)
2. **T-002: Test Data Seeding** - No seeding APIs; create fixture data for evaluations and jobs (Owner: Dev)

**What we need from team:** Complete these 2 items in Sprint 0 or test development is blocked.

---

### HIGH PRIORITY - Team Should Validate (We Provide Recommendation, You Approve)

1. **R-001: RLS Security Validation** - QA recommends P0 security tests for CV/evaluation isolation (Dev + QA, Sprint 0)
2. **T-003: n8n Evaluation Fixtures** - Create seed data for evaluations since n8n backend is out of scope (Dev, Sprint 0)
3. **R-003: Load Test Infrastructure** - Consider load testing setup for NFR1 (job feed <2s) (Dev, Sprint 1)

**What we need from team:** Review recommendations and approve (or suggest changes).

---

### INFO ONLY - Solutions Provided (Review, No Decisions Needed)

1. **Test strategy**: 70% E2E / 20% API / 10% Unit (limited pure logic to test)
2. **Tooling**: Playwright (configured via `tea_use_playwright_utils: true`)
3. **Tiered CI/CD**: PR (~10 min), Nightly (all tests), Weekly (performance)
4. **Coverage**: ~37 test scenarios prioritized P0-P3 with risk-based classification
5. **Quality gates**: P0=100%, P1>=95%, High-risk mitigations complete

**What we need from team:** Just review and acknowledge (we already have the solution).

---

## For Architects and Devs - Open Topics

### Risk Assessment

**Total risks identified**: 7 (2 high-priority score >= 6, 3 medium, 2 low)

#### High-Priority Risks (Score >= 6) - IMMEDIATE ATTENTION

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation | Owner | Timeline |
|---------|----------|-------------|-------------|--------|-------|------------|-------|----------|
| **R-001** | **SEC** | CV data exposed to other users (RLS bypass) | 2 | 3 | **6** | P0 security tests for RLS on `users.cv_raw` and `evaluations` | QA | Sprint 0 |
| **R-002** | **TECH** | No test automation = regressions shipped | 3 | 2 | **6** | Configure Playwright, write critical path E2E | Dev | Sprint 0 |

#### Medium-Priority Risks (Score 3-5)

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation | Owner |
|---------|----------|-------------|-------------|--------|-------|------------|-------|
| R-003 | PERF | Job feed slow with 100+ evaluations | 2 | 2 | 4 | Load test with 100+ records | QA |
| R-005 | BUS | n8n evaluations missing/stale | 2 | 2 | 4 | Health check for evaluation freshness | Ops |
| R-007 | SEC | OAuth callback URL manipulation | 1 | 3 | 3 | Test OAuth redirect validation | QA |

#### Low-Priority Risks (Score 1-2)

| Risk ID | Category | Description | Probability | Impact | Score | Action |
|---------|----------|-------------|-------------|--------|-------|--------|
| R-004 | DATA | Fingerprint mismatch (evaluation orphans) | 1 | 2 | 2 | Monitor |
| R-006 | OPS | No rollback strategy defined | 1 | 3 | 3 | Monitor (Vercel has auto-rollback) |

#### Risk Category Legend

- **TECH**: Technical/Architecture (flaws, integration, scalability)
- **SEC**: Security (access controls, auth, data exposure)
- **PERF**: Performance (SLA violations, degradation, resource limits)
- **DATA**: Data Integrity (loss, corruption, inconsistency)
- **BUS**: Business Impact (UX harm, logic errors, revenue)
- **OPS**: Operations (deployment, config, monitoring)

---

### Testability Concerns and Architectural Gaps

**ACTIONABLE CONCERNS - Architecture Team Must Address**

#### 1. Blockers to Fast Feedback (WHAT WE NEED FROM ARCHITECTURE)

| Concern | Impact | What Architecture Must Provide | Owner | Timeline |
|---------|--------|--------------------------------|-------|----------|
| **No test framework configured** | Cannot run any automated tests | Configure Playwright + Vitest, add to CI | Dev | Sprint 0 |
| **No test data seeding** | Cannot set up test scenarios | Create evaluation/job fixture data or seeding helpers | Dev | Sprint 0 |
| **n8n backend out of scope** | Cannot test full user journey with real evaluations | Provide mock evaluation data in test fixtures | Dev | Sprint 0 |

#### 2. Architectural Improvements Needed (WHAT SHOULD BE CHANGED)

1. **Test Data Fixtures**
   - **Current problem**: No mechanism to seed evaluations or jobs for testing
   - **Required change**: Create JSON fixtures or factory functions for test data
   - **Impact if not fixed**: Tests cannot run without manual database setup
   - **Owner**: Dev
   - **Timeline**: Sprint 0

---

### Testability Assessment Summary

**CURRENT STATE - FYI**

#### What Works Well

- Server Actions are directly callable via API tests (headless interaction)
- RLS provides data isolation per user (testable boundaries)
- TypeScript ensures type safety (compile-time error detection)
- Clear frontend/backend separation (n8n out of scope = clear boundaries)
- Established patterns documented in architecture.md (consistent test approach)

#### Accepted Trade-offs (No Action Required)

For job-radar MVP, the following trade-offs are acceptable:

- **No error monitoring** - Console only; Sentry recommended post-MVP
- **No metrics endpoint** - Not needed for MVP scale
- **No real-time subscriptions** - Polling sufficient for MVP

This is acceptable for Phase 1 and should be revisited post-GA.

---

### Risk Mitigation Plans (High-Priority Risks >= 6)

#### R-001: CV Data Exposure via RLS Bypass (Score: 6) - HIGH

**Mitigation Strategy:**

1. Write P0 security tests that attempt cross-user data access
2. Verify RLS policies on `users` and `evaluations` tables
3. Test with two authenticated users, confirm isolation

**Owner:** QA + Dev
**Timeline:** Sprint 0
**Status:** Planned
**Verification:** Security test suite passes with 100% RLS coverage

#### R-002: No Test Automation (Score: 6) - HIGH

**Mitigation Strategy:**

1. Configure Playwright with project structure (`playwright.config.ts` already exists)
2. Create base fixtures for authentication and data seeding
3. Write 5-10 critical path E2E tests (auth, onboarding, job view)
4. Add to CI pipeline (GitHub Actions or Vercel)

**Owner:** Dev
**Timeline:** Sprint 0
**Status:** Planned
**Verification:** CI runs tests on every PR, failures block merge

---

### Assumptions and Dependencies

#### Assumptions

1. Supabase RLS policies are correctly configured and enforced
2. n8n backend will continue to populate evaluations table
3. MVP scale (~50 users, ~100 jobs per user) does not require performance optimization
4. Test framework setup can be completed in Sprint 0

#### Dependencies

1. **Playwright configuration** - Required by Sprint 0 end
2. **Test data fixtures** - Required by Sprint 0 end
3. **CI pipeline setup** - Required before first test suite runs

#### Risks to Plan

- **Risk**: Sprint 0 test setup takes longer than expected
  - **Impact**: Delays P0 test coverage
  - **Contingency**: Prioritize auth + RLS security tests only

---

**End of Architecture Document**

**Next Steps for Architecture Team:**

1. Review Quick Guide (BLOCKERS/HIGH PRIORITY/INFO ONLY) and prioritize blockers
2. Assign owners and timelines for high-priority risks (>= 6)
3. Validate assumptions and dependencies
4. Provide feedback to QA on testability gaps

**Next Steps for QA Team:**

1. Wait for Sprint 0 blockers to be resolved
2. Refer to companion QA doc (test-design-qa.md) for test scenarios
3. Begin test infrastructure setup (factories, fixtures, environments)
