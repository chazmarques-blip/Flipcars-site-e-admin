-- ========================================
-- VERIFICAR SE AS COLUNAS EXISTEM NO BANCO
-- Execute isso no Supabase SQL Editor
-- ========================================

-- 1. VERIFICAR ESTRUTURA DA TABELA LEADS
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'leads'
    AND column_name IN (
        'service_type', 
        'warranty_company', 
        'selected_services', 
        'symptoms_description'
    )
ORDER BY column_name;

-- Resultado esperado: 4 linhas (se as colunas existirem)
-- Se retornar 0 linhas, as colunas NÃO existem!


-- ========================================
-- 2. VERIFICAR DADOS SALVOS NOS LEADS RECENTES
-- ========================================

SELECT 
    id,
    reference_number,
    name,
    service_type,
    warranty_company,
    selected_services,
    symptoms_description,
    created_at
FROM leads
WHERE created_at > NOW() - INTERVAL '1 day'
ORDER BY created_at DESC
LIMIT 5;

-- O que verificar:
-- - service_type: deve ser 'mechanic' ou 'bodyshop' (não NULL)
-- - warranty_company: deve ter o nome da garantia (não NULL)
-- - selected_services: deve ser um array JSON como ["Oil", "Engine"]
-- - symptoms_description: deve ter o texto das notas


-- ========================================
-- 3. SE AS COLUNAS NÃO EXISTIREM, ADICIONE-AS:
-- ========================================

-- DESCOMENTE E EXECUTE APENAS SE AS COLUNAS NÃO EXISTIREM:

-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS service_type VARCHAR(20) NULL;
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS warranty_company VARCHAR(100) NULL;
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS selected_services JSONB NULL;
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS symptoms_description TEXT NULL;


-- ========================================
-- 4. VERIFICAR DADOS EM UM LEAD ESPECÍFICO
-- ========================================

-- Substitua 'FLIP-20251130-XXXX' pelo reference number do lead de teste:

SELECT 
    reference_number,
    name,
    email,
    phone,
    service_type,
    warranty_company,
    selected_services,
    symptoms_description,
    notes,
    created_at
FROM leads
WHERE reference_number = 'FLIP-20251204-0004'  -- ← SUBSTITUA AQUI
ORDER BY created_at DESC
LIMIT 1;

-- O que deve aparecer:
-- service_type: 'mechanic'
-- warranty_company: 'Private (Self-Pay)'
-- selected_services: ["Oil", "Engine"]  (array JSON)
-- symptoms_description: 'teste deploy manual'


-- ========================================
-- 5. VERIFICAR APPOINTMENTS RELACIONADOS
-- ========================================

SELECT 
    a.id as appointment_id,
    a.appointment_date,
    a.appointment_time_slot,
    l.reference_number,
    l.name,
    l.service_type,
    l.warranty_company,
    l.selected_services,
    l.symptoms_description
FROM appointments a
INNER JOIN leads l ON a.lead_id = l.id
WHERE a.appointment_date >= CURRENT_DATE
ORDER BY a.appointment_date ASC, a.appointment_start_time ASC
LIMIT 10;

-- Isso mostra os próximos 10 appointments com os dados do lead
-- Verifique se service_type, warranty_company, etc. estão preenchidos
