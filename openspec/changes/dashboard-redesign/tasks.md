## 1. Database Migration

- [x] 1.1 Write migration SQL: `ALTER TABLE users ADD COLUMN top_pick_threshold INTEGER DEFAULT 85;`
- [ ] 1.2 Apply migration to Supabase (manual execution)
- [x] 1.3 Add `top_pick_threshold: number | null` to the user query types in `src/types/database.ts`

## 2. Threshold Settings (Settings Page)

- [x] 2.1 Add `updateTopPickThreshold` server action to `src/app/(app)/settings/actions.ts` — reads `top_pick_threshold` from formData, validates 70–100, writes to `users` table
- [x] 2.2 Create `src/app/(app)/settings/ThresholdSettingsForm.tsx` — client component with a range slider (min=70 max=100 step=1), live helper text showing "Also showing jobs scoring {T-15}–{T-1}%", and `useActionState` wired to `updateTopPickThreshold`
- [x] 2.3 Update `src/app/(app)/settings/page.tsx` — add `top_pick_threshold` to the `users` SELECT query and pass it as a prop to `ThresholdSettingsForm`; render `ThresholdSettingsForm` in the settings form stack

## 3. Dashboard Data Fetching

- [x] 3.1 Update `src/app/(app)/dashboard/page.tsx` — remove `PAGE_SIZE` pagination; fetch all non-hidden evaluations for the user in one query (no `.range()` limit)
- [x] 3.2 Add `top_pick_threshold` and `first_name` to the users query in `dashboard/page.tsx`
- [x] 3.3 Add a helper `pctToScore(pct: number): number` (returns `pct / 10`) in a shared location (e.g. inline in `dashboard/page.tsx` or a small util) to convert threshold percentage to 0–10 DB scale
- [x] 3.4 Write time-bucket assignment logic in `dashboard/page.tsx`: classify each `JobWithEvaluation` into one of four buckets (`last24h`, `last7d`, `last30d`, `older`) based on `job.created_at`; null `created_at` falls into `older`
- [x] 3.5 Write tier-split helper: given an array of `JobWithEvaluation` and a threshold (0–10), return `{ top, also, below }` arrays using the boundaries from the spec (top ≥ T, also ≥ T−1.5 AND < T, below < T−1.5)

## 4. Welcome Banner

- [x] 4.1 Compute banner stats in `dashboard/page.tsx` server component: count of jobs with `job.created_at >= now - 24h` (total and ≥ threshold); top 1–2 `company_industry` values from those jobs; applied and saved counts for current week from `evaluations.status`; profile completeness percentage from key user fields
- [x] 4.2 Define a `BannerStats` TypeScript interface covering all banner data fields
- [x] 4.3 Create `src/app/(app)/dashboard/WelcomeBanner.tsx` — client component (or server-compatible) accepting `BannerStats` prop; renders greeting, contextual message (or zero-state fallback when `topPicksToday === 0`), weekly activity line, stat counters for "new today" and "top picks"

## 5. Time-Grouped Job List

- [x] 5.1 Create `src/app/(app)/dashboard/TimeGroup.tsx` — client component accepting `{ period: string; topJobs: JobWithEvaluation[]; alsoJobs: JobWithEvaluation[]; belowJobs: JobWithEvaluation[]; defaultCollapsed?: boolean }` props; manages local collapse state (for "Older" section) and per-bucket show-all toggle state
- [x] 5.2 Implement tier label rendering in `TimeGroup`: hide "Top Picks" label when `topJobs` is empty; hide "Also Worth a Look" label when `alsoJobs` is empty; hide "Show all" toggle when `belowJobs` is empty
- [x] 5.3 Implement score badge colour logic in `TimeGroup` / job card: green for top tier, amber for also tier, grey/muted for below tier; below-threshold cards rendered at reduced opacity when revealed
- [x] 5.4 Create `src/app/(app)/dashboard/TimeGroupedJobList.tsx` — client component accepting pre-bucketed and pre-tiered data for all four time periods; renders only buckets with ≥ 1 job across any tier; passes `defaultCollapsed={true}` to the "Older" `TimeGroup`

## 6. Dashboard Page Assembly

- [x] 6.1 Update `dashboard/page.tsx` to render `WelcomeBanner` with computed stats above the filter bar
- [x] 6.2 Replace `<JobList>` with `<TimeGroupedJobList>` in `dashboard/page.tsx`, passing the pre-bucketed + pre-tiered job data
- [x] 6.3 Verify the existing filter bar still renders between the banner and the job sections with no layout regressions
- [x] 6.4 Confirm existing job card actions (Save, Applied, Hide, View Job) still work correctly within the new layout

## 7. Client-Side Filter Integration

- [x] 7.1 Wire existing filter state (score range, date posted, status, sort) to filter/sort the full pre-fetched job set client-side before passing to `TimeGroupedJobList`; empty buckets after filtering are hidden per spec

## 8. Verification

- [ ] 8.1 Manually verify: dashboard loads with time-grouped sections, empty buckets hidden, "Older" collapsed by default
- [ ] 8.2 Manually verify: tier split reflects the user's saved threshold (change threshold in settings, reload dashboard, confirm Top Picks boundary changes)
- [ ] 8.3 Manually verify: "Show all" toggle reveals below-threshold cards at reduced opacity within the correct time bucket
- [ ] 8.4 Manually verify: zero-state banner message shows when no top picks today
- [ ] 8.5 Manually verify: settings slider live-updates the helper text; saving persists the value across page reloads
