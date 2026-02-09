-- =============================================
-- Job Radar: Evaluations Table Migration
-- =============================================
-- Run this SQL in your Supabase Dashboard → SQL Editor
-- Project URL: https://supabase.com/dashboard/project/_/sql

-- =============================================
-- 1. Create Evaluations Table
-- =============================================
CREATE TABLE IF NOT EXISTS public.evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,

    -- Scores (1-10 scale)
    score_total DECIMAL(3,1) NOT NULL CHECK (score_total >= 1 AND score_total <= 10),
    score_role DECIMAL(3,1) CHECK (score_role >= 1 AND score_role <= 10),
    score_company DECIMAL(3,1) CHECK (score_company >= 1 AND score_company <= 10),
    score_location DECIMAL(3,1) CHECK (score_location >= 1 AND score_location <= 10),
    score_industry DECIMAL(3,1) CHECK (score_industry >= 1 AND score_industry <= 10),
    score_growth DECIMAL(3,1) CHECK (score_growth >= 1 AND score_growth <= 10),

    -- AI reasoning text
    reason_overall TEXT,
    reason_role TEXT,
    reason_company TEXT,
    reason_location TEXT,
    reason_industry TEXT,
    reason_growth TEXT,

    -- Status tracking
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'viewed', 'saved', 'applied', 'hidden')),

    -- Timestamps
    evaluated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Ensure one evaluation per user per job
    UNIQUE(user_id, job_id)
);

-- =============================================
-- 2. Enable Row Level Security
-- =============================================
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 3. RLS Policies
-- =============================================

-- Drop existing policies if they exist (for re-running migration)
DROP POLICY IF EXISTS "Users can view own evaluations" ON public.evaluations;
DROP POLICY IF EXISTS "Users can update own evaluations" ON public.evaluations;
DROP POLICY IF EXISTS "Service role can insert evaluations" ON public.evaluations;

-- Users can view their own evaluations
CREATE POLICY "Users can view own evaluations"
    ON public.evaluations
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can update their own evaluations (for status changes)
CREATE POLICY "Users can update own evaluations"
    ON public.evaluations
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Backend/service role can insert evaluations (for n8n)
-- Note: This uses service role, not user auth
CREATE POLICY "Service role can insert evaluations"
    ON public.evaluations
    FOR INSERT
    WITH CHECK (true);

-- =============================================
-- 4. Auto-update updated_at Timestamp
-- =============================================
DROP TRIGGER IF EXISTS update_evaluations_updated_at ON public.evaluations;
CREATE TRIGGER update_evaluations_updated_at
    BEFORE UPDATE ON public.evaluations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- 5. Indexes for Performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_evaluations_user_id ON public.evaluations(user_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_job_id ON public.evaluations(job_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_score_total ON public.evaluations(score_total DESC);
CREATE INDEX IF NOT EXISTS idx_evaluations_status ON public.evaluations(status);
CREATE INDEX IF NOT EXISTS idx_evaluations_user_status ON public.evaluations(user_id, status);
