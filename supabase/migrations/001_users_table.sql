-- =============================================
-- Job Radar: Users Table Migration
-- =============================================
-- Run this SQL in your Supabase Dashboard → SQL Editor
-- Project URL: https://supabase.com/dashboard/project/_/sql

-- =============================================
-- 1. Create Users Table
-- =============================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,

    -- Job preferences
    pref_roles TEXT[] DEFAULT '{}',
    pref_locations TEXT[] DEFAULT '{}',
    pref_industries TEXT[] DEFAULT '{}',
    pref_remote BOOLEAN DEFAULT false,
    pref_excluded_companies TEXT[] DEFAULT '{}',

    -- Profile data
    cv_raw TEXT,
    summary TEXT,

    -- Account status
    is_active BOOLEAN DEFAULT false,
    onboarding_completed BOOLEAN DEFAULT false,

    -- Notification settings
    notify_threshold DECIMAL(3,1) DEFAULT 7.0 CHECK (notify_threshold >= 1 AND notify_threshold <= 10),
    notify_frequency TEXT DEFAULT 'daily' CHECK (notify_frequency IN ('realtime', 'daily', 'weekly')),
    notify_enabled BOOLEAN DEFAULT true,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 2. Enable Row Level Security
-- =============================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 3. RLS Policies
-- =============================================

-- Users can read their own data
CREATE POLICY "Users can view own profile"
    ON public.users
    FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own profile"
    ON public.users
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Users can insert their own data (for edge cases)
CREATE POLICY "Users can insert own profile"
    ON public.users
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- =============================================
-- 4. Auto-create User Row on Signup
-- =============================================

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.users (id, email)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$;

-- Trigger to call the function on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- 5. Auto-update updated_at Timestamp
-- =============================================

-- Function to update the updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- 6. Indexes for Performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON public.users(is_active);
