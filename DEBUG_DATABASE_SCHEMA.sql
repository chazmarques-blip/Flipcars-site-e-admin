-- ========================================
-- DEBUG DATABASE SCHEMA
-- ========================================
-- Execute no Supabase para investigar o problema

-- 1. Verificar TODAS as tabelas (case sensitive)
SELECT 
    table_name,
    table_schema
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name ILIKE '%lead%'
ORDER BY table_name;

-- 2. Verificar colunas da tabela 'leads' (minúsculo)
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'leads'
ORDER BY ordinal_position;

-- 3. Verificar se colunas problemáticas ainda existem
SELECT 
    COUNT(*) as count_preferred_date
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'leads'
AND column_name = 'preferred_date';

SELECT 
    COUNT(*) as count_preferred_time_slot
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'leads'
AND column_name = 'preferred_time_slot';

-- 4. Tentar SELECT na tabela para ver se há erro
SELECT COUNT(*) as total_leads FROM leads;

-- 5. Ver estrutura completa da tabela
\d leads;
