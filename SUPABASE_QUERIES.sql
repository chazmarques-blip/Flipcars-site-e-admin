-- ========================================
-- QUERIES PARA EXECUTAR NO SUPABASE
-- ========================================
-- 
-- COMO USAR:
-- 1. Acesse: https://supabase.com/dashboard/project/nsvzqehytuqwfaerzmau
-- 2. Clique em "SQL Editor" no menu lateral
-- 3. Cole e execute as queries abaixo uma por vez
-- 
-- ========================================

-- ========================================
-- PARTE 1: DIAGNÓSTICO
-- ========================================

-- 1. CONTAR TOTAL DE LEADS
SELECT COUNT(*) as total_leads FROM leads;

-- 2. VER ESTRUTURA DA TABELA LEADS (todas as colunas)
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns
WHERE table_name = 'leads'
ORDER BY ordinal_position;

-- 3. VERIFICAR SE COLUNA service_type EXISTE (causou problema)
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'leads' AND column_name = 'service_type';

-- 4. VER ÚLTIMOS 10 LEADS (se existirem)
SELECT 
    reference_number,
    name,
    email,
    phone,
    vehicle_make,
    vehicle_model,
    vehicle_year,
    status,
    created_at
FROM leads
ORDER BY created_at DESC
LIMIT 10;

-- 5. CONTAR LEADS POR STATUS
SELECT status, COUNT(*) as count
FROM leads
GROUP BY status
ORDER BY count DESC;

-- 6. VER TODOS OS DADOS DE 1 LEAD (para debug completo)
SELECT * FROM leads LIMIT 1;

-- ========================================
-- PARTE 2: CORREÇÕES
-- ========================================

-- 7. REMOVER COLUNA service_type (SE EXISTIR)
-- ⚠️ Só execute se a query #3 retornar alguma linha
-- ⚠️ Esta coluna foi adicionada por engano e causa erro 500
ALTER TABLE leads DROP COLUMN IF EXISTS service_type;

-- 8. CRIAR 3 LEADS DE TESTE (SE BANCO ESTIVER VAZIO)
-- ⚠️ Só execute se a query #1 retornar total_leads = 0
INSERT INTO leads (
    id, 
    reference_number, 
    name, 
    phone, 
    email, 
    preferred_language,
    vehicle_year, 
    vehicle_make, 
    vehicle_model, 
    vehicle_color,
    has_insurance, 
    is_drivable, 
    status, 
    priority, 
    source,
    created_at, 
    updated_at
) VALUES
(
    gen_random_uuid(),
    'FLIP-20251122-0001',
    'John Smith',
    '+1234567890',
    'john.smith@example.com',
    'en',
    '2020',
    'Toyota',
    'Camry',
    'Blue',
    true,
    true,
    'new',
    'high',
    'website',
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'FLIP-20251122-0002',
    'Maria Garcia',
    '+1987654321',
    'maria.garcia@example.com',
    'en',
    '2019',
    'Honda',
    'Civic',
    'Red',
    false,
    true,
    'new',
    'medium',
    'referral',
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'FLIP-20251122-0003',
    'Robert Johnson',
    '+1555555555',
    'robert.j@example.com',
    'en',
    '2021',
    'Ford',
    'F-150',
    'Black',
    true,
    false,
    'qualified_ai',
    'high',
    'website',
    NOW(),
    NOW()
);

-- ========================================
-- PARTE 3: VERIFICAÇÃO FINAL
-- ========================================

-- 9. VERIFICAR INTEGRIDADE DOS DADOS
SELECT 
    COUNT(*) as total_leads,
    COUNT(DISTINCT reference_number) as unique_references,
    COUNT(CASE WHEN name IS NULL THEN 1 END) as missing_names,
    COUNT(CASE WHEN email IS NULL THEN 1 END) as missing_emails,
    COUNT(CASE WHEN phone IS NULL THEN 1 END) as missing_phones
FROM leads;

-- 10. VER MIGRATIONS EXECUTADAS (verificar se migrations rodaram)
SELECT * FROM migrations ORDER BY executed_at DESC LIMIT 10;

-- 11. VERIFICAR APPOINTMENTS (ver se há appointments órfãos)
SELECT COUNT(*) as total_appointments FROM appointments;

-- 12. TESTAR SELECT COMPLETO (o que o backend faz)
SELECT 
    id,
    reference_number,
    name,
    phone,
    email,
    preferred_language,
    vehicle_year,
    vehicle_make,
    vehicle_model,
    vehicle_color,
    has_insurance,
    insurance_provider,
    claim_number,
    accident_description,
    accident_date,
    is_drivable,
    needs_tow,
    needs_rental,
    damage_photos,
    ai_qualification_score,
    ai_conversation_history,
    last_ai_interaction,
    assigned_ai_agent,
    last_human_interaction,
    status,
    priority,
    notes,
    estimated_value,
    source,
    preferred_date,
    preferred_time_slot,
    created_at,
    updated_at
FROM leads
LIMIT 1;

-- ========================================
-- PARTE 4: LIMPEZA (opcional)
-- ========================================

-- 13. DELETAR LEADS DE TESTE (se quiser limpar depois)
-- ⚠️ CUIDADO: Isso vai deletar os leads criados pela query #8
-- DELETE FROM leads WHERE reference_number LIKE 'FLIP-20251122-%';

-- ========================================
-- ORDEM DE EXECUÇÃO RECOMENDADA:
-- ========================================
-- 
-- 1º Execute as queries de DIAGNÓSTICO (#1 a #6)
-- 2º Se query #1 retornar 0 leads OU query #3 mostrar service_type:
--    - Execute query #7 (remover service_type)
--    - Execute query #8 (criar leads de teste)
-- 3º Execute as queries de VERIFICAÇÃO (#9 a #12)
-- 4º Teste o admin: https://admin.flipcars.us
-- 
-- ========================================
