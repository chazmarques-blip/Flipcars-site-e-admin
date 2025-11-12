-- ============================================
-- CRIAR USUÁRIO ADMIN NO FLIPCARS
-- Execute este SQL no Supabase SQL Editor
-- ============================================

-- 1. Criar role ADMIN (se não existir)
INSERT INTO roles (name, description, created_at, updated_at)
VALUES ('admin', 'Administrator with full system access', NOW(), NOW())
ON CONFLICT (name) DO UPDATE SET updated_at = NOW();

-- 2. Criar usuário ADMIN
-- Email: admin@flipcars.com
-- Senha: Admin123!
INSERT INTO users (
  email,
  password,
  first_name,
  last_name,
  phone,
  is_active,
  email_verified,
  created_at,
  updated_at
)
VALUES (
  'admin@flipcars.com',
  '$2b$10$sOp.Px5gY8th1v9Ngp33M.9Sm7A36U2sGsraUyoZL7uSFeQCgsBOa',
  'Admin',
  'User',
  '+1-555-0100',
  true,
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  password = EXCLUDED.password,
  updated_at = NOW();

-- 3. Associar usuário ao role ADMIN
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.email = 'admin@flipcars.com' AND r.name = 'admin'
ON CONFLICT DO NOTHING;

-- 4. Verificar se foi criado corretamente
SELECT 
  u.id,
  u.email,
  u.first_name,
  u.last_name,
  u.is_active,
  r.name as role
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
WHERE u.email = 'admin@flipcars.com';

-- ============================================
-- RESULTADO ESPERADO:
-- Deve mostrar 1 linha com:
-- - email: admin@flipcars.com
-- - first_name: Admin
-- - last_name: User
-- - is_active: true
-- - role: admin
-- ============================================
