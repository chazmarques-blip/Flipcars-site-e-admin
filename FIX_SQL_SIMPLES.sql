-- Fix FlipCars Leads Error 500
-- Copie TUDO e cole no Supabase SQL Editor

ALTER TABLE leads DROP COLUMN IF EXISTS assigned_human_agent_id;
ALTER TABLE leads DROP COLUMN IF EXISTS service_type;

-- Verificar (deve retornar 33)
SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'leads';
