-- Verificar se colunas existem
SELECT 
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_name = 'leads'
AND column_name IN ('preferred_date', 'preferred_time_slot')
ORDER BY column_name;
