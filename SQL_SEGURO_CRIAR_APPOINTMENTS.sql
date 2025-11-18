-- ============================================
-- SQL 100% SEGURO PARA CRIAR TABELA APPOINTMENTS
-- ============================================
-- Este SQL é seguro porque:
-- 1. Usa IF NOT EXISTS em tudo (não cria se já existir)
-- 2. Não modifica dados existentes
-- 3. Adiciona colunas como NULL (opcional)
-- 4. Não quebra leads existentes
-- 5. Pode ser executado múltiplas vezes sem problema
-- ============================================

-- PASSO 1: Verificar se tabela leads existe (segurança)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'leads') THEN
        RAISE EXCEPTION 'Tabela leads não existe! Não é seguro prosseguir.';
    END IF;
END $$;

-- PASSO 2: Adicionar colunas à tabela leads (se não existirem)
-- Estas colunas são NULLABLE, então não afetam leads existentes
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS preferred_date DATE,
ADD COLUMN IF NOT EXISTS preferred_time_slot VARCHAR(20);

-- PASSO 3: Criar tabela appointments (se não existir)
CREATE TABLE IF NOT EXISTS appointments (
  -- Identificação
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relacionamento com Lead (sem foreign key por enquanto - mais seguro)
  lead_id UUID NOT NULL,
  
  -- Data e Horário
  appointment_date DATE NOT NULL,
  appointment_time_slot VARCHAR(20) NOT NULL,
  appointment_start_time TIME,
  appointment_end_time TIME,
  
  -- Status
  status VARCHAR(20) DEFAULT 'scheduled',
  
  -- Preferências e Notas
  contact_preferences JSONB,
  admin_notes TEXT,
  
  -- Confirmação
  confirmed_at TIMESTAMP WITH TIME ZONE,
  confirmed_by UUID,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PASSO 4: Criar índices (se não existirem)
-- Melhora performance sem afetar dados
CREATE INDEX IF NOT EXISTS idx_appointments_lead_id ON appointments(lead_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON appointments(created_at);

-- PASSO 5: Adicionar foreign key DEPOIS (opcional e seguro)
-- Só adiciona se a constraint não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_appointment_lead'
    ) THEN
        ALTER TABLE appointments 
        ADD CONSTRAINT fk_appointment_lead 
        FOREIGN KEY (lead_id) 
        REFERENCES leads(id) 
        ON DELETE CASCADE;
    END IF;
END $$;

-- PASSO 6: Adicionar comentários (documentação)
COMMENT ON TABLE appointments IS 'Agendamentos vinculados a leads - criado via migration segura';
COMMENT ON COLUMN appointments.lead_id IS 'UUID do lead relacionado (referencia leads.id)';
COMMENT ON COLUMN appointments.appointment_date IS 'Data do agendamento no formato YYYY-MM-DD';
COMMENT ON COLUMN appointments.appointment_time_slot IS 'Horário no formato HH:MM-HH:MM (ex: 09:00-11:00)';
COMMENT ON COLUMN appointments.status IS 'Status: scheduled, confirmed, completed, cancelled, no_show, rescheduled';

-- ============================================
-- VERIFICAÇÃO PÓS-EXECUÇÃO
-- ============================================

-- Verificar se tabela foi criada
SELECT 
    'appointments' AS tabela,
    EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'appointments'
    ) AS existe;

-- Verificar colunas da tabela appointments
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'appointments'
ORDER BY ordinal_position;

-- Verificar se colunas foram adicionadas em leads
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'leads' 
  AND column_name IN ('preferred_date', 'preferred_time_slot');

-- Verificar índices criados
SELECT 
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'appointments';

-- Contar leads existentes (para garantir que nada foi perdido)
SELECT 
    'Total de leads' AS informacao,
    COUNT(*) AS quantidade
FROM leads;

-- ============================================
-- ROLLBACK (se necessário)
-- ============================================
-- Caso algo dê errado, execute este bloco:
/*
-- ATENÇÃO: Só execute se realmente precisar fazer rollback!

-- Remover foreign key
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS fk_appointment_lead;

-- Remover índices
DROP INDEX IF EXISTS idx_appointments_lead_id;
DROP INDEX IF EXISTS idx_appointments_date;
DROP INDEX IF EXISTS idx_appointments_status;
DROP INDEX IF EXISTS idx_appointments_created_at;

-- Remover tabela appointments
DROP TABLE IF EXISTS appointments;

-- Remover colunas de leads (CUIDADO: só faça se tiver certeza!)
-- ALTER TABLE leads DROP COLUMN IF EXISTS preferred_date;
-- ALTER TABLE leads DROP COLUMN IF EXISTS preferred_time_slot;
*/

-- ============================================
-- TESTE FINAL
-- ============================================
-- Inserir um appointment de teste (comentado por segurança)
/*
INSERT INTO appointments (
    lead_id,
    appointment_date,
    appointment_time_slot,
    status
) VALUES (
    (SELECT id FROM leads LIMIT 1), -- Pega o primeiro lead
    '2025-11-25',
    '10:00-12:00',
    'scheduled'
) RETURNING *;
*/
