#!/usr/bin/env node

/**
 * Script para criar usuário admin diretamente no Railway via API
 * Como as seeds não rodaram, precisamos criar usuário manualmente
 */

const https = require('https');
const { execSync } = require('child_process');

console.log('🔧 CRIANDO USUÁRIO ADMIN NO RAILWAY');
console.log('=====================================\n');

// Primeiro, vamos verificar se conseguimos acessar o Railway CLI
console.log('1️⃣ Verificando acesso ao Railway...');

try {
  // Tentar ver variáveis de ambiente do Railway
  const railwayVars = execSync('railway variables', { encoding: 'utf-8', stdio: 'pipe' }).toString();
  console.log('   ✅ Railway CLI está configurado\n');
  
  // Extrair DATABASE_URL
  const dbUrlMatch = railwayVars.match(/DATABASE_URL[=\s]+(.+)/);
  if (dbUrlMatch) {
    console.log('   ✅ DATABASE_URL encontrada\n');
    
    console.log('2️⃣ Criando SQL para inserir usuário admin...\n');
    
    const createAdminSQL = `
-- Criar role admin se não existir
INSERT INTO roles (id, name, description, permissions, "createdAt", "updatedAt")
VALUES (
  'admin-role-001',
  'admin',
  'Administrator with full access',
  '["*"]',
  NOW(),
  NOW()
)
ON CONFLICT (name) DO NOTHING;

-- Criar usuário admin
-- Email: admin@flipcars.us
-- Senha: FlipCars2024!
-- Hash bcrypt: $2b$10$rZQKvHJ0wvM4xGm5vEQWYOXKGxJ8N3mZdKj5qLxYz8tGpBvC9UJQS

INSERT INTO users (
  id,
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
  'admin-user-001',
  'Admin FlipCars',
  'admin@flipcars.us',
  '$2b$10$rZQKvHJ0wvM4xGm5vEQWYOXKGxJ8N3mZdKj5qLxYz8tGpBvC9UJQS',
  '+1-555-0001',
  'active',
  'en',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  password = '$2b$10$rZQKvHJ0wvM4xGm5vEQWYOXKGxJ8N3mZdKj5qLxYz8tGpBvC9UJQS',
  status = 'active',
  "emailVerified" = true;

-- Associar usuário ao role admin
INSERT INTO user_roles ("userId", "roleId")
VALUES ('admin-user-001', 'admin-role-001')
ON CONFLICT DO NOTHING;

-- Verificar
SELECT u.id, u.name, u.email, u.status, r.name as role
FROM users u
LEFT JOIN user_roles ur ON u.id = ur."userId"
LEFT JOIN roles r ON ur."roleId" = r.id
WHERE u.email = 'admin@flipcars.us';
`;
    
    console.log('SQL gerado:\n');
    console.log(createAdminSQL);
    console.log('\n=====================================');
    console.log('📋 CREDENCIAIS DO NOVO USUÁRIO:');
    console.log('=====================================');
    console.log('Email: admin@flipcars.us');
    console.log('Senha: FlipCars2024!');
    console.log('=====================================\n');
    
    console.log('3️⃣ Para executar este SQL no Railway:\n');
    console.log('Opção A - Via Railway CLI:');
    console.log('   railway run psql $DATABASE_URL -c "SQL_AQUI"\n');
    
    console.log('Opção B - Via Railway Dashboard:');
    console.log('   1. Ir para: https://railway.app/dashboard');
    console.log('   2. Selecionar projeto FlipCars');
    console.log('   3. Clicar no serviço PostgreSQL');
    console.log('   4. Aba "Data" → "Query"');
    console.log('   5. Colar o SQL acima');
    console.log('   6. Executar\n');
    
  } else {
    throw new Error('DATABASE_URL não encontrada');
  }
  
} catch (error) {
  console.log('   ❌ Railway CLI não está configurado ou não tem acesso\n');
  console.log('=====================================');
  console.log('📋 SOLUÇÃO ALTERNATIVA');
  console.log('=====================================\n');
  
  console.log('Como não temos acesso direto ao banco, você precisa:\n');
  
  console.log('1️⃣ Acessar Railway Dashboard:');
  console.log('   https://railway.app/dashboard\n');
  
  console.log('2️⃣ Selecionar projeto FlipCars Backend\n');
  
  console.log('3️⃣ Clicar no serviço PostgreSQL\n');
  
  console.log('4️⃣ Ir na aba "Data" ou "Query"\n');
  
  console.log('5️⃣ Executar este SQL:\n');
  
  console.log(`
-- Criar usuário admin
INSERT INTO users (
  id, name, email, password, phone, status, language, "emailVerified", "createdAt", "updatedAt"
)
VALUES (
  gen_random_uuid(),
  'Admin FlipCars',
  'admin@flipcars.us',
  '$2b$10$rZQKvHJ0wvM4xGm5vEQWYOXKGxJ8N3mZdKj5qLxYz8tGpBvC9UJQS',
  '+1-555-0001',
  'active',
  'en',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  password = '$2b$10$rZQKvHJ0wvM4xGm5vEQWYOXKGxJ8N3mZdKj5qLxYz8tGpBvC9UJQS',
  status = 'active';
`);
  
  console.log('\n=====================================');
  console.log('📋 CREDENCIAIS PARA USAR:');
  console.log('=====================================');
  console.log('Email: admin@flipcars.us');
  console.log('Senha: FlipCars2024!');
  console.log('=====================================\n');
}

console.log('\n🎯 DEPOIS DE CRIAR O USUÁRIO:');
console.log('=====================================');
console.log('1. Abrir: https://admin.flipcars.us/auth/login');
console.log('2. Email: admin@flipcars.us');
console.log('3. Senha: FlipCars2024!');
console.log('4. Clicar Sign In');
console.log('5. ✅ Deve funcionar!\n');
