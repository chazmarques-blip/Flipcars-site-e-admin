SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'leads' 
AND column_name LIKE '%name%'
ORDER BY column_name;
