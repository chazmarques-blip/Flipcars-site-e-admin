-- ============================================
-- 📅 CRIAR APPOINTMENT DE TESTE (CORRETO)
-- ============================================

-- Passo 1: Pegar um lead_id válido
SELECT id, name, phone, email 
FROM leads 
LIMIT 1;

-- Passo 2: COPIE O ID RETORNADO ACIMA e cole no INSERT abaixo
-- Substitua TODO o texto 'COLE_O_LEAD_ID_AQUI' pelo UUID completo

-- Exemplo de UUID válido: 2cc705ff-5482-414c-a249-918f91664f16
-- ⚠️ NÃO use 'LEAD_ID' - use o UUID real!

INSERT INTO appointments (
  lead_id, 
  appointment_date, 
  appointment_time_slot,
  appointment_start_time, 
  appointment_end_time, 
  status
) VALUES (
  'COLE_O_LEAD_ID_AQUI',  -- ⚠️ Substitua por UUID completo do SELECT acima
  '2025-11-25',           -- Data do appointment
  '10:00-12:00',          -- Time slot
  '10:00:00',             -- Start time
  '12:00:00',             -- End time
  'scheduled'             -- Status
) RETURNING *;

-- ============================================
-- 💡 EXEMPLO PRÁTICO (baseado nos seus leads)
-- ============================================

-- Se você tem 18 leads, pegue o primeiro:
SELECT id, name, phone FROM leads ORDER BY created_at DESC LIMIT 1;

-- Depois execute o INSERT com o ID real que pegou acima.
-- Por exemplo, se o ID for: 60397e5e-c8ae-4227-9518-27044c2af7a8

INSERT INTO appointments (
  lead_id, 
  appointment_date, 
  appointment_time_slot,
  appointment_start_time, 
  appointment_end_time, 
  status
) VALUES (
  '60397e5e-c8ae-4227-9518-27044c2af7a8',  -- UUID real
  '2025-11-25',
  '10:00-12:00',
  '10:00:00',
  '12:00:00',
  'scheduled'
) RETURNING *;

-- ============================================
-- ✅ VERIFICAR SE FOI CRIADO
-- ============================================

SELECT 
  a.id as appointment_id,
  a.appointment_date,
  a.appointment_time_slot,
  a.status,
  l.name as lead_name,
  l.phone as lead_phone
FROM appointments a
INNER JOIN leads l ON a.lead_id = l.id
ORDER BY a.created_at DESC;
