-- ========================================
-- ROLLBACK: Remover campos de calendário
-- ========================================
-- Execute este SQL no Supabase SQL Editor
-- Isso vai REVERTER a migration e restaurar a tabela original

-- PASSO 1: Remover as colunas adicionadas
ALTER TABLE leads 
DROP COLUMN IF EXISTS preferred_time_slot;

ALTER TABLE leads 
DROP COLUMN IF EXISTS preferred_date;

-- PASSO 2: Verificar que foram removidas
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'leads'
ORDER BY ordinal_position;

-- PASSO 3: Contar leads para confirmar que nada foi perdido
SELECT COUNT(*) as total_leads FROM leads;

-- PASSO 4: Ver alguns leads para confirmar estrutura original
SELECT 
    id,
    reference_number,
    name,
    email,
    phone,
    status,
    created_at
FROM leads
ORDER BY created_at DESC
LIMIT 5;

-- ========================================
-- RESULTADO ESPERADO
-- ========================================
-- ✅ Colunas preferred_date e preferred_time_slot removidas
-- ✅ Todas as outras colunas intactas
-- ✅ Todos os leads preservados
-- ========================================
