-- ========================================
-- CREATE ADMIN USER - FlipCars 2.0
-- ========================================
-- Execute este SQL no Supabase SQL Editor
-- URL: https://supabase.com/dashboard/project/[your-project]/sql/new

-- Passo 1: Verificar se roles existem
SELECT id, name FROM roles ORDER BY name;

-- Passo 2: Criar usuário admin se não existir
-- Password: Password123! (bcrypt hash)
INSERT INTO "user" (
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
    'Admin FlipCars',
    'admin@flipcars.us',
    '$2b$10$FhRk/vs5ciAnQZYa.IVIueoTJkUzdCTke6FwNa2Rqm.GzwS.VqmGO',
    '+1-555-1234',
    'active',
    'en',
    true,
    NOW(),
    NOW()
)
ON CONFLICT (email) DO NOTHING
RETURNING id, email;

-- Passo 3: Associar role ADMIN ao usuário
-- (Execute após criar o usuário acima)
INSERT INTO user_roles ("userId", "roleId")
SELECT 
    u.id,
    r.id
FROM 
    "user" u,
    roles r
WHERE 
    u.email = 'admin@flipcars.us'
    AND r.name = 'admin'
ON CONFLICT DO NOTHING;

-- Verificar usuário criado
SELECT 
    u.id,
    u.name,
    u.email,
    u.status,
    r.name as role
FROM "user" u
LEFT JOIN user_roles ur ON u.id = ur."userId"
LEFT JOIN roles r ON ur."roleId" = r.id
WHERE u.email = 'admin@flipcars.us';

-- ========================================
-- CREDENCIAIS DE LOGIN
-- ========================================
-- Email: admin@flipcars.us
-- Password: Password123!
-- ========================================
