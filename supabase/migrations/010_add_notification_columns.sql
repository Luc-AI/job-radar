-- Convert notify_threshold from DECIMAL(3,1) 1–10 scale to INTEGER 40–95 percentage
ALTER TABLE users
  ALTER COLUMN notify_threshold TYPE INTEGER
  USING ROUND(notify_threshold * 10)::INTEGER;

ALTER TABLE users DROP CONSTRAINT IF EXISTS users_notify_threshold_check;
ALTER TABLE users ADD CONSTRAINT users_notify_threshold_check
  CHECK (notify_threshold >= 40 AND notify_threshold <= 95);
ALTER TABLE users ALTER COLUMN notify_threshold SET DEFAULT 75;

-- Weekday selection for weekly digests (['mon','tue','wed','thu','fri'] default)
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS notify_days TEXT[]
  DEFAULT ARRAY['mon','tue','wed','thu','fri'];

-- Instant alerts master toggle
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS instant_alerts_enabled BOOLEAN DEFAULT true;

-- Instant alerts score threshold (70–98)
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS instant_alert_threshold INTEGER DEFAULT 85
  CHECK (instant_alert_threshold >= 70 AND instant_alert_threshold <= 98);

-- Instant alerts channel list (['email'] default)
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS instant_alert_channels TEXT[] DEFAULT ARRAY['email'];
