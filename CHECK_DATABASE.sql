-- Query to check if deleted_at column exists in leads table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'leads' AND column_name = 'deleted_at';
