-- Add about/description column for restaurant information from Google Places
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS about TEXT DEFAULT NULL;
