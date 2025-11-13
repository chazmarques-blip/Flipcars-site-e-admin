-- Add scheduling fields to leads table
ALTER TABLE leads 
  ADD COLUMN IF NOT EXISTS preferred_date DATE,
  ADD COLUMN IF NOT EXISTS preferred_time_slot VARCHAR(50);

-- Create index for faster queries on preferred_date
CREATE INDEX IF NOT EXISTS idx_leads_preferred_date ON leads(preferred_date);

-- Verify the changes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'leads'
  AND column_name IN ('preferred_date', 'preferred_time_slot')
ORDER BY column_name;
