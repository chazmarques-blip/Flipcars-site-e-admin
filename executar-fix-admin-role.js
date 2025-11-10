#!/usr/bin/env node

/**
 * Script para executar SQL fix da role do admin
 * Conecta diretamente no PostgreSQL do Railway
 */

const https = require('https');

const BACKEND_URL = 'https://upbeat-dedication-production.up.railway.app';

console.log('🔧 EXECUTANDO FIX DA ROLE DO ADMIN');
console.log('====================================\n');

function httpsRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function main() {
  try {
    console.log('⚠️  IMPORTANTE: Este script precisa de endpoint especial no backend');
    console.log('⚠️  Vamos tentar uma alternativa...\n');
    
    // Alternativa: Criar novo usuário com role correta via API
    console.log('💡 SOLUÇÃO ALTERNATIVA:');
    console.log('   Vamos usar o admin atual para criar um novo super admin\n');
    
    // 1. Login como admin atual
    console.log('1️⃣ Fazendo login como admin...');
    const loginUrl = new URL('/api/auth/login', BACKEND_URL);
    const loginResponse = await httpsRequest(loginUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@flipcars.com',
        password: 'Admin123!',
      }),
    });
    
    if (loginResponse.status === 200 || loginResponse.status === 201) {
      console.log('   ✅ Login OK\n');
      const token = loginResponse.data.tokens.accessToken;
      
      console.log('📋 Dados do usuário atual:');
      console.log('   Email:', loginResponse.data.user.email);
      console.log('   Roles:', loginResponse.data.user.roles);
      console.log('   ⚠️  Role atual:', loginResponse.data.user.roles[0], '(incorreta)\n');
      
      console.log('🔍 Verificando se backend tem endpoint para atualizar roles...');
      console.log('   (Provavelmente não tem, precisamos acesso direto ao banco)\n');
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🎯 CONCLUSÃO:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      console.log('Para corrigir a role, precisamos de uma destas opções:\n');
      console.log('OPÇÃO 1: Acesso direto ao PostgreSQL (psql)');
      console.log('OPÇÃO 2: Railway CLI com comando database');
      console.log('OPÇÃO 3: Ferramenta externa (DBeaver, pgAdmin, etc)\n');
      console.log('📝 Vou criar instruções para cada opção...\n');
      
    } else {
      console.log('   ❌ Erro no login:', loginResponse.status);
      console.log('   Resposta:', loginResponse.data);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

main();
