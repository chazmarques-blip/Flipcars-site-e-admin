#!/usr/bin/env node

/**
 * Verifica se o usuário admin existe no banco de dados Supabase
 */

const dns = require('dns').promises;
const { Client } = require('pg');

// Resolve hostname to IPv4 manually
async function resolveIPv4(hostname) {
  try {
    const addresses = await dns.resolve4(hostname);
    return addresses[0]; // Return first IPv4 address
  } catch (error) {
    console.error(`❌ Erro ao resolver ${hostname}:`, error.message);
    throw error;
  }
}

async function checkAdminUser() {
  // Parse DATABASE_URL and replace hostname with IPv4
  const originalUrl = 'postgresql://postgres:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2anZpZWVra3VkZXF0bnVucWxiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTc1MTY0OSwiZXhwIjoyMDc3MzI3NjQ5fQ.HdU6WH0JS-oNam1nkHvax6JQC3221VkFXpY1Ejz2x04@db.kvjvieekkudeqtnunqlb.supabase.co:5432/postgres';
  
  const urlObj = new URL(originalUrl);
  const hostname = urlObj.hostname;
  
  console.log(`🔍 Resolvendo ${hostname} para IPv4...`);
  const ipv4 = await resolveIPv4(hostname);
  console.log(`✅ Resolvido para: ${ipv4}\n`);
  
  // Replace hostname with IPv4 in URL
  urlObj.hostname = ipv4;
  const DATABASE_URL = urlObj.toString();

  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔍 Conectando ao banco de dados Supabase...\n');
    await client.connect();
    console.log('✅ Conectado!\n');

    // Verificar se a tabela users existe
    console.log('📋 Verificando tabela users...');
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('❌ Tabela "users" não existe!\n');
      return;
    }
    console.log('✅ Tabela "users" existe\n');

    // Buscar o usuário admin
    console.log('🔍 Buscando usuário admin@flipcars.us...');
    const adminQuery = await client.query(`
      SELECT 
        id,
        email,
        first_name,
        last_name,
        role,
        is_active,
        created_at
      FROM users
      WHERE email = 'admin@flipcars.us'
      LIMIT 1;
    `);

    if (adminQuery.rows.length === 0) {
      console.log('❌ Usuário admin@flipcars.us NÃO encontrado no banco!\n');
      console.log('📝 Você precisa criar o usuário admin. Execute:');
      console.log('   node criar-admin-railway.js\n');
      
      // Mostrar todos os usuários admin
      console.log('🔍 Verificando se existem outros admins...');
      const allAdmins = await client.query(`
        SELECT 
          id,
          email,
          first_name,
          last_name,
          role,
          is_active
        FROM users
        WHERE role IN ('admin', 'super_admin')
        ORDER BY created_at DESC;
      `);
      
      if (allAdmins.rows.length > 0) {
        console.log(`\n✅ Encontrados ${allAdmins.rows.length} usuário(s) admin no banco:\n`);
        allAdmins.rows.forEach((user, index) => {
          console.log(`${index + 1}. ${user.email}`);
          console.log(`   Nome: ${user.first_name} ${user.last_name}`);
          console.log(`   Role: ${user.role}`);
          console.log(`   Ativo: ${user.is_active ? 'Sim' : 'Não'}`);
          console.log(`   ID: ${user.id}\n`);
        });
      } else {
        console.log('❌ Nenhum usuário admin/super_admin encontrado!\n');
      }
    } else {
      const admin = adminQuery.rows[0];
      console.log('✅ Usuário admin encontrado!\n');
      console.log('📋 Detalhes:');
      console.log(`   Email: ${admin.email}`);
      console.log(`   Nome: ${admin.first_name} ${admin.last_name}`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   Ativo: ${admin.is_active ? 'Sim' : 'Não'}`);
      console.log(`   Criado em: ${admin.created_at}`);
      console.log(`   ID: ${admin.id}\n`);

      if (!admin.is_active) {
        console.log('⚠️  ATENÇÃO: Usuário existe mas está INATIVO!\n');
      }

      if (admin.role !== 'admin' && admin.role !== 'super_admin') {
        console.log('⚠️  ATENÇÃO: Usuário não tem role de admin!\n');
        console.log(`   Role atual: ${admin.role}\n`);
      }
    }

    // Contar total de leads
    console.log('🔍 Verificando leads no banco...');
    const leadsCount = await client.query('SELECT COUNT(*) as total FROM leads;');
    console.log(`📊 Total de leads no banco: ${leadsCount.rows[0].total}\n`);

    // Verificar se a coluna contact_preferences existe
    console.log('🔍 Verificando coluna contact_preferences...');
    const columnCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'leads' 
        AND column_name = 'contact_preferences'
      );
    `);

    if (columnCheck.rows[0].exists) {
      console.log('✅ Coluna contact_preferences EXISTE na tabela leads\n');
    } else {
      console.log('❌ Coluna contact_preferences NÃO EXISTE na tabela leads\n');
      console.log('📝 Execute a migration:');
      console.log('   ALTER TABLE "leads" ADD COLUMN "contact_preferences" jsonb NULL;\n');
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error(error);
  } finally {
    await client.end();
    console.log('👋 Conexão fechada.');
  }
}

checkAdminUser();
