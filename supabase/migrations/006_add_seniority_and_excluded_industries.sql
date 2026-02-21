-- =============================================
-- Job Radar: Add seniority levels and excluded industries
-- =============================================

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS pref_seniority_levels TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS pref_excluded_industries TEXT[] DEFAULT '{}';
