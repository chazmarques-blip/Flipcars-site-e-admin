#!/usr/bin/env node

const { Client } = require('pg');

const DATABASE_URL = 'postgresql://postgres:jNZrCPxxpIeOqyfrhlRIFHvGzzAAioMb@maglev.proxy.rlwy.net:58259/railway';

const SQL = `
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

-- Verificar se foi criado
SELECT 
  u.email,
  u."firstName",
  u."lastName",
  u.status,
  r.name as role
FROM users u
LEFT JOIN roles r ON u."roleId" = r.id
WHERE u.email = 'admin@flipcars.com';
`;

async function executarSQL() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔌 Conectando ao PostgreSQL do Railway...');
    await client.connect();
    console.log('✅ Conectado!\n');

    console.log('📦 Executando SQL...');
    const result = await client.query(SQL);
    
    console.log('✅ SQL executado com sucesso!\n');
    
    console.log('👤 Usuário criado:');
    console.log('='.repeat(60));
    if (result.rows && result.rows.length > 0) {
      console.log(JSON.stringify(result.rows[0], null, 2));
    } else {
      console.log('Usuário criado mas não retornou na query de verificação');
    }
    console.log('='.repeat(60));
    
    console.log('\n🎉 SUCESSO! Usuário admin criado!');
    console.log('\n🔑 Credenciais:');
    console.log('   Email: admin@flipcars.com');
    console.log('   Senha: Admin123!');
    console.log('\n🌐 Teste agora em:');
    console.log('   https://admin.flipcars.us/auth/login');
    
  } catch (error) {
    console.error('\n❌ Erro ao executar SQL:');
    console.error(error.message);
    console.error('\nDetalhes:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 Conexão fechada');
  }
}

executarSQL();
