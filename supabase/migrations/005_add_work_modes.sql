-- =============================================
-- Job Radar: Replace pref_remote boolean with pref_work_modes array
-- =============================================
-- Values: 'onsite', 'hybrid', 'remote_ok', 'remote_solely'

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS pref_work_modes TEXT[] DEFAULT '{}';

-- Migrate existing data: if pref_remote was true, set to remote_ok
UPDATE public.users
  SET pref_work_modes = ARRAY['remote_ok']
  WHERE pref_remote = true AND (pref_work_modes IS NULL OR pref_work_modes = '{}');
