# TODO Later — Production Hardening

Items that were intentionally deferred during the production readiness sprint.
Address these before significant user growth.

---

## 🔴 High Priority

### 1. Complete Account Deletion (GDPR)
**File:** `src/app/(app)/account/actions.ts`
**What:** `deleteAccount` deletes the `users` row and `evaluations`, but the Supabase Auth identity survives. The user can log back in with the same credentials.
**How to fix:**
```ts
// 1. Add SUPABASE_SERVICE_ROLE_KEY to .env.local (never NEXT_PUBLIC_)
// 2. Create an admin client:
import { createClient } from "@supabase/supabase-js";
const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
// 3. Before deleting the users row:
await adminClient.auth.admin.deleteUser(user.id);
```
Note: DB-level CASCADE on `user_id` is confirmed, so evaluations will clean up automatically once the auth identity is deleted.

---

### 2. Rate Limiting on Auth + API Endpoints
**Endpoints:** `/auth/callback`, login, signup, `/api/parse-cv`
**What:** No rate limiting. Vulnerable to brute force on auth and free compute abuse on the CV parser.
**How to fix:** Use Upstash Rate Limit (free tier sufficient for MVP):
```bash
npm install @upstash/ratelimit @upstash/redis
```
Wrap server actions or route handlers with a rate limiter keyed on IP or user ID.
Reference: https://upstash.com/docs/redis/sdks/ratelimit-ts/overview

---

### 3. CI/CD Pipeline
**What:** No automated lint → build → test on push. Every deploy is manual and unverified.
**How to fix:** Create `.github/workflows/ci.yml`:
```yaml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22' }
      - run: npm ci
      - run: npm run lint
      - run: npm run build
```

---

## 🟡 Medium Priority

### 4. Fix `?status=hidden` Blank Dashboard
**File:** `src/app/(app)/dashboard/page.tsx`
**What:** Navigating to `/dashboard?status=hidden` shows an empty list with no message because hidden evaluations are excluded from the query but the filter requests them.
**Fix:** Either exclude `"hidden"` from the valid `initialStatuses` filter values, or include hidden evaluations in the page query when explicitly requested.

### 5. Cap Onboarding Free-Text Array Inputs
**Files:** `src/app/(app)/onboarding/actions.ts`
**What:** `roles`, `locations`, `industries`, `excludedCompanies`, etc. are written to DB without length limits. A user could submit 10,000 items or 1MB strings per field.
**Fix:** Add validation in each action:
```ts
if (!Array.isArray(roles) || roles.length > 20) return { error: "..." };
if (roles.some(r => r.length > 200)) return { error: "..." };
```

### 6. Dashboard Pagination at Page Level
**File:** `src/app/(app)/dashboard/page.tsx`
**What:** Fetches ALL non-hidden evaluations on every page load with no LIMIT. Will degrade as users accumulate job matches.
**Fix:** Add `.limit(200)` as a soft cap now; implement proper cursor-based pagination later.

### 7. Improve Email Validation
**File:** `src/app/(app)/account/actions.ts:56`
**What:** Email validation is only `includes("@")`. Garbage emails pass.
**Fix:** `const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;`

### 8. Guard Onboarding Actions Against Replay After Completion
**Files:** `src/app/(app)/onboarding/actions.ts`
**What:** `saveJobPreferences` and other onboarding actions will overwrite preferences even after `onboarding_completed = true`. A user hitting back in the browser could accidentally reset their profile.
**Fix:** Check `onboarding_completed` at the start of each action and return early if already complete.

---

## 🟢 Nice to Have

### 9. Analytics
Add Plausible or Posthog to understand the onboarding funnel and feature usage.

### 10. Loading Skeletons for Profile + Settings
`src/app/(app)/profile/loading.tsx` and `src/app/(app)/settings/loading.tsx` don't exist yet. Dashboard has one now.

### 11. Lazy-load CV Parser Libraries
`mammoth` and `unpdf` are large. They're only used on the CV upload route — consider `next/dynamic` or lazy imports to reduce cold start time.

### 12. Supabase Join on Dashboard Query
Replace the two-query pattern (evaluations → jobs) with a single join:
```ts
.from("evaluations").select("*, jobs!fingerprint_job(*)")
```
Requires the FK relationship to be defined in Supabase schema.

### 13. Add `sitemap.xml`
Create `src/app/sitemap.ts` (Next.js App Router convention) to generate a sitemap for public pages (landing, privacy, terms).

### 14. Aria Labels on Icon Buttons
Icon-only buttons in `JobActions.tsx` are missing `aria-label` attributes. Add them for screen reader accessibility.
