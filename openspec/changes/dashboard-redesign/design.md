## Context

The existing dashboard fetches up to 20 evaluations paginated, renders them in a flat list via `JobList`, and applies filters/sorting mostly client-side or in a server action (`loadMoreJobs`). The redesign groups jobs by time bucket and splits them by score tier — two structural changes that conflict with the current pagination-first model.

Relevant existing state:
- Scores are stored as **0–10 floats** in `evaluations.score_total` (e.g. 8.5 = 85%).
- The `users` table (not `profiles`) holds per-user settings. An existing `notify_threshold` (float, 1–10) controls notification gating — the new "top pick threshold" is a separate concept.
- Time-grouping should use `jobs.created_at` (when the job entered the system), not `evaluations.created_at`.
- The `users` table already has `first_name` via the onboarding flow.

## Goals / Non-Goals

**Goals:**
- Render all non-hidden evaluations grouped by time bucket and split by score tier
- Compute welcome banner stats (today's counts, top industries, weekly activity) server-side
- Add a per-user `top_pick_threshold` integer (70–100) to the `users` table, defaulting to 85
- Add a threshold slider to the Settings page, saving via an existing-pattern server action
- Keep existing job cards, filter bar, sidebar, and status actions unchanged

**Non-Goals:**
- Replacing the existing filter/sort controls or their action logic
- Adding server-side pagination within time-grouped sections
- Notification threshold changes (separate `notify_threshold` column is untouched)
- Any changes to scoring, scraping, or auth flows

## Decisions

### 1. Fetch all evaluations at page load (no page-level pagination)

**Decision**: Remove the `PAGE_SIZE = 20` pagination from `dashboard/page.tsx` and fetch all non-hidden evaluations for the user in one server-side pass, then group them by time bucket.

**Rationale**: Pagination is incompatible with time grouping — a "Last 24 Hours" section must show all jobs from that window, not an arbitrary slice of the top-20 by score. The existing load-more UX is replaced by collapsible time sections.

**Alternative considered**: Per-section pagination (load-more within each bucket). Rejected as premature complexity — most users will have <200 evaluated jobs, well within a single query.

**Trade-off**: Large result sets (>500 rows) could slow initial render. Acceptable for MVP; can add per-bucket virtual scrolling later.

### 2. Threshold stored as integer percentage in `users` table

**Decision**: Add column `top_pick_threshold INTEGER DEFAULT 85` to the `users` table. The slider UI operates in percentage (70–100). Convert to 0–10 scale only when querying evaluations (`db_threshold = top_pick_threshold / 10.0`).

**Rationale**: Using the `users` table matches the existing pattern (settings page already reads/writes there). A new column avoids colliding with `notify_threshold`. Storing as percentage integer makes the slider binding trivial and the DB value self-documenting.

**Alternative considered**: Reusing `notify_threshold` for both purposes. Rejected — they serve different features and are on different UX scales (notify uses 1–10, dashboard uses 70–100%).

### 3. Time grouping on `jobs.created_at` via joined data

**Decision**: After fetching evaluations, fetch associated jobs by fingerprint (existing two-query pattern). Assign each `JobWithEvaluation` to a time bucket based on `job.created_at` relative to `Date.now()`. Bucket assignment is done in the server page before passing data to the client.

**Bucket boundaries:**
- Last 24h: `created_at >= now - 24h`
- Last 7d: `created_at >= now - 7d AND < now - 24h`
- Last 30d: `created_at >= now - 30d AND < now - 7d`
- Older: `created_at < now - 30d` OR `created_at` is null (fallback)

**Rationale**: Server-side bucketing means client components receive pre-partitioned arrays and don't need to re-run date arithmetic.

### 4. Component boundaries: server page → typed props → client island

**Decision**: `dashboard/page.tsx` (server component) computes:
1. Time-bucketed + tier-split job arrays
2. Welcome banner stats struct

It passes these as typed props to two new client components:
- `WelcomeBanner` (client) — receives `BannerStats` prop, no interactivity beyond static display
- `TimeGroupedJobList` (client) — receives `TimeBuckets` prop; owns collapse state (Older section) and show-all toggle state (per bucket)

The existing `JobList` client component is replaced by `TimeGroupedJobList`. Filter bar stays wired to `JobList`'s existing action pattern — filters can be applied before bucketing by re-querying in a new server action, or applied client-side over the full pre-fetched set.

**Decision on filters**: Apply filters client-side over the full pre-fetched job set. The dataset is small enough and this avoids an extra server round-trip on filter change.

### 5. Threshold settings as a new client form alongside existing ones

**Decision**: Add a new `ThresholdSettingsForm` client component (pattern matches `NotificationSettingsForm`). It renders a native `<input type="range">` styled with Tailwind, with helper text updating via `useState`. A new `updateTopPickThreshold` server action in `settings/actions.ts` validates (70 ≤ value ≤ 100) and writes to `users.top_pick_threshold`.

**Rationale**: Follows the exact existing pattern; no new libraries needed.

## Risks / Trade-offs

- **Score scale mismatch** → Threshold UI is percentage (85), DB scores are 0–10 (8.5). Conversion must be applied consistently in every comparison. Mitigation: define a single helper `pctToScore(pct: number) = pct / 10` used in both server page and wherever the filter bar score ranges are computed.

- **Null `job.created_at`** → Some jobs may have null `created_at`. Mitigation: null-`created_at` jobs fall into the "Older" bucket as a safe default.

- **Full fetch performance** → Fetching all evaluations + jobs could be slow at scale. Mitigation: no action for MVP; add an index on `evaluations(user_id, status)` as a low-risk improvement if needed.

- **Filter bar interaction with time groups** → Existing filter controls (score range, date posted, status) were designed for a flat list. After the redesign, applying a "date posted" filter would conflict with time grouping. Mitigation: keep date-posted filter but note it narrows within buckets (a "Last 7 Days" date filter applied on top of the "Last 30 Days" bucket will simply empty that bucket, which hides it per spec). No redesign of the filter bar needed.

## Migration Plan

1. Add migration: `ALTER TABLE users ADD COLUMN top_pick_threshold INTEGER DEFAULT 85;`
2. Update `src/types/database.ts` — add `top_pick_threshold: number | null` to the user/settings type inferred from `users` table.
3. Implement `ThresholdSettingsForm` + `updateTopPickThreshold` action.
4. Implement `WelcomeBanner` + banner stats query in `dashboard/page.tsx`.
5. Implement `TimeGroupedJobList` with tier-split logic.
6. Replace `JobList` usage in `dashboard/page.tsx` with `TimeGroupedJobList`.
7. Remove `PAGE_SIZE` pagination logic from page; update `loadMoreJobs` if needed for filter-only use.

Rollback: revert `dashboard/page.tsx` to current flat `JobList` pattern; the DB column addition is additive and safe to leave in place.

## Open Questions

- **Filter bar scope**: Should score-range filters in the filter bar override the tier boundaries, or operate independently? (Current assumption: they narrow the visible set within each tier, not the tier thresholds themselves.)
- **Welcome banner industry source**: `company_industry` from the `jobs` table is used for top-industry grouping. If this field is sparsely populated, the banner message may be generic. Acceptable for MVP.
- **First name source**: `users.first_name` — confirm this column is populated after onboarding step-1 before relying on it in the banner.
