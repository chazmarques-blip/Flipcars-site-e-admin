-- ============================================
-- 🔐 RESETAR SENHA PARA: Admin123!
-- ============================================

-- PASSO 1: Ver usuário atual
SELECT email, name, status, created_at 
FROM users 
WHERE email = 'admin@flipcars.us';

-- PASSO 2: Resetar senha para Admin123! (com A maiúsculo)
UPDATE users 
SET password = '$2b$10$f9.rmDWm/SfM/CYVfbKr9u0Xs3nkSr2gbQa/R1F2YVLS8DqrF/2US'
WHERE email = 'admin@flipcars.us';

-- PASSO 3: Verificar que foi atualizado
SELECT email, name, status, updated_at 
FROM users 
WHERE email = 'admin@flipcars.us';

-- ============================================
-- ✅ DEPOIS DE EXECUTAR, TESTE NO TERMINAL:
-- ============================================

/*
curl -X POST https://upbeat-dedication-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@flipcars.us","password":"Admin123!"}'
*/

-- ============================================
-- 🎯 DEVE RETORNAR:
-- ============================================
-- {
--   "accessToken": "eyJhbGc...",
--   "user": {
--     "id": "...",
--     "email": "admin@flipcars.us",
--     "name": "Admin FlipCars US",
--     "role": "admin"
--   }
-- }
-- ============================================
