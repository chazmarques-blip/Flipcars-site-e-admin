-- ========================================
-- TEST LEADS QUERY - Diagnóstico
-- ========================================

-- 1. Verificar se a tabela existe
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'leads'
) as table_exists;

-- 2. Verificar estrutura da tabela (todas as colunas)
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'leads'
ORDER BY ordinal_position;

-- 3. Contar total de leads
SELECT COUNT(*) as total_leads FROM leads;

-- 4. Ver alguns leads (sem os campos novos primeiro)
SELECT 
    id,
    reference_number,
    name,
    email,
    phone,
    status,
    priority,
    created_at
FROM leads
ORDER BY created_at DESC
LIMIT 5;

-- 5. Testar se os campos novos existem
SELECT 
    id,
    name,
    preferred_date,
    preferred_time_slot
FROM leads
LIMIT 1;

-- 6. Verificar se há algum erro de tipo
SELECT 
    id,
    name,
    CASE 
        WHEN preferred_date IS NULL THEN 'NULL'
        ELSE preferred_date::text
    END as preferred_date,
    CASE 
        WHEN preferred_time_slot IS NULL THEN 'NULL'
        ELSE preferred_time_slot
    END as preferred_time_slot
FROM leads
LIMIT 5;
