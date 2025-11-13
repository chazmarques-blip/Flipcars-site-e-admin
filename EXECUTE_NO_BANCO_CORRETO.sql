-- ========================================
-- EXECUTE NO BANCO CORRETO - FlipCars
-- ========================================
-- Project ID: nsvzqehytuqwfaerzmau
-- Host: aws-0-us-east-1.pooler.supabase.com
-- ========================================

-- PRIMEIRO: Verificar se estamos no banco correto
-- Deve mostrar tabelas: leads, users, roles, vehicles, etc.
SELECT 
    'Tabelas do FlipCars:' as info,
    table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name IN ('leads', 'user', 'roles', 'customers', 'vehicles')
ORDER BY table_name;

-- Se aparecer essas tabelas = BANCO CORRETO ✅
-- Se NÃO aparecer = BANCO ERRADO ❌ (troque de projeto no Supabase)

-- ========================================
-- DEPOIS DE CONFIRMAR QUE É O BANCO CORRETO:
-- ========================================

-- 1. Remover colunas de calendário (se existirem)
ALTER TABLE leads 
DROP COLUMN IF EXISTS preferred_time_slot CASCADE;

ALTER TABLE leads 
DROP COLUMN IF EXISTS preferred_date CASCADE;

-- 2. Verificar remoção (DEVE retornar 0 linhas)
SELECT 
    'Verificação de colunas removidas:' as info,
    column_name
FROM information_schema.columns
WHERE table_name = 'leads'
AND column_name IN ('preferred_date', 'preferred_time_slot');

-- 3. Contar leads existentes
SELECT 
    'Total de leads no banco:' as info,
    COUNT(*) as total 
FROM leads;

-- 4. Verificar usuário admin existe
SELECT 
    'Usuário admin:' as info,
    id,
    name,
    email,
    status
FROM "user" 
WHERE email = 'admin@flipcars.us';

-- 5. Ver estrutura atual da tabela leads (primeiras 10 colunas)
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'leads'
ORDER BY ordinal_position
LIMIT 10;

-- ========================================
-- RESULTADOS ESPERADOS:
-- ========================================
-- ✅ Tabelas FlipCars encontradas
-- ✅ 0 colunas preferred_date/time_slot
-- ✅ Leads existentes (count > 0 ou = 0)
-- ✅ Usuário admin existe
-- ✅ Estrutura da tabela leads correta
-- ========================================
