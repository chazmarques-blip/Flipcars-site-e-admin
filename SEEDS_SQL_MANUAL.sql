-- ============================================================================
-- FLIPCARS - SEEDS MANUAL (SQL)
-- ============================================================================
-- Data: 2025-11-12
-- Propósito: Criar dados iniciais no banco Supabase
-- Como usar: Copie e cole no Supabase SQL Editor
-- URL: https://supabase.com/dashboard/project/kvjvieekkudeqtnunqlb/sql
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. CRIAR USUÁRIO ADMIN
-- ----------------------------------------------------------------------------
-- Senha: Admin123! (já em bcrypt hash)
-- Email: admin@flipcars.com

INSERT INTO users (
  email,
  password,
  first_name,
  last_name,
  role,
  is_active,
  created_at,
  updated_at
)
VALUES (
  'admin@flipcars.com',
  '$2b$10$K7L1TI2Xrk6MYqrBXlqZ8OzUjWzXZQfKq8WxN5hJ9mKl1Qp9tXJSi',  -- Hash de: Admin123!
  'Admin',
  'FlipCars',
  'admin',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  password = EXCLUDED.password,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- ----------------------------------------------------------------------------
-- 2. VERIFICAR SE ADMIN FOI CRIADO
-- ----------------------------------------------------------------------------
SELECT 
  id,
  email,
  first_name,
  last_name,
  role,
  is_active,
  created_at
FROM users 
WHERE email = 'admin@flipcars.com';

-- ============================================================================
-- SUCESSO!
-- ============================================================================
-- ✅ Se você vê um registro acima, o admin foi criado com sucesso!
-- 
-- 🔑 CREDENCIAIS:
--    Email: admin@flipcars.com
--    Senha: Admin123!
--
-- 🧪 TESTAR LOGIN:
--    1. Acesse: https://admin.flipcars.us
--    2. Faça login com as credenciais acima
--    3. Deve entrar no dashboard
--
-- ============================================================================

-- ----------------------------------------------------------------------------
-- OPCIONAL: OUTROS SEEDS
-- ----------------------------------------------------------------------------

-- Se você quiser adicionar mais dados de exemplo, descomente abaixo:

/*
-- SERVICE TYPES (Tipos de Serviço)
INSERT INTO service_types (name, description, created_at, updated_at)
VALUES
  ('Paintless Dent Repair', 'Remove dents without repainting', NOW(), NOW()),
  ('Auto Body Repair', 'Complete collision repair services', NOW(), NOW()),
  ('Paint Services', 'Professional automotive painting', NOW(), NOW()),
  ('Glass Repair', 'Windshield and window services', NOW(), NOW()),
  ('Detailing', 'Professional car cleaning and detailing', NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

-- FAQ ITEMS
INSERT INTO cms_faqs (question, answer, category, display_order, is_published, created_at, updated_at)
VALUES
  (
    'How long does a typical repair take?',
    'Most repairs are completed within 2-5 business days, depending on the extent of damage.',
    'General',
    1,
    true,
    NOW(),
    NOW()
  ),
  (
    'Do you work with insurance companies?',
    'Yes, we work with all major insurance providers and can help you with the claims process.',
    'Insurance',
    2,
    true,
    NOW(),
    NOW()
  ),
  (
    'What areas do you serve?',
    'We proudly serve the entire Miami-Dade County area.',
    'Service Area',
    3,
    true,
    NOW(),
    NOW()
  )
ON CONFLICT DO NOTHING;

-- SAMPLE CUSTOMER (para testes)
INSERT INTO customers (
  first_name,
  last_name,
  email,
  phone,
  status,
  created_at,
  updated_at
)
VALUES (
  'John',
  'Doe',
  'john.doe@example.com',
  '+1 (305) 555-0100',
  'active',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;
*/

-- ============================================================================
-- FIM DO SCRIPT
-- ============================================================================
