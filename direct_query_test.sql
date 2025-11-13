-- Check what columns exist and have data
SELECT 
  column_name,
  data_type,
  (SELECT COUNT(*) FROM leads WHERE leads.id IS NOT NULL) as total_rows
FROM information_schema.columns
WHERE table_name = 'leads'
AND column_name IN ('name', 'customer_name', 'phone', 'email')
ORDER BY column_name;
