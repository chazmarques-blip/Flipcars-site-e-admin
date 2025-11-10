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
  console.log('🔍 VERIFICANDO USUÁRIO ADMIN\n');
  
  // Login
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
    console.log('✅ Login OK\n');
    console.log('📊 Dados do token de resposta:');
    console.log(JSON.stringify(loginResponse.data, null, 2));
  } else {
    console.log('❌ Erro no login:', loginResponse.status);
    console.log(loginResponse.data);
  }
}

main();
