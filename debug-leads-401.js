#!/usr/bin/env node

const https = require('https');
const BACKEND_URL = 'https://upbeat-dedication-production.up.railway.app';

function httpsRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data), headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: data, headers: res.headers });
        }
      });
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function main() {
  console.log('🔍 DEBUG DO ERRO 401\n');
  
  // 1. Login
  console.log('1️⃣ Fazendo login...');
  const loginUrl = new URL('/api/auth/login', BACKEND_URL);
  const loginResponse = await httpsRequest(loginUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@flipcars.com',
      password: 'Admin123!',
    }),
  });
  
  if (loginResponse.status !== 200 && loginResponse.status !== 201) {
    console.log('   ❌ Login falhou:', loginResponse.status);
    return;
  }
  
  console.log('   ✅ Login OK');
  const token = loginResponse.data.tokens.accessToken;
  const user = loginResponse.data.user;
  
  console.log('\n📋 Usuário:');
  console.log('   Email:', user.email);
  console.log('   Roles:', user.roles);
  console.log('   ID:', user.id);
  
  // Decodificar JWT
  const [, payload] = token.split('.');
  const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());
  console.log('\n🔑 Token JWT decodificado:');
  console.log('   Sub:', decoded.sub);
  console.log('   Email:', decoded.email);
  console.log('   Roles:', decoded.roles);
  console.log('   Exp:', new Date(decoded.exp * 1000).toISOString());
  
  // 2. Testar diferentes endpoints
  console.log('\n2️⃣ Testando endpoints...\n');
  
  const endpoints = [
    { name: 'GET /api/leads', url: '/api/leads', method: 'GET' },
    { name: 'GET /api/leads?page=1', url: '/api/leads?page=1&limit=10', method: 'GET' },
    { name: 'GET /api/leads/statistics', url: '/api/leads/statistics', method: 'GET' },
  ];
  
  for (const endpoint of endpoints) {
    const url = new URL(endpoint.url, BACKEND_URL);
    const response = await httpsRequest(url, {
      method: endpoint.method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`   ${endpoint.name}`);
    console.log(`   Status: ${response.status}`);
    if (response.status !== 200) {
      console.log(`   Erro:`, JSON.stringify(response.data, null, 2));
    } else {
      console.log(`   ✅ Sucesso!`);
      if (response.data.data) {
        console.log(`   Leads encontrados: ${response.data.data.length}`);
      }
    }
    console.log('');
  }
  
  // 3. Verificar headers
  console.log('3️⃣ Verificando headers da última request...');
  const testUrl = new URL('/api/leads', BACKEND_URL);
  const testResponse = await httpsRequest(testUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  console.log('   Response headers:', testResponse.headers);
}

main().catch(console.error);
