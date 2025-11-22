-- ========================================
-- FIX FINAL - FlipCars Leads Error 500
-- ========================================
--
-- EXECUTAR NO SUPABASE SQL EDITOR
-- https://supabase.com/dashboard/project/nsvzqehytuqwfaerzmau
--
-- ========================================

-- PASSO 1: Remover coluna assigned_human_agent_id (identificada na análise)
ALTER TABLE leads DROP COLUMN IF EXISTS assigned_human_agent_id;

-- PASSO 2: Verificar se service_type existe e remover (mencionada nos logs)
ALTER TABLE leads DROP COLUMN IF EXISTS service_type;

-- PASSO 3: Verificar estrutura final da tabela
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'leads'
ORDER BY ordinal_position;

-- PASSO 4: Contar leads (deve mostrar 33)
SELECT COUNT(*) as total_leads FROM leads;

-- PASSO 5: Testar SELECT completo (o que TypeORM faz)
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
LIMIT 5;

-- ⚠️ Se o SELECT acima funcionar SEM ERROS, o problema está resolvido!

-- ========================================
-- APÓS EXECUTAR ESTES COMANDOS:
-- ========================================
--
-- 1. Reiniciar backend no Railway:
--    https://railway.app → Backend → Restart
--
-- 2. Testar API:
--    GET https://upbeat-dedication-production.up.railway.app/api/leads
--    (deve retornar 200 OK com array de 33 leads)
--
-- 3. Testar Admin:
--    https://admin.flipcars.us
--    Login: admin@flipcars.us / Admin123!
--    (deve mostrar tabela com 33 leads)
--
-- ========================================
