#!/usr/bin/env node

/**
 * Script para criar usuário admin automaticamente no Railway
 * Executa via API do backend que já tem acesso ao database
 */

const https = require('https');

const BACKEND_URL = 'https://upbeat-dedication-production.up.railway.app';

// SQL para criar usuário
const createUserSQL = `
-- Criar Role Superadmin
INSERT INTO roles (id, name, description, "createdAt", "updatedAt")
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'superadmin',
  'Super Administrator with full system access',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Criar Usuário Admin
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
`;

console.log('🚀 Tentando criar usuário admin automaticamente...\n');
console.log('⚠️  ATENÇÃO: Este script precisa de um endpoint especial no backend');
console.log('   que execute SQL raw (não implementado por segurança)\n');
console.log('📋 SQL que seria executado:');
console.log('=' .repeat(60));
console.log(createUserSQL);
console.log('=' .repeat(60));
console.log('\n❌ BLOQUEADO: Railway API não permite executar SQL diretamente');
console.log('❌ BLOQUEADO: Token tem permissões limitadas (somente leitura)\n');
console.log('✅ SOLUÇÃO: Você precisa executar o SQL manualmente no Railway Dashboard\n');
console.log('📄 Copie o SQL acima e execute em:');
console.log('   Railway → Postgres → Query Tool\n');

process.exit(0);
