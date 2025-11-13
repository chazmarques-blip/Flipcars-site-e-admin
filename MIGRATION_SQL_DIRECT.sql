-- ============================================
-- MIGRATION: Add Scheduling Fields to Leads
-- Execute this directly in Supabase SQL Editor
-- ============================================

-- Add preferred_date column (DATE type for date-only values)
ALTER TABLE "leads" 
ADD COLUMN IF NOT EXISTS "preferred_date" DATE NULL;

-- Add preferred_time_slot column (VARCHAR for time slot strings)
ALTER TABLE "leads" 
ADD COLUMN IF NOT EXISTS "preferred_time_slot" VARCHAR(50) NULL;

-- Add column comments for documentation
COMMENT ON COLUMN "leads"."preferred_date" IS 'Customer preferred date for appointment (NULL = no appointment scheduled)';
COMMENT ON COLUMN "leads"."preferred_time_slot" IS 'Customer preferred time slot (e.g., morning, afternoon, evening, or specific time range)';

-- Verify columns were created
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'leads' 
  AND column_name IN ('preferred_date', 'preferred_time_slot');
