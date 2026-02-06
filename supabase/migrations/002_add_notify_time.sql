-- =============================================
-- Job Radar: Add notify_time column
-- =============================================
-- Run this SQL in your Supabase Dashboard → SQL Editor
-- Story 1.5: Onboarding Step 3 - Final Details

-- Add notify_time column for daily digest time preference
-- Stores the hour (0-23) when the user wants to receive their digest
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS notify_time INTEGER DEFAULT 9
CHECK (notify_time >= 0 AND notify_time <= 23);

-- Add a comment for documentation
COMMENT ON COLUMN public.users.notify_time IS 'Hour of day (0-23) for daily digest delivery';
