-- ============================================
-- 🔴 DIAGNÓSTICO SENIOR - ANÁLISE COMPLETA
-- ============================================

-- 1. VERIFICAR APPOINTMENT CRIADO
SELECT 
  id,
  lead_id,
  appointment_date,
  appointment_time_slot,
  appointment_start_time,
  appointment_end_time,
  status,
  created_at,
  TO_CHAR(appointment_date, 'YYYY-MM-DD') as date_formatted,
  EXTRACT(YEAR FROM appointment_date) as year,
  EXTRACT(MONTH FROM appointment_date) as month,
  EXTRACT(DAY FROM appointment_date) as day
FROM appointments
ORDER BY created_at DESC;

-- 2. VERIFICAR SE LEAD EXISTE E TEM DADOS
SELECT 
  a.id as appointment_id,
  a.appointment_date,
  a.status,
  l.id as lead_id,
  l.name as lead_name,
  l.phone as lead_phone,
  l.email as lead_email
FROM appointments a
LEFT JOIN leads l ON a.lead_id = l.id
ORDER BY a.created_at DESC;

-- 3. VERIFICAR TIPO DE DADOS DA COLUNA appointment_date
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'appointments' 
  AND column_name = 'appointment_date';

-- 4. TESTAR QUERY QUE A API USA (mês 11 = novembro)
SELECT 
  a.*,
  l.name as lead_name,
  l.phone as lead_phone
FROM appointments a
LEFT JOIN leads l ON a.lead_id = l.id
WHERE a.appointment_date >= '2025-11-01'
  AND a.appointment_date <= '2025-11-30'
ORDER BY a.appointment_date ASC, a.appointment_start_time ASC;

-- 5. VERIFICAR SE HÁ APPOINTMENTS EM QUALQUER MÊS
SELECT 
  TO_CHAR(appointment_date, 'YYYY-MM') as year_month,
  COUNT(*) as total_appointments
FROM appointments
GROUP BY TO_CHAR(appointment_date, 'YYYY-MM')
ORDER BY year_month;

-- ============================================
-- 🎯 PROBLEMA IDENTIFICADO:
-- ============================================
-- O appointment foi criado para '2025-11-25'
-- A API busca por /month/2025/11
-- O frontend está configurado para currentMonth = 11
-- 
-- Se não aparecer na query #4, o problema está no:
-- 1. Formato da data no banco (DATE vs VARCHAR)
-- 2. Timezone issues
-- 3. Query da API incorreta
-- ============================================
