-- ============================================================================
-- SQL COMPLETO - CRIAR TABELAS + ADMIN
-- ============================================================================
-- Data: 2025-11-12
-- Propósito: Criar tabelas roles/user_roles e usuário admin
-- Tempo estimado: 1 minuto
-- ============================================================================

-- ----------------------------------------------------------------------------
-- PASSO 1: CRIAR TABELA ROLES
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- PASSO 2: CRIAR TABELA USER_ROLES (relacionamento muitos-para-muitos)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID NOT NULL,
  role_id UUID NOT NULL,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- PASSO 3: CRIAR ÍNDICES PARA PERFORMANCE
-- ----------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_roles_name ON roles(name);

-- ----------------------------------------------------------------------------
-- PASSO 4: CRIAR USUÁRIO ADMIN
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

-- ----------------------------------------------------------------------------
-- PASSO 5: CRIAR ROLE ADMIN
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

-- ----------------------------------------------------------------------------
-- PASSO 6: CRIAR ROLES ADICIONAIS (OPCIONAL)
-- ----------------------------------------------------------------------------
-- Descomente se quiser criar mais roles

/*
INSERT INTO roles (name, description, created_at, updated_at)
VALUES 
  ('manager', 'Manager with extended permissions', NOW(), NOW()),
  ('agent', 'Customer service agent', NOW(), NOW()),
  ('viewer', 'Read-only access', NOW(), NOW())
ON CONFLICT (name) DO NOTHING;
*/

-- ----------------------------------------------------------------------------
-- PASSO 7: ASSOCIAR USUÁRIO ADMIN COM ROLE ADMIN
-- ----------------------------------------------------------------------------

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
-- PASSO 8: VERIFICAR TUDO
-- ----------------------------------------------------------------------------

-- Verificar tabelas criadas
SELECT 
  'Tabelas criadas' as status,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'roles') as roles_exists,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'user_roles') as user_roles_exists;

-- Verificar roles criadas
SELECT 'Roles cadastrados:' as info, id, name, description FROM roles;

-- Verificar usuário admin
SELECT 
  'Usuário admin:' as info,
  u.id,
  u.name,
  u.email,
  u.status,
  u.email_verified
FROM users u
WHERE u.email = 'admin@flipcars.com';

-- Verificar associação user <-> role
SELECT 
  'Associação user-role:' as info,
  u.name as user_name,
  u.email,
  r.name as role_name,
  r.description as role_description
FROM users u
JOIN user_roles ur ON ur.user_id = u.id
JOIN roles r ON r.id = ur.role_id
WHERE u.email = 'admin@flipcars.com';

-- ============================================================================
-- RESULTADO ESPERADO:
-- ============================================================================
--
-- ✅ Query 1-3: Tabelas e índices criados
-- ✅ Query 4: Usuário admin criado
-- ✅ Query 5: Role admin criado
-- ✅ Query 7: Associação criada
-- ✅ Query 8-11: Verificações mostram dados corretos
--
-- 🔑 CREDENCIAIS:
--    Email: admin@flipcars.com
--    Senha: Admin123!
--
-- 🧪 TESTAR:
--    https://admin.flipcars.us
--
-- ============================================================================

-- ----------------------------------------------------------------------------
-- TROUBLESHOOTING
-- ----------------------------------------------------------------------------

-- Se users não existir (improvável), execute:
/*
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  avatar_url VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active',
  language VARCHAR(10) DEFAULT 'en',
  last_login TIMESTAMP,
  reset_password_token VARCHAR(255),
  reset_password_expires TIMESTAMP,
  email_verified BOOLEAN DEFAULT false,
  email_verification_token VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_status ON users(status);
*/

-- Se precisar deletar tudo e começar de novo:
/*
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
-- Não delete users! Só as tabelas de role
*/

-- ============================================================================
-- FIM
-- ============================================================================
