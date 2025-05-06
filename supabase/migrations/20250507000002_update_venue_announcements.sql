
-- Add social_links and available_dates columns to venue_announcements table
ALTER TABLE IF EXISTS public.venue_announcements 
ADD COLUMN IF NOT EXISTS social_links jsonb,
ADD COLUMN IF NOT EXISTS available_dates text[];
