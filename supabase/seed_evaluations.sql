-- =============================================
-- Job Radar: Seed Evaluations for Testing
-- =============================================
-- INSTRUCTIONS:
-- 1. First, find your user_id by running: SELECT id, email FROM public.users;
-- 2. Replace '<YOUR_USER_ID>' below with your actual UUID
-- 3. Run this script in Supabase SQL Editor
-- =============================================

-- Set your user ID here
DO $$
DECLARE
    target_user_id UUID := '2208d494-7cfa-4209-bf26-885d7960bfb2';
    job_record RECORD;
    job_count INT := 0;
    score DECIMAL;
    status_val TEXT;
    statuses TEXT[] := ARRAY['new', 'new', 'new', 'viewed', 'saved'];
BEGIN
    -- Validate user exists
    IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = target_user_id) THEN
        RAISE EXCEPTION 'User not found. Please check your user_id.';
    END IF;

    -- Loop through all jobs and create evaluations
    FOR job_record IN SELECT id, title, company FROM public.jobs LOOP
        job_count := job_count + 1;

        -- Generate varied scores (7.0 to 9.8)
        score := 7.0 + (random() * 2.8)::DECIMAL(3,1);

        -- Cycle through statuses (mostly 'new')
        status_val := statuses[1 + (job_count % array_length(statuses, 1))];

        INSERT INTO public.evaluations (
            user_id,
            job_id,
            score_total,
            score_role,
            score_company,
            score_location,
            score_industry,
            score_growth,
            reason_overall,
            reason_role,
            reason_company,
            reason_location,
            reason_industry,
            reason_growth,
            status,
            evaluated_at
        ) VALUES (
            target_user_id,
            job_record.id,
            score,
            (6.5 + random() * 3.5)::DECIMAL(3,1),
            (6.0 + random() * 4.0)::DECIMAL(3,1),
            (7.0 + random() * 3.0)::DECIMAL(3,1),
            (6.5 + random() * 3.5)::DECIMAL(3,1),
            (7.0 + random() * 3.0)::DECIMAL(3,1),
            'Strong match based on your experience and preferences. ' || job_record.title || ' at ' || job_record.company || ' aligns well with your career goals.',
            'Your background in product management and technical skills match the requirements for this role.',
            job_record.company || ' has a strong reputation in the industry with good growth trajectory.',
            'Location matches your preferences with flexible remote options available.',
            'The industry aligns with your target sectors and experience.',
            'This role offers clear advancement opportunities and skill development.',
            status_val,
            NOW() - (random() * interval '7 days')
        )
        ON CONFLICT (user_id, job_id) DO NOTHING;
    END LOOP;

    RAISE NOTICE 'Created % evaluation records for user %', job_count, target_user_id;
END $$;

-- Seed for second user
DO $$
DECLARE
    target_user_id UUID := '68a056b1-5c79-43c6-87c7-b8031cee00f1';
    job_record RECORD;
    job_count INT := 0;
    score DECIMAL;
    status_val TEXT;
    statuses TEXT[] := ARRAY['new', 'new', 'new', 'viewed', 'saved'];
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = target_user_id) THEN
        RAISE NOTICE 'User % not found, skipping.', target_user_id;
        RETURN;
    END IF;

    FOR job_record IN SELECT id, title, company FROM public.jobs LOOP
        job_count := job_count + 1;
        score := 7.0 + (random() * 2.8)::DECIMAL(3,1);
        status_val := statuses[1 + (job_count % array_length(statuses, 1))];

        INSERT INTO public.evaluations (
            user_id, job_id, score_total, score_role, score_company,
            score_location, score_industry, score_growth,
            reason_overall, reason_role, reason_company,
            reason_location, reason_industry, reason_growth,
            status, evaluated_at
        ) VALUES (
            target_user_id, job_record.id, score,
            (6.5 + random() * 3.5)::DECIMAL(3,1),
            (6.0 + random() * 4.0)::DECIMAL(3,1),
            (7.0 + random() * 3.0)::DECIMAL(3,1),
            (6.5 + random() * 3.5)::DECIMAL(3,1),
            (7.0 + random() * 3.0)::DECIMAL(3,1),
            'Strong match based on your experience. ' || job_record.title || ' at ' || job_record.company || ' aligns with your goals.',
            'Your skills match the requirements for this role.',
            job_record.company || ' has a strong industry reputation.',
            'Location matches your preferences.',
            'The industry aligns with your experience.',
            'This role offers advancement opportunities.',
            status_val,
            NOW() - (random() * interval '7 days')
        )
        ON CONFLICT (user_id, job_id) DO NOTHING;
    END LOOP;

    RAISE NOTICE 'Created % evaluation records for user %', job_count, target_user_id;
END $$;

-- Verify the results
SELECT
    e.id,
    e.score_total,
    e.status,
    j.title,
    j.company
FROM public.evaluations e
JOIN public.jobs j ON e.job_id = j.id
ORDER BY e.score_total DESC
LIMIT 10;
