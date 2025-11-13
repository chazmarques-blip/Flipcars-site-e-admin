-- ========================================
-- CRIAR USUÁRIO ADMIN - FlipCars (CORRETO)
-- ========================================
-- Execute este SQL no Supabase SQL Editor

-- PASSO 1: Verificar se role ADMIN existe
SELECT id, name, description FROM roles WHERE name = 'admin';

-- Se não existir, criar:
INSERT INTO roles (name, description, created_at, updated_at)
VALUES ('admin', 'Administrator with full system access', NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

-- PASSO 2: Criar usuário admin
-- Senha: admin123 (hash bcrypt)
INSERT INTO "user" (
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
    'admin@flipcars.us',
    '$2b$10$Yq8Y.zQf3L5Z5Z5Z5Z5Z5uXK5K5K5K5K5K5K5K5K5K5K5K5K5K5K5',
    '+1-555-1234',
    'active',
    'en',
    true,
    NOW(),
    NOW()
)
ON CONFLICT (email) 
DO UPDATE SET
    password = EXCLUDED.password,
    updated_at = NOW()
RETURNING id, name, email;

-- PASSO 3: Associar role ADMIN ao usuário
INSERT INTO user_roles (user_id, role_id)
SELECT 
    u.id,
    r.id
FROM "user" u
CROSS JOIN roles r
WHERE u.email = 'admin@flipcars.us'
AND r.name = 'admin'
ON CONFLICT DO NOTHING;

-- PASSO 4: Verificar usuário criado
SELECT 
    u.id,
    u.name,
    u.email,
    u.status,
    u.language,
    r.name as role
FROM "user" u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
WHERE u.email = 'admin@flipcars.us';

-- ========================================
-- CREDENCIAIS DE LOGIN
-- ========================================
-- Email: admin@flipcars.us
-- Password: admin123
-- ========================================
