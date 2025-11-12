-- ============================================================================
-- CRIAR USUÁRIO ADMIN - SQL CORRETO PARA SUA ESTRUTURA
-- ============================================================================
-- Data: 2025-11-12
-- Estrutura baseada em: backend/src/database/entities/user.entity.ts
-- ============================================================================

-- ----------------------------------------------------------------------------
-- PASSO 1: CRIAR O USUÁRIO ADMIN
-- ----------------------------------------------------------------------------
-- Senha: Admin123! (hash bcrypt)

INSERT INTO users (
  name,
  email,
  password,
  phone,
  status,
  language,
  email_verified,
  created_at,
  updated_at
)
VALUES (
  'Admin FlipCars',
  'admin@flipcars.com',
  '$2b$10$K7L1TI2Xrk6MYqrBXlqZ8OzUjWzXZQfKq8WxN5hJ9mKl1Qp9tXJSi',
  '+1 (305) 555-0100',
  'active',
  'en',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) 
DO UPDATE SET
  name = EXCLUDED.name,
  password = EXCLUDED.password,
  status = EXCLUDED.status,
  email_verified = EXCLUDED.email_verified,
  updated_at = NOW()
RETURNING id, name, email, status;

-- Se o comando acima rodou com sucesso, você verá o ID do usuário criado!
-- Copie esse ID para usar no próximo passo.

-- ----------------------------------------------------------------------------
-- PASSO 2: VERIFICAR SE ROLE 'admin' EXISTE
-- ----------------------------------------------------------------------------

SELECT id, name, description FROM roles WHERE name = 'admin';

-- Se NÃO mostrar nenhuma linha, rode o PASSO 2B abaixo.
-- Se mostrar 1 linha com o role admin, vá direto para o PASSO 3.

-- ----------------------------------------------------------------------------
-- PASSO 2B: CRIAR ROLE 'admin' (SE NÃO EXISTIR)
-- ----------------------------------------------------------------------------

INSERT INTO roles (name, description, created_at, updated_at)
VALUES (
  'admin',
  'Administrator with full system access',
  NOW(),
  NOW()
)
ON CONFLICT (name) DO NOTHING
RETURNING id, name, description;

-- Copie o ID do role 'admin' que foi retornado (ou que já existia)

-- ----------------------------------------------------------------------------
-- PASSO 3: ASSOCIAR USUÁRIO COM ROLE ADMIN
-- ----------------------------------------------------------------------------
-- IMPORTANTE: Substitua os IDs abaixo pelos IDs reais do seu banco!
-- 
-- Onde encontrar:
-- - user_id: ID retornado no PASSO 1
-- - role_id: ID retornado no PASSO 2 ou 2B

-- OPÇÃO A: Se você já conhece os IDs (substitua os valores)
/*
INSERT INTO user_roles (user_id, role_id)
VALUES (
  'SEU-USER-ID-AQUI',    -- Substitua pelo ID do usuário
  'SEU-ROLE-ID-AQUI'     -- Substitua pelo ID do role admin
)
ON CONFLICT (user_id, role_id) DO NOTHING;
*/

-- OPÇÃO B: Buscar IDs automaticamente (RECOMENDADO)
INSERT INTO user_roles (user_id, role_id)
SELECT 
  u.id as user_id,
  r.id as role_id
FROM 
  users u,
  roles r
WHERE 
  u.email = 'admin@flipcars.com'
  AND r.name = 'admin'
ON CONFLICT (user_id, role_id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- PASSO 4: VERIFICAR SE TUDO DEU CERTO
-- ----------------------------------------------------------------------------

-- Verificar usuário criado
SELECT 
  u.id,
  u.name,
  u.email,
  u.status,
  u.email_verified,
  u.created_at
FROM users u
WHERE u.email = 'admin@flipcars.com';

-- Verificar roles associados
SELECT 
  u.name as user_name,
  u.email,
  r.name as role_name,
  r.description as role_description
FROM users u
JOIN user_roles ur ON ur.user_id = u.id
JOIN roles r ON r.id = ur.role_id
WHERE u.email = 'admin@flipcars.com';

-- ============================================================================
-- SE TUDO DEU CERTO, VOCÊ DEVE VER:
-- ============================================================================
-- 
-- 1. Na primeira query: 1 linha com o usuário admin
-- 2. Na segunda query: 1 linha mostrando user "Admin FlipCars" com role "admin"
--
-- 🔑 CREDENCIAIS:
--    Email: admin@flipcars.com
--    Senha: Admin123!
--
-- 🧪 TESTAR:
--    1. Acesse: https://admin.flipcars.us
--    2. Faça login com as credenciais acima
--
-- ============================================================================

-- ----------------------------------------------------------------------------
-- TROUBLESHOOTING
-- ----------------------------------------------------------------------------

-- Se user_roles der erro "table does not exist", execute:
/*
CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID NOT NULL,
  role_id UUID NOT NULL,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);
*/

-- Se roles não existir, execute:
/*
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
*/

-- ============================================================================
-- FIM
-- ============================================================================
