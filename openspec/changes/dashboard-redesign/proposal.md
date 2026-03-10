## Why

The current dashboard is a flat, unordered list of job matches with no signal hierarchy — users have to manually scan every card to find their best opportunities. The redesign introduces time grouping, score-based tiers, and a personalized welcome banner so users immediately see what's most relevant without scrolling through noise.

## What Changes

- Replace the flat job list with four time-bucketed sections (Last 24h / 7d / 30d / Older), each collapsed independently
- Within each time bucket, split jobs into two tiers based on the user's configurable score threshold (default 85%), with a toggle to reveal lower-scoring matches
- Add a personalized welcome banner at the top of the dashboard showing today's new match count, top industries, and weekly activity stats, with a zero-state fallback referencing the last 7 days
- Add a "Top pick threshold" slider to the Settings page, stored per-user in Supabase, that controls the tier split across the dashboard
- The "Older than 30 Days" time group is collapsed by default with a job count badge; users expand it on demand
- Existing job cards, filter bar, and sidebar navigation remain unchanged

## Capabilities

### New Capabilities

- `welcome-banner`: Personalized greeting with today's top-match count, industry breakdown, weekly activity (applied/saved), profile completeness, and zero-state fallback to 7-day data
- `time-grouped-jobs`: Jobs partitioned into four time buckets by `created_at`; empty buckets hidden; "Older than 30 Days" collapsed by default with a count badge
- `tiered-priority`: Within each time bucket, jobs split into Top Picks (≥ threshold), Also Worth a Look (threshold−15% to threshold−1%), and hidden-by-default low matches; tiers hidden when empty
- `threshold-settings`: Per-user slider on the Settings page (70–100%, default 85%) that persists to `profiles.threshold` in Supabase; auto-calculated "Also Worth a Look" range shown below the slider

### Modified Capabilities

_(none — existing filter bar, job cards, and sidebar are unchanged at the requirements level)_

## Impact

- **`src/app/(app)/dashboard/page.tsx`**: Major restructure — replaces flat job list with grouped/tiered layout; adds welcome banner data fetch
- **`src/app/(app)/dashboard/actions.ts`**: May need new server action or query helpers for banner stats (today's match count, weekly activity)
- **`src/app/(app)/settings/page.tsx`** + **`src/app/(app)/settings/actions.ts`**: New threshold slider field + save action
- **`src/types/database.ts`**: Add `threshold` field to user/profile type if not already present
- **Supabase `profiles` table**: Needs `threshold` integer column (default 85); migration required
- **No changes** to job cards, filter components, sidebar, auth flows, or scoring pipeline
