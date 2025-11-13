-- Verificar estrutura da tabela leads
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'leads'
ORDER BY ordinal_position;

-- Contar leads existentes
SELECT COUNT(*) as total_leads FROM leads;

-- Ver alguns leads (primeiros 5)
SELECT 
    id,
    name,
    email,
    phone,
    status,
    preferred_date,
    preferred_time_slot,
    "createdAt"
FROM leads
ORDER BY "createdAt" DESC
LIMIT 5;
