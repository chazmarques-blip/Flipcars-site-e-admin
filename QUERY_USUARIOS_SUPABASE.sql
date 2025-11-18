-- ============================================
-- 🔍 QUERIES ÚTEIS PARA SUPABASE
-- ============================================

-- 1. Ver todos os usuários existentes
SELECT 
  id, 
  email, 
  name, 
  status,
  email_verified,
  created_at
FROM users 
ORDER BY created_at DESC;

-- 2. Ver roles dos usuários
SELECT 
  u.email,
  u.name,
  r.name as role,
  r.description
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
ORDER BY u.email;

-- 3. Verificar quantos leads você tem
SELECT COUNT(*) as total_leads FROM leads;

-- 4. Verificar quantos appointments você tem
SELECT COUNT(*) as total_appointments FROM appointments;

-- 5. Ver leads com preferredDate/preferredTimeSlot
SELECT 
  id,
  name,
  phone,
  email,
  preferred_date,
  preferred_time_slot,
  status
FROM leads
WHERE preferred_date IS NOT NULL
ORDER BY preferred_date;

-- ============================================
-- 🔧 CRIAR USUÁRIO DE TESTE (SE NECESSÁRIO)
-- ============================================

-- Criar usuário com email: test@flipcars.us
-- Senha: TestPassword123!
-- (hash bcrypt com 10 rounds)

INSERT INTO users (email, password, name, status, email_verified)
VALUES (
  'test@flipcars.us',
  '$2b$10$YQ98iKT3GqRxJ/Z7W8EUhOJXKx8Xr0Xz5L0NVxdxH8YPqD0w3LYBa', 
  'Test User',
  'active',
  true
)
ON CONFLICT (email) DO NOTHING
RETURNING id, email, name;

-- Atribuir role 'admin' ao usuário de teste
INSERT INTO user_roles (user_id, role_id)
SELECT 
  (SELECT id FROM users WHERE email = 'test@flipcars.us'),
  (SELECT id FROM roles WHERE name = 'admin')
WHERE NOT EXISTS (
  SELECT 1 FROM user_roles ur
  WHERE ur.user_id = (SELECT id FROM users WHERE email = 'test@flipcars.us')
  AND ur.role_id = (SELECT id FROM roles WHERE name = 'admin')
);

-- ============================================
-- 📅 CRIAR APPOINTMENT DE TESTE
-- ============================================

-- Passo 1: Pegar um lead_id válido
SELECT id, name, phone FROM leads LIMIT 1;

-- Passo 2: Criar appointment (substitua 'LEAD_ID_AQUI' por um ID real)
INSERT INTO appointments (
  lead_id, 
  appointment_date, 
  appointment_time_slot,
  appointment_start_time, 
  appointment_end_time, 
  status
) VALUES (
  'LEAD_ID_AQUI',  -- ⚠️ SUBSTITUA por um lead_id válido da query acima
  '2025-11-25',    -- Data do appointment
  '10:00-12:00',   -- Time slot
  '10:00:00',      -- Start time
  '12:00:00',      -- End time
  'scheduled'      -- Status
) RETURNING *;

-- ============================================
-- 📊 VERIFICAR APPOINTMENTS COM LEADS
-- ============================================

SELECT 
  a.id as appointment_id,
  a.appointment_date,
  a.appointment_time_slot,
  a.appointment_start_time,
  a.appointment_end_time,
  a.status,
  a.created_at,
  l.id as lead_id,
  l.name as lead_name,
  l.phone as lead_phone,
  l.email as lead_email
FROM appointments a
INNER JOIN leads l ON a.lead_id = l.id
ORDER BY a.appointment_date DESC, a.appointment_start_time DESC;

-- ============================================
-- 🗑️ LIMPAR APPOINTMENTS DE TESTE (SE NECESSÁRIO)
-- ============================================

-- CUIDADO: Isso deleta TODOS os appointments!
-- DELETE FROM appointments WHERE status = 'scheduled';

-- Ou deletar apenas um específico:
-- DELETE FROM appointments WHERE id = 'APPOINTMENT_ID_AQUI';

-- ============================================
-- 📈 ESTATÍSTICAS RÁPIDAS
-- ============================================

SELECT 
  'Users' as table_name,
  COUNT(*) as count
FROM users
UNION ALL
SELECT 
  'Leads' as table_name,
  COUNT(*) as count
FROM leads
UNION ALL
SELECT 
  'Appointments' as table_name,
  COUNT(*) as count
FROM appointments;

-- ============================================
-- 🔐 TESTAR LOGIN (VIA API)
-- ============================================

-- Depois de criar o usuário test@flipcars.us, teste via curl:
/*
curl -X POST https://upbeat-dedication-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@flipcars.us","password":"TestPassword123!"}'
*/

-- Se retornar accessToken, está funcionando! ✅
