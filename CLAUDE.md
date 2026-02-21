# CLAUDE.md

## 1. Project Overview
- `job-radar` is a Next.js App Router web app for AI-assisted job matching (`Jobfishing` brand in UI copy).
- Users sign up, complete onboarding (preferences + CV + digest time), then review scored job matches and manage status (`new`, `saved`, `applied`, `hidden`).
- Current status: active MVP in development (full app flows + E2E tests, but deployment/CI not wired in repo).

## 2. Tech Stack
- Language(s) and version(s)
- TypeScript (`strict: true`), React `19.2.3`, Next.js `16.1.6`, Node.js `22` (`.nvmrc`).

- Framework(s) and key libraries
- Next.js App Router + Server Components + Server Actions.
- Supabase SSR/auth: `@supabase/ssr`, `@supabase/supabase-js`.
- UI: Tailwind CSS v4, shadcn/ui components, Radix primitives, `sonner` toasts.
- File parsing API: `mammoth` (DOCX) and `unpdf` (PDF).
- Icons used in code: `react-feather`.
- Testing: Playwright (`@playwright/test`), Faker (`@faker-js/faker`).

- Database / storage
- Supabase Postgres tables used in app code: `users`, `jobs`, `evaluations`.
- Supabase Auth for user identity.

- Hosting / deployment platform
- No deployment config checked in (`.github/workflows`, `vercel.json`, `Dockerfile`, `docker-compose` are absent).
- App is structured as a standard Next.js app and can be deployed on any Next-compatible platform.

- External APIs and services
- Supabase project APIs (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
- Browser opens external job application URLs from stored `apply_url`/`url`.

## 3. Project Structure
- Top-level map (2-3 levels)
```text
src/
  app/
    (app)/
      dashboard/
      jobs/[id]/
      onboarding/{step-1,step-2,step-3,complete}/
      profile/
      settings/
    (auth)/
      login/
      signup/
      forgot-password/
      reset-password/
    api/parse-cv/
    auth/callback/
    privacy/
    terms/
  components/
    ui/
  lib/
    supabase/
  hooks/
  types/
supabase/
  migrations/
tests/
  e2e/
  support/{fixtures,factories,seed}
  .env.example
```

- Key directory purpose
- `src/app/(app)`: authenticated product flows.
- `src/app/(auth)`: authentication screens + auth server actions.
- `src/app/api/parse-cv/route.ts`: server route for CV text extraction.
- `src/lib/supabase/*`: browser/server/middleware Supabase clients.
- `src/components/ui`: shared design system primitives.
- `supabase/migrations`: SQL migrations (manual execution model).
- `tests/e2e`: Playwright specs by project type (`setup`, `seed`, `authenticated`, `public`).
- `_bmad` and `_bmad-output`: planning/agent artifacts (not runtime app code).

- Non-obvious conventions
- Route groups `(app)` and `(auth)` keep URL clean while separating layout/concerns.
- Most mutations are colocated `actions.ts` files and consumed with `useActionState` in client components.
- `src/components/ui/.next/*` files exist and are currently tracked in repo (likely accidental artifacts).

## 4. Architecture & Patterns
- Architecture style
- Single Next.js monolith (frontend + BFF-style server logic) with Supabase as external backend service.

- Key design patterns used
- Server Components for page-level reads from Supabase.
- Server Actions (`"use server"`) for writes and form workflows.
- Middleware-based auth/session refresh and route gating (`src/middleware.ts`, `src/lib/supabase/middleware.ts`).
- Typed state-return pattern for form actions (`{ error?: string; success?: boolean }`).

- Data flow overview
- Request hits Next middleware -> Supabase auth session refreshed -> protected routes redirected if unauthenticated.
- Server page reads current user + domain data from Supabase and renders UI.
- Client forms submit to Server Actions -> action validates -> writes Supabase -> `revalidatePath` / `redirect`.
- Dashboard and job detail pages fetch `evaluations`, then fetch `jobs` by `fingerprint_job`, then compose UI view models.

- State management approach (frontend)
- Local React state (`useState`, `useEffect`, `useTransition`) for filters, optimistic status toggles, and form UX.
- No Redux/Zustand/global client store.

## 5. Development Setup
- Install dependencies
```bash
npm install
```

- Required environment variables (no secrets)
- App runtime (`.env.local`):
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- E2E tests (`tests/.env` and/or `.env.local` fallback):
  - `BASE_URL` (optional, default `http://localhost:3000`)
  - `SUPABASE_URL` (or use `NEXT_PUBLIC_SUPABASE_URL`)
  - `SUPABASE_ANON_KEY` (or use `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
  - `SUPABASE_SERVICE_ROLE_KEY` (required for seeding project)
  - `TEST_USER_EMAIL`
  - `TEST_USER_PASSWORD`
  - `TEST_ENV` (documented in `tests/.env.example`)

- Run locally
```bash
npm run dev
```

- Run tests
```bash
npm test
npm run test:public
npm run test:auth
npm run test:ui
npm run test:headed
npm run test:debug
npm run test:report
```

## 6. Build & Deploy
- Build commands
```bash
npm run build
npm run start
npm run lint
```

- Deployment pipeline / process
- Not automated in-repo yet.
- Current deploy process must be handled manually outside repo.

- Environments
- Local development via `.env.local`.
- Playwright test environment via `tests/.env` (+ `.env.local` fallback loaded in `tests/support/global-setup.ts`).
- No repo-defined staging/prod pipeline.

- CI/CD configuration
- None checked in (`.github/workflows` absent).

## 7. Key Commands
```bash
npm run dev          # start Next.js dev server
npm run build        # production build
npm run start        # run built app
npm run lint         # run ESLint
npm test             # run full Playwright suite
npm run test:public  # Playwright public project
npm run test:auth    # Playwright authenticated project
npm run test:ui      # Playwright UI mode
npm run test:headed  # headed browser tests
npm run test:debug   # Playwright debug mode
npm run test:report  # open Playwright HTML report
npx playwright install   # install Playwright browsers
cp tests/.env.example tests/.env  # create test env file
```

## 8. Code Conventions & Style
- Naming conventions
- Components/files: `PascalCase` for React components (example: `JobCard.tsx`).
- Functions/variables: `camelCase`.
- DB columns and status literals: `snake_case`.
- Route/action convention: feature folder + colocated `actions.ts`.

- Import order preferences
- No strict import-order lint rule is configured; follow existing local file style (framework/lib imports first, then internal aliases).

- Error handling patterns
- Server actions return typed error/success state for form rendering.
- Auth/route protection usually redirects (`redirect("/login")`) instead of throwing.
- API route (`parse-cv`) returns `NextResponse.json` with explicit status codes.

- Logging approach
- `console.error`/`console.warn` in server actions and test setup/seeding.
- No structured logging library configured.

- TypeScript strictness / lint rules
- TypeScript `strict: true` in `tsconfig.json`.
- ESLint uses `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`.

## 9. Important Files
- App entry/layout
- `src/app/layout.tsx`: global font, tooltip provider, sonner toaster.
- `src/app/page.tsx`: landing page + auth-aware redirect to onboarding/dashboard.
- `src/app/(app)/layout.tsx`: authenticated shell (sidebar + header).

- Auth and session
- `src/middleware.ts`: middleware entrypoint.
- `src/lib/supabase/middleware.ts`: session refresh + route access redirects.
- `src/app/(auth)/actions.ts`: signup/login/logout/password reset actions.
- `src/app/auth/callback/route.ts`: Supabase code exchange + post-auth redirect logic.

- Domain flows
- `src/app/(app)/dashboard/page.tsx` + `src/app/(app)/dashboard/actions.ts`.
- `src/app/(app)/jobs/[id]/page.tsx` + `src/app/(app)/jobs/[id]/actions.ts`.
- `src/app/(app)/onboarding/actions.ts`.
- `src/app/(app)/profile/actions.ts`.
- `src/app/(app)/settings/actions.ts`.
- `src/app/api/parse-cv/route.ts`.

- Shared types/config
- `src/types/database.ts`: hand-maintained app data types.
- `playwright.config.ts`: multi-project E2E config + webServer.
- `tests/support/global-setup.ts`: env loading + test preflight.
- `components.json`: shadcn config.

- Data and schema
- `supabase/migrations/*.sql`: users/evaluations migrations.

## 10. Known Gotchas & Constraints
- Schema drift risk
- `supabase/migrations/003_evaluations_table.sql` defines `id` + `job_id`, but app code expects `uuid_evaluation` + `fingerprint_job` across `src/app/(app)/dashboard/*`, `src/app/(app)/jobs/[id]/*`, and tests. Treat migrations as potentially outdated relative to live schema.

- Icon mismatch risk
- `components.json` declares `"iconLibrary": "lucide"`, but existing codebase consistently imports from `react-feather`. Running shadcn generators may introduce lucide imports unless manually adjusted.

- Test prerequisites
- Authenticated and seeded E2E projects require valid Supabase credentials and a test user.
- `SUPABASE_SERVICE_ROLE_KEY` is mandatory for `seed` project (`tests/e2e/seed.setup.ts`).

- UI consistency constraint
- Existing styles mix semantic tokens and direct slate classes in some onboarding/auth forms; avoid introducing a third style pattern.

- Performance considerations
- Dashboard filtering applies some logic client-side after two Supabase calls (evaluations + jobs). Large datasets may need server-side joins/RPC later.

## 11. Common Tasks
- How to add a new API endpoint
1. Create route file under `src/app/api/<endpoint>/route.ts`.
2. Export HTTP handlers (`GET`, `POST`, etc.) returning `NextResponse`.
3. Validate payloads explicitly and return typed error JSON.
4. If auth is needed, create Supabase server client and check `auth.getUser()`.

- How to add a new page/component
1. Add page in `src/app/.../page.tsx` under appropriate route group.
2. For authenticated app pages, place under `src/app/(app)/...` to inherit sidebar layout.
3. Add feature UI components in same folder or shared UI in `src/components` / `src/components/ui`.
4. For mutating forms, add colocated `actions.ts` with `"use server"` and bind via `useActionState`.

- How to add a new database migration
1. Add SQL file in `supabase/migrations/<NNN>_<name>.sql`.
2. Apply SQL to Supabase manually (current repo has no automated migration runner).
3. Update app queries/types (`src/types/database.ts`) to match new schema.
4. Update tests/seeding if schema changes touch `users`, `jobs`, or `evaluations`.

- How to add a new environment variable
1. Add usage via `process.env.<NAME>` in code.
2. Document it in `tests/.env.example` (for test vars) and in this `CLAUDE.md`.
3. Add to local `.env.local` or `tests/.env` as appropriate.
4. For Playwright, remember `tests/support/global-setup.ts` loads both `tests/.env` and root `.env.local`.

## 12. Testing
- Testing framework and approach
- Playwright E2E only (no unit/integration framework configured).
- Multi-project pipeline: `setup` (login state) -> `seed` (test data) -> `authenticated` tests.
- Public page tests run separately in `public` project.

- How to write a new test
1. Add spec in `tests/e2e/` with suffix:
   - `*.authenticated.spec.ts` (requires login/seed)
   - `*.public.spec.ts` (no login)
2. Import fixtures from `tests/support/fixtures/merged-fixtures` when custom fixtures are needed.
3. Use `data-testid` selectors where possible (`playwright.config.ts` sets `testIdAttribute`).

- What needs coverage
- Auth flows: login/signup/password reset callback and redirects.
- Onboarding step progression and persisted user fields.
- Dashboard filtering/sorting/load-more behavior.
- Job status transitions (`saved`, `applied`, `hidden`, `viewed`).
- RLS boundaries (see `tests/e2e/rls-security.authenticated.spec.ts`).

- How to run specific suites
```bash
npx playwright test tests/e2e/dashboard.authenticated.spec.ts
npx playwright test --project=authenticated
npx playwright test --project=public
npx playwright test --project=mobile
```

## Project-Specific Notes
- Existing persistent instruction: use `react-feather` for icons across app/UI components.
- Existing persistent instruction: consult shadcn MCP tools before major UI component changes.
