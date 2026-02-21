-- =============================================
-- Job Radar: Add Profile Preference Fields
-- =============================================
-- New fields for restructured profile page:
-- - Dealbreakers (free text)
-- - Focus areas (free text)
-- - Company size preferences (multi-select)
-- - Watchlist companies (array)
-- - Language preferences (array)

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS pref_dealbreakers TEXT,
  ADD COLUMN IF NOT EXISTS pref_focus TEXT,
  ADD COLUMN IF NOT EXISTS pref_company_sizes TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS pref_watchlist_companies TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS pref_languages TEXT[] DEFAULT '{}';
