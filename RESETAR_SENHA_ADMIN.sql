-- ============================================
-- 🔐 RESETAR SENHA DO USUÁRIO ADMIN
-- ============================================

-- Ver todos os usuários admin disponíveis
SELECT id, email, name, status 
FROM users 
WHERE email LIKE '%admin%'
ORDER BY email;

-- ============================================
-- ESCOLHA UMA OPÇÃO ABAIXO:
-- ============================================

-- OPÇÃO 1: Resetar para senha simples: admin123
UPDATE users 
SET password = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL/Ky5jG'
WHERE email = 'admin@flipcars.us';

-- OPÇÃO 2: Resetar para senha forte: FlipCars2024!
UPDATE users 
SET password = '$2b$10$EixZaYVK9559K0YaxC8p8.nrfU0kBQ.A8KqQXZxQm0hGvKqG0K5vy'
WHERE email = 'admin@flipcars.us';

-- OPÇÃO 3: Resetar para senha padrão dos seeds: Password123!
UPDATE users 
SET password = '$2b$10$YQ98iKT3GqRxJ/Z7W8EUhOJXKx8Xr0Xz5L0NVxdxH8YPqD0w3LYBa'
WHERE email = 'admin@flipcars.us';

-- ============================================
-- VERIFICAR SE A SENHA FOI ATUALIZADA
-- ============================================

SELECT 
  email, 
  name, 
  status,
  CASE 
    WHEN password = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL/Ky5jG' THEN 'admin123'
    WHEN password = '$2b$10$EixZaYVK9559K0YaxC8p8.nrfU0kBQ.A8KqQXZxQm0hGvKqG0K5vy' THEN 'FlipCars2024!'
    WHEN password = '$2b$10$YQ98iKT3GqRxJ/Z7W8EUhOJXKx8Xr0Xz5L0NVxdxH8YPqD0w3LYBa' THEN 'Password123!'
    ELSE 'senha_customizada'
  END as senha_atual
FROM users 
WHERE email = 'admin@flipcars.us';

-- ============================================
-- 📋 RESUMO DAS SENHAS DISPONÍVEIS:
-- ============================================
-- admin123       → Senha simples para testes
-- FlipCars2024!  → Senha forte recomendada
-- Password123!   → Senha padrão dos seeds
-- ============================================
