-- Script SQL para criar usuário admin diretamente no PostgreSQL do Railway
-- Use este script se os seeds não rodaram automaticamente

-- ============================================
-- PASSO 1: Criar Role Superadmin (se não existir)
-- ============================================

INSERT INTO roles (id, name, description, "createdAt", "updatedAt")
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'superadmin',
  'Super Administrator with full system access',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- PASSO 2: Criar Usuário Admin
-- ============================================

-- Password: Admin123!
-- Hash bcrypt (gerado): $2b$10$9kE7vps6NfrE81B6neRGM.o1k6lPcKDxlYZMqi5UPvDN5nPH0vizS

INSERT INTO users (
  id,
  email,
  password,
  "firstName",
  "lastName",
  phone,
  status,
  "emailVerified",
  "roleId",
  "createdAt",
  "updatedAt"
)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@flipcars.com',
  '$2b$10$9kE7vps6NfrE81B6neRGM.o1k6lPcKDxlYZMqi5UPvDN5nPH0vizS',
  'Admin',
  'FlipCars',
  NULL,
  'active',
  true,
  '00000000-0000-0000-0000-000000000001',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  password = '$2b$10$9kE7vps6NfrE81B6neRGM.o1k6lPcKDxlYZMqi5UPvDN5nPH0vizS',
  status = 'active',
  "emailVerified" = true,
  "updatedAt" = NOW();

-- ============================================
-- VERIFICAR SE USUÁRIO FOI CRIADO
-- ============================================

SELECT 
  u.email,
  u."firstName",
  u."lastName",
  u.status,
  r.name as role
FROM users u
LEFT JOIN roles r ON u."roleId" = r.id
WHERE u.email = 'admin@flipcars.com';

-- ============================================
-- RESULTADO ESPERADO:
-- ============================================
-- email: admin@flipcars.com
-- firstName: Admin
-- lastName: FlipCars
-- status: active
-- role: superadmin
-- ============================================
