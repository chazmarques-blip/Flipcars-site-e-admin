-- ========================================
-- SCHEMA FIXES - FlipCars Leads Table
-- ========================================
--
-- ANTES DE EXECUTAR:
-- 1. Execute a query de comparação no Supabase
-- 2. Identifique as colunas extras no banco
-- 3. Execute APENAS os comandos necessários abaixo
--
-- ========================================

-- ========================================
-- REMOVER COLUNAS EXTRAS (se existirem)
-- ========================================

-- COLUNA service_type (já confirmada que NÃO existe)
-- ALTER TABLE leads DROP COLUMN IF EXISTS service_type;

-- COLUNA customer_id (pode estar comentada na entidade)
-- ⚠️  Só execute se esta coluna existir no banco E não estiver sendo usada
-- ALTER TABLE leads DROP COLUMN IF EXISTS customer_id;

-- COLUNA contact_preferences (pode estar comentada na entidade)
-- ⚠️  Só execute se esta coluna existir no banco E não estiver sendo usada
-- ALTER TABLE leads DROP COLUMN IF EXISTS contact_preferences;

-- COLUNA vehicle_id (pode estar comentada na entidade)
-- ⚠️  Só execute se esta coluna existir no banco E não estiver sendo usada
-- ALTER TABLE leads DROP COLUMN IF EXISTS vehicle_id;

-- COLUNA assigned_human_agent_id (pode estar comentada na entidade)
-- ⚠️  Só execute se esta coluna existir no banco E não estiver sendo usada
-- ALTER TABLE leads DROP COLUMN IF EXISTS assigned_human_agent_id;

-- ========================================
-- ADICIONAR COLUNAS FALTANDO (se necessário)
-- ========================================

-- ADICIONAR id (se não existir - improvável)
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS id uuid PRIMARY KEY DEFAULT gen_random_uuid();

-- ADICIONAR reference_number (se não existir - improvável)
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS reference_number varchar(50) UNIQUE NOT NULL;

-- ADICIONAR preferred_language (se não existir)
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS preferred_language varchar(10) DEFAULT 'en';

-- ADICIONAR campos de veículo (se não existirem)
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS vehicle_year varchar(100);
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS vehicle_make varchar(100);
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS vehicle_model varchar(100);
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS vehicle_color varchar(50);

-- ADICIONAR campos de seguro (se não existirem)
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS has_insurance boolean DEFAULT false;
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS insurance_provider varchar(100);
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS claim_number varchar(100);

-- ADICIONAR campos de acidente (se não existirem)
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS accident_description text;
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS accident_date date;
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS is_drivable boolean DEFAULT true;
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS needs_tow boolean DEFAULT false;
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS needs_rental boolean DEFAULT false;
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS damage_photos jsonb DEFAULT '[]';

-- ADICIONAR campos de AI (se não existirem)
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS ai_qualification_score integer;
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS ai_conversation_history jsonb DEFAULT '[]';
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_ai_interaction timestamp;
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS assigned_ai_agent varchar(100);
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_human_interaction timestamp;

-- ADICIONAR campos de status (se não existirem)
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS status varchar(50) DEFAULT 'new';
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS priority varchar(20) DEFAULT 'medium';
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS notes text;
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS estimated_value numeric(10,2);
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS source varchar(50);

-- ADICIONAR campos de preferências (se não existirem)
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS preferred_date date;
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS preferred_time_slot varchar(20);

-- ADICIONAR timestamps (se não existirem)
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS created_at timestamp DEFAULT NOW();
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS updated_at timestamp DEFAULT NOW();

-- ========================================
-- VERIFICAÇÃO FINAL
-- ========================================

-- Ver todas as colunas após as mudanças
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'leads'
ORDER BY ordinal_position;

-- Contar total de leads (garantir que nada foi perdido)
SELECT COUNT(*) as total_leads FROM leads;

-- Ver últimos 3 leads para confirmar dados intactos
SELECT 
    reference_number,
    name,
    email,
    phone,
    status,
    created_at
FROM leads
ORDER BY created_at DESC
LIMIT 3;

-- ========================================
-- TESTE COMPLETO (simula o que TypeORM faz)
-- ========================================

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

-- ⚠️  Se o SELECT acima funcionar SEM ERROS, o problema está resolvido!
-- ⚠️  Se der erro "column does not exist", essa é a coluna problemática

-- ========================================
-- ROLLBACK (caso algo dê errado)
-- ========================================

-- Se você removeu uma coluna importante por engano:
-- ALTER TABLE leads ADD COLUMN nome_coluna tipo_de_dado;

-- Se você adicionou uma coluna errada:
-- ALTER TABLE leads DROP COLUMN nome_coluna;

-- ========================================
-- PRÓXIMOS PASSOS APÓS EXECUTAR
-- ========================================
--
-- 1. ✅ Executar fix no Supabase SQL Editor
-- 2. 🔄 Reiniciar backend no Railway:
--    - Acesse: https://railway.app
--    - Clique no serviço backend
--    - Clique em "Restart"
-- 3. 🧪 Testar endpoint:
--    - GET https://upbeat-dedication-production.up.railway.app/api/leads
--    - Deve retornar 200 OK com array de leads
-- 4. 🎯 Testar admin dashboard:
--    - Acesse: https://admin.flipcars.us
--    - Login: admin@flipcars.us / Admin123!
--    - Deve mostrar tabela com 33 leads
-- 5. 📝 Atualizar HANDOFF_DOCUMENT.md com status ✅ RESOLVIDO
--
-- ========================================
