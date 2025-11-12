-- ============================================================================
-- PASSO 1: VERIFICAR ESTRUTURA DA TABELA USERS
-- ============================================================================
-- Copie e cole isso no Supabase SQL Editor primeiro

SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM 
    information_schema.columns
WHERE 
    table_name = 'users'
ORDER BY 
    ordinal_position;

-- ============================================================================
-- Depois de ver os resultados acima, me envie um screenshot!
-- Aí eu crio o INSERT correto baseado na estrutura real da sua tabela.
-- ============================================================================
