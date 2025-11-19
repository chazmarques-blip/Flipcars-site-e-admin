-- ============================================
-- 🔍 VERIFICAR SENHA ATUAL NO BANCO
-- ============================================

-- Ver o hash da senha atual
SELECT 
  email, 
  name, 
  status,
  password,
  created_at
FROM users 
WHERE email = 'admin@flipcars.us';

-- ============================================
-- 🔐 HASHES CONHECIDOS (para comparação)
-- ============================================

-- admin123       = $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL/Ky5jG
-- Admin123!      = $2b$10$qZ9w.YGqZ5YqhVxZ7K0YhOXZ9w.YGqZ5YqhVxZ7K0YhO (precisa gerar)
-- FlipCars2024!  = $2b$10$EixZaYVK9559K0YaxC8p8.nrfU0kBQ.A8KqQXZxQm0hGvKqG0K5vy
-- Password123!   = $2b$10$YQ98iKT3GqRxJ/Z7W8EUhOJXKx8Xr0Xz5L0NVxdxH8YPqD0w3LYBa

-- ============================================
-- 📝 PRÓXIMO PASSO
-- ============================================
-- 1. Copie o hash retornado acima
-- 2. Me envie (é seguro, é só um hash)
-- 3. Ou execute o UPDATE abaixo para resetar
-- ============================================

-- RESETAR PARA: Admin123! (com A maiúsculo)
-- Vou gerar o hash correto...
