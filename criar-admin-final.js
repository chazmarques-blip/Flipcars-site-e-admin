#!/usr/bin/env node

const { Client } = require('pg');

const DATABASE_URL = 'postgresql://postgres:jNZrCPxxpIeOqyfrhlRIFHvGzzAAioMb@maglev.proxy.rlwy.net:58259/railway';

async function criarAdmin() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('🔌 Conectado ao database!\n');

    // Criar role superadmin
    console.log('📋 Criando role superadmin...');
    await client.query(`
      INSERT INTO roles (id, name, description, created_at, updated_at)
      VALUES (
        '00000000-0000-0000-0000-000000000001',
        'superadmin',
        'Super Administrator',
        NOW(),
        NOW()
      )
      ON CONFLICT (id) DO NOTHING
    `);
    console.log('✅ Role criada!\n');

    // Criar usuário admin
    console.log('👤 Criando usuário admin...');
    await client.query(`
      INSERT INTO users (
        id,
        name,
        email,
        password,
        status,
        email_verified,
        created_at,
        updated_at
      )
      VALUES (
        '00000000-0000-0000-0000-000000000001',
        'Admin FlipCars',
        'admin@flipcars.com',
        '$2b$10$9kE7vps6NfrE81B6neRGM.o1k6lPcKDxlYZMqi5UPvDN5nPH0vizS',
        'active',
        true,
        NOW(),
        NOW()
      )
      ON CONFLICT (email) DO UPDATE SET
        password = '$2b$10$9kE7vps6NfrE81B6neRGM.o1k6lPcKDxlYZMqi5UPvDN5nPH0vizS',
        status = 'active',
        email_verified = true
    `);
    console.log('✅ Usuário criado!\n');

    // Associar usuário à role
    console.log('🔗 Associando usuário à role...');
    await client.query(`
      INSERT INTO user_roles (user_id, role_id)
      VALUES (
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000001'
      )
      ON CONFLICT DO NOTHING
    `);
    console.log('✅ Associação criada!\n');

    // Verificar
    const result = await client.query(`
      SELECT u.email, u.name, u.status, r.name as role
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE u.email = 'admin@flipcars.com'
    `);

    console.log('🎉 USUÁRIO ADMIN CRIADO COM SUCESSO!');
    console.log('='.repeat(60));
    console.log('Email:', result.rows[0].email);
    console.log('Nome:', result.rows[0].name);
    console.log('Status:', result.rows[0].status);
    console.log('Role:', result.rows[0].role);
    console.log('='.repeat(60));
    console.log('\n🔑 CREDENCIAIS:');
    console.log('   Email: admin@flipcars.com');
    console.log('   Senha: Admin123!');
    console.log('\n🌐 TESTE AGORA:');
    console.log('   https://admin.flipcars.us/auth/login');

  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

criarAdmin();
