-- ========================================
-- VERIFICAR IMPACTO DA MIGRATION
-- ========================================
-- Execute no Supabase SQL Editor para verificar o estado da tabela

-- 1. Ver TODAS as colunas da tabela leads
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'leads'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Ver indices da tabela leads
SELECT
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'leads'
AND schemaname = 'public';

-- 3. Ver constraints
SELECT
    con.conname AS constraint_name,
    con.contype AS constraint_type,
    CASE con.contype
        WHEN 'p' THEN 'PRIMARY KEY'
        WHEN 'u' THEN 'UNIQUE'
        WHEN 'f' THEN 'FOREIGN KEY'
        WHEN 'c' THEN 'CHECK'
        ELSE con.contype::text
    END AS constraint_description
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
JOIN pg_namespace nsp ON nsp.oid = connamespace
WHERE rel.relname = 'leads'
AND nsp.nspname = 'public';

-- 4. Verificar se colunas novas existem
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'leads' AND column_name = 'preferred_date'
        ) THEN '✅ preferred_date EXISTS'
        ELSE '❌ preferred_date MISSING'
    END as preferred_date_status,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'leads' AND column_name = 'preferred_time_slot'
        ) THEN '✅ preferred_time_slot EXISTS'
        ELSE '❌ preferred_time_slot MISSING'
    END as preferred_time_slot_status;

-- 5. Contar leads e ver distribuição
SELECT 
    COUNT(*) as total_leads,
    COUNT(preferred_date) as leads_with_date,
    COUNT(preferred_time_slot) as leads_with_time_slot,
    COUNT(*) - COUNT(preferred_date) as leads_without_date
FROM leads;

-- 6. Ver sample de dados
SELECT 
    id,
    reference_number,
    name,
    email,
    status,
    preferred_date,
    preferred_time_slot,
    created_at
FROM leads
ORDER BY created_at DESC
LIMIT 10;
