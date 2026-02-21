-- =============================================
-- Job Radar: Convert pref_dealbreakers and pref_focus from TEXT to TEXT[]
-- =============================================
-- Previously free text, now tag arrays for consistent UI

-- Convert existing text values to single-element arrays, then change type
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
