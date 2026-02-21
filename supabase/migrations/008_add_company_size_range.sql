-- =============================================
-- Job Radar: Add company size range (employee count)
-- =============================================

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS pref_company_size_min INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS pref_company_size_max INTEGER DEFAULT 10000;
