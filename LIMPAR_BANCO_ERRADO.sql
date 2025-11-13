-- ========================================
-- LIMPAR BANCO ERRADO - Reverter Mudanças
-- ========================================
-- Execute este SQL NO PROJETO ERRADO do Supabase
-- (O projeto que NÃO é o FlipCars)
-- ========================================

-- PASSO 1: Identificar o que foi criado
-- Liste todas as tabelas para ver o que existe
SELECT 
    'Tabelas existentes:' as info,
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- PASSO 2: Verificar se há colunas preferred_date/time_slot
SELECT 
    'Colunas problemáticas encontradas:' as info,
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public'
AND column_name IN ('preferred_date', 'preferred_time_slot');

-- ========================================
-- OPÇÃO A: REMOVER APENAS AS COLUNAS
-- ========================================
-- Use esta opção se a tabela 'leads' já existia antes

-- Remover colunas com CASCADE (remove dependências)
ALTER TABLE leads 
DROP COLUMN IF EXISTS preferred_time_slot CASCADE;

ALTER TABLE leads 
DROP COLUMN IF EXISTS preferred_date CASCADE;

-- Verificar remoção
SELECT 
    'Verificação após remoção:' as info,
    COUNT(*) as colunas_restantes
FROM information_schema.columns
WHERE table_name = 'leads'
AND column_name IN ('preferred_date', 'preferred_time_slot');
-- Deve retornar 0

-- ========================================
-- OPÇÃO B: REMOVER TABELA INTEIRA
-- ========================================
-- Use esta opção SE você criou a tabela 'leads' por engano
-- ⚠️ CUIDADO: Isso deleta TODOS os dados da tabela!

-- Descomentar para executar:
-- DROP TABLE IF EXISTS leads CASCADE;

-- ========================================
-- OPÇÃO C: REVERTER OUTRAS MUDANÇAS
-- ========================================

-- Se você criou roles no projeto errado:
-- SELECT * FROM roles;
-- DELETE FROM roles WHERE name = 'admin'; -- Se foi você quem criou

-- Se você criou usuários no projeto errado:
-- SELECT * FROM "user";
-- DELETE FROM "user" WHERE email = 'admin@flipcars.us'; -- Se foi você quem criou

-- Se você criou user_roles:
-- SELECT * FROM user_roles;
-- TRUNCATE TABLE user_roles; -- Remove todas as associações

-- ========================================
-- PASSO 3: VERIFICAÇÃO FINAL
-- ========================================

-- Ver estado final das tabelas
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns 
     WHERE table_name = t.table_name) as total_columns
FROM information_schema.tables t
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- ========================================
-- OPÇÃO D: RESET COMPLETO DO BANCO
-- ========================================
-- ⚠️ EXTREMO CUIDADO! Isso remove TUDO!
-- Use apenas se este projeto não tem dados importantes

/*
-- Descomentar para executar reset completo:

-- 1. Remover todas as tabelas
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- 2. Restaurar permissões
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- 3. Verificar que está limpo
SELECT * FROM information_schema.tables WHERE table_schema = 'public';
-- Deve retornar 0 linhas
*/

-- ========================================
-- RECOMENDAÇÃO
-- ========================================
-- Se este projeto não é importante:
-- 1. Execute OPÇÃO A (remover colunas)
-- 2. Ou simplesmente IGNORE este projeto
-- 3. Ou DELETE o projeto inteiro no Supabase Dashboard

-- Se este projeto É importante:
-- 1. Execute OPÇÃO A com cuidado
-- 2. Faça backup antes: pg_dump ou export via Supabase
-- ========================================
