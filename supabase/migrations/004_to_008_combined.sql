-- =============================================
-- Job Radar: Combined migrations 004 through 008
-- =============================================
-- Run this in Supabase Dashboard → SQL Editor if migrations 004-008
-- were not yet applied.

-- =============================================
-- 004: Add profile preference fields
-- =============================================
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS pref_dealbreakers TEXT,
  ADD COLUMN IF NOT EXISTS pref_focus TEXT,
  ADD COLUMN IF NOT EXISTS pref_company_sizes TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS pref_watchlist_companies TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS pref_languages TEXT[] DEFAULT '{}';

-- =============================================
-- 005: Add work modes array (replaces pref_remote boolean)
-- =============================================
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS pref_work_modes TEXT[] DEFAULT '{}';

-- Skipped: migration of pref_remote → pref_work_modes (pref_remote already dropped)

-- =============================================
-- 006: Add seniority levels and excluded industries
-- =============================================
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS pref_seniority_levels TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS pref_excluded_industries TEXT[] DEFAULT '{}';

-- =============================================
-- 007: Convert pref_dealbreakers and pref_focus from TEXT to TEXT[]
-- =============================================
ALTER TABLE public.users
  ALTER COLUMN pref_dealbreakers TYPE TEXT[] USING
    CASE
      WHEN pref_dealbreakers IS NULL OR pref_dealbreakers = '' THEN '{}'::TEXT[]
      ELSE ARRAY[pref_dealbreakers]
    END,
  ALTER COLUMN pref_focus TYPE TEXT[] USING
    CASE
      WHEN pref_focus IS NULL OR pref_focus = '' THEN '{}'::TEXT[]
      ELSE ARRAY[pref_focus]
    END;

ALTER TABLE public.users
  ALTER COLUMN pref_dealbreakers SET DEFAULT '{}',
  ALTER COLUMN pref_focus SET DEFAULT '{}';

-- =============================================
-- 008: Add company size range (employee count)
-- =============================================
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS pref_company_size_min INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS pref_company_size_max INTEGER DEFAULT 10000;
