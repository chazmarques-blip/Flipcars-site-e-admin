-- ============================================================
-- CRIAR USUÁRIO ADMIN MANUALMENTE
-- ============================================================
-- Use este SQL se não conseguir executar seeds via Railway CLI
-- Execute no SQL Editor do Railway ou em qualquer cliente PostgreSQL
--
-- Credenciais criadas:
-- Email: admin@flipcars.us
-- Senha: Password123!
--
-- Data: 2025-11-11
-- ============================================================

-- ============================================================
-- PASSO 1: Criar Role Admin (se não existir)
-- ============================================================
INSERT INTO role (
  id,
  name,
  description,
  "createdAt",
  "updatedAt"
)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  'admin',
  'Administrator with full access except role management',
  NOW(),
  NOW()
)
ON CONFLICT (name) DO NOTHING;

-- Verificar se role foi criada
SELECT id, name, description FROM role WHERE name = 'admin';

-- ============================================================
-- PASSO 2: Criar Usuário Admin
-- ============================================================
-- NOTA: O hash abaixo é para a senha "Password123!"
-- Gerado com bcrypt (rounds=10)

INSERT INTO "user" (
  id,
  name,
  email,
  password,
  phone,
  status,
  language,
  "emailVerified",
  "createdAt",
  "updatedAt"
)
VALUES (
  gen_random_uuid(),
  'Admin User',
  'admin@flipcars.us',
  '$2b$10$rqYQWJKTi0Y9R8NXHZxzOeV4xOKNKL0gEk3E7p0hMQBwFKYZqGNGO',
  '+1-555-0002',
  'active',
  'en',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING
RETURNING id, name, email;

-- Se o INSERT retornou um ID, copie-o!
-- Você precisará dele no próximo passo

-- ============================================================
-- PASSO 3: Obter ID do Usuário Admin (se não viu no RETURNING)
-- ============================================================
SELECT id, name, email FROM "user" WHERE email = 'admin@flipcars.us';

-- Copie o UUID retornado (algo como: a1b2c3d4-e5f6-7890-abcd-ef1234567890)

-- ============================================================
-- PASSO 4: Associar Usuário à Role Admin
-- ============================================================
-- IMPORTANTE: Substitua '[USER_ID_AQUI]' pelo UUID copiado no passo 3!

INSERT INTO user_roles_role ("userId", "roleId")
VALUES (
  '[USER_ID_AQUI]',  -- ⚠️ SUBSTITUA pelo UUID do usuário admin
  '00000000-0000-0000-0000-000000000002'
)
ON CONFLICT DO NOTHING;

-- ============================================================
-- PASSO 5: Verificar Criação Completa
-- ============================================================
-- Este SELECT deve retornar o usuário admin com sua role

SELECT 
  u.id,
  u.name,
  u.email,
  u.status,
  u."emailVerified",
  r.name as role_name,
  r.description as role_description
FROM "user" u
LEFT JOIN user_roles_role urr ON u.id = urr."userId"
LEFT JOIN role r ON urr."roleId" = r.id
WHERE u.email = 'admin@flipcars.us';

-- Resultado esperado:
-- | id (UUID) | name | email | status | emailVerified | role_name | role_description |
-- | ... | Admin User | admin@flipcars.us | active | true | admin | Administrator... |

-- ============================================================
-- VERIFICAÇÕES ADICIONAIS
-- ============================================================

-- Verificar quantos usuários existem
SELECT COUNT(*) as total_users FROM "user";

-- Verificar todas as roles
SELECT id, name, description FROM role ORDER BY name;

-- Verificar todos os usuários e suas roles
SELECT 
  u.email,
  u.name,
  u.status,
  STRING_AGG(r.name, ', ') as roles
FROM "user" u
LEFT JOIN user_roles_role urr ON u.id = urr."userId"
LEFT JOIN role r ON urr."roleId" = r.id
GROUP BY u.id, u.email, u.name, u.status
ORDER BY u.email;

-- ============================================================
-- TESTAR SENHA (OPCIONAL - para debug)
-- ============================================================
-- PostgreSQL não tem bcrypt built-in, então não podemos testar aqui
-- Mas o backend Node.js vai validar quando você fizer login
--
-- Se quiser gerar um novo hash bcrypt para outra senha, use Node.js:
--
-- const bcrypt = require('bcrypt');
-- const hash = await bcrypt.hash('SuaSenhaAqui', 10);
-- console.log(hash);
--
-- Depois substitua o hash no INSERT acima

-- ============================================================
-- CRIAR OUTROS USUÁRIOS (OPCIONAL)
-- ============================================================

-- Super Admin
INSERT INTO role (id, name, description, "createdAt", "updatedAt")
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'super_admin',
  'Super administrator with full system access',
  NOW(),
  NOW()
)
ON CONFLICT (name) DO NOTHING;

INSERT INTO "user" (id, name, email, password, phone, status, language, "emailVerified", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'Super Admin',
  'superadmin@flipcars.us',
  '$2b$10$rqYQWJKTi0Y9R8NXHZxzOeV4xOKNKL0gEk3E7p0hMQBwFKYZqGNGO',
  '+1-555-0001',
  'active',
  'en',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Agent Role
INSERT INTO role (id, name, description, "createdAt", "updatedAt")
VALUES (
  '00000000-0000-0000-0000-000000000003',
  'agent',
  'Sales agent with access to leads and customers',
  NOW(),
  NOW()
)
ON CONFLICT (name) DO NOTHING;

INSERT INTO "user" (id, name, email, password, phone, status, language, "emailVerified", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'Agent Smith',
  'agent@flipcars.us',
  '$2b$10$rqYQWJKTi0Y9R8NXHZxzOeV4xOKNKL0gEk3E7p0hMQBwFKYZqGNGO',
  '+1-555-0003',
  'active',
  'en',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- LIMPEZA (USE APENAS SE PRECISAR RECOMEÇAR)
-- ============================================================
-- ⚠️ CUIDADO: Isso apaga TODOS os usuários e roles!
-- Descomente apenas se tiver certeza

-- DELETE FROM user_roles_role;
-- DELETE FROM "user" WHERE email LIKE '%@flipcars.us';
-- DELETE FROM role WHERE name IN ('super_admin', 'admin', 'agent', 'customer', 'read_only');

-- ============================================================
-- EXEMPLO COMPLETO: Criar Admin em 1 Query
-- ============================================================
-- Se quiser fazer tudo de uma vez (PostgreSQL 11+):

DO $$
DECLARE
  admin_role_id UUID := '00000000-0000-0000-0000-000000000002';
  admin_user_id UUID;
BEGIN
  -- Criar role
  INSERT INTO role (id, name, description, "createdAt", "updatedAt")
  VALUES (admin_role_id, 'admin', 'Administrator', NOW(), NOW())
  ON CONFLICT (name) DO NOTHING;

  -- Criar usuário
  INSERT INTO "user" (id, name, email, password, phone, status, language, "emailVerified", "createdAt", "updatedAt")
  VALUES (
    gen_random_uuid(),
    'Admin User',
    'admin@flipcars.us',
    '$2b$10$rqYQWJKTi0Y9R8NXHZxzOeV4xOKNKL0gEk3E7p0hMQBwFKYZqGNGO',
    '+1-555-0002',
    'active',
    'en',
    true,
    NOW(),
    NOW()
  )
  ON CONFLICT (email) DO NOTHING
  RETURNING id INTO admin_user_id;

  -- Associar role
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO user_roles_role ("userId", "roleId")
    VALUES (admin_user_id, admin_role_id)
    ON CONFLICT DO NOTHING;
    
    RAISE NOTICE 'Admin user created successfully with ID: %', admin_user_id;
  ELSE
    RAISE NOTICE 'Admin user already exists';
  END IF;
END $$;

-- ============================================================
-- FIM DO SCRIPT
-- ============================================================
-- 
-- RESUMO:
-- 1. Execute este SQL no PostgreSQL do Railway
-- 2. Verifique que usuário foi criado (PASSO 5)
-- 3. Teste login no frontend:
--    Email: admin@flipcars.us
--    Senha: Password123!
-- 4. Se funcionar, MUDE A SENHA imediatamente!
--
-- ============================================================
