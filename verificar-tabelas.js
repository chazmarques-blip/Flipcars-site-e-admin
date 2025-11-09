#!/usr/bin/env node

const { Client } = require('pg');

const DATABASE_URL = 'postgresql://postgres:jNZrCPxxpIeOqyfrhlRIFHvGzzAAioMb@maglev.proxy.rlwy.net:58259/railway';

async function verificarTabelas() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Conectado ao PostgreSQL!\n');

    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log('📋 Tabelas existentes no database:');
    console.log('='.repeat(60));
    if (result.rows.length === 0) {
      console.log('❌ NENHUMA TABELA ENCONTRADA!');
      console.log('⚠️  As migrations NÃO rodaram!');
    } else {
      result.rows.forEach(row => {
        console.log(`  - ${row.table_name}`);
      });
    }
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

verificarTabelas();
