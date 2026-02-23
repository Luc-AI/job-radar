-- Add top_pick_threshold column to users table
-- Controls the score boundary for "Top Picks" tier on the dashboard (percentage, 70–100, default 85)
ALTER TABLE users ADD COLUMN IF NOT EXISTS top_pick_threshold INTEGER DEFAULT 85;
