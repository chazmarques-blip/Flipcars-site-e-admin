-- ====================================
-- FIX ADMIN ROLE NO RAILWAY
-- ====================================
-- PROBLEMA: Usuário admin@flipcars.com tem role "superadmin"
-- CORRETO: Deve ter role "super_admin" (com underscore)
-- ====================================

-- 1. Verificar usuário atual
SELECT 
  u.id, 
  u.name, 
  u.email, 
  u.status,
  ARRAY_AGG(r.name) as roles
FROM users u
LEFT JOIN user_roles ur ON ur."userId" = u.id
LEFT JOIN roles r ON r.id = ur."roleId"
WHERE u.email = 'admin@flipcars.com'
GROUP BY u.id, u.name, u.email, u.status;

-- 2. Verificar roles disponíveis
SELECT id, name FROM roles ORDER BY name;

-- 3. Remover todas as roles do usuário admin
DELETE FROM user_roles
WHERE "userId" IN (
  SELECT id FROM users WHERE email = 'admin@flipcars.com'
);

-- 4. Adicionar role super_admin correta
INSERT INTO user_roles ("userId", "roleId")
SELECT 
  u.id,
  r.id
FROM users u
CROSS JOIN roles r
WHERE u.email = 'admin@flipcars.com'
  AND r.name = 'super_admin';

-- 5. Verificar resultado final
SELECT 
  u.id, 
  u.name, 
  u.email, 
  u.status,
  ARRAY_AGG(r.name) as roles
FROM users u
LEFT JOIN user_roles ur ON ur."userId" = u.id
LEFT JOIN roles r ON r.id = ur."roleId"
WHERE u.email = 'admin@flipcars.com'
GROUP BY u.id, u.name, u.email, u.status;

