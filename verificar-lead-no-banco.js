#!/usr/bin/env node

/**
 * Script para verificar se lead FLIP-20251109-0022 existe no banco
 * através da API do backend
 */

const https = require('https');

const BACKEND_URL = 'https://upbeat-dedication-production.up.railway.app';

console.log('🔍 VERIFICANDO LEAD NO BANCO DE DADOS');
console.log('=====================================\n');

// Função para fazer request HTTPS
function httpsRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: data, headers: res.headers });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function main() {
  try {
    // 1. Testar health check
    console.log('1️⃣ Testando backend...');
    const healthUrl = new URL('/api/health', BACKEND_URL);
    const healthResponse = await httpsRequest(healthUrl);
    
    if (healthResponse.status === 200) {
      console.log('   ✅ Backend está ONLINE');
      console.log('   📊 Uptime:', healthResponse.data.uptime, 'segundos\n');
    } else {
      console.log('   ❌ Backend com problema (Status:', healthResponse.status, ')\n');
    }
    
    // 2. Tentar fazer login como admin para conseguir token
    console.log('2️⃣ Tentando fazer login...');
    console.log('   ℹ️  Usando credenciais padrão (super_admin)\n');
    
    const loginUrl = new URL('/api/auth/login', BACKEND_URL);
    const loginResponse = await httpsRequest(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@flipcars.us',
        password: 'Password123!',
      }),
    });
    
    if (loginResponse.status === 200 || loginResponse.status === 201) {
      console.log('   ✅ Login realizado com sucesso');
      const accessToken = loginResponse.data.accessToken;
      console.log('   🔑 Token obtido\n');
      
      // 3. Buscar todos os leads para ver se existe
      console.log('3️⃣ Buscando leads no banco...');
      const leadsUrl = new URL('/api/leads?page=1&limit=50', BACKEND_URL);
      const leadsResponse = await httpsRequest(leadsUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (leadsResponse.status === 200) {
        const leads = leadsResponse.data.data || leadsResponse.data;
        console.log(`   ✅ Encontrados ${leads.length} leads no banco\n`);
        
        // 4. Procurar pelo lead específico
        console.log('4️⃣ Procurando por FLIP-20251109-0022...');
        const targetLead = leads.find(lead => 
          lead.referenceNumber === 'FLIP-20251109-0022'
        );
        
        if (targetLead) {
          console.log('   ✅ LEAD ENCONTRADO NO BANCO!\n');
          console.log('   📋 Detalhes:');
          console.log('   - ID:', targetLead.id);
          console.log('   - Reference:', targetLead.referenceNumber);
          console.log('   - Nome:', targetLead.name);
          console.log('   - Email:', targetLead.email);
          console.log('   - Telefone:', targetLead.phone);
          console.log('   - Status:', targetLead.status);
          console.log('   - Veículo:', targetLead.vehicleMake, targetLead.vehicleModel, targetLead.vehicleYear);
          console.log('   - Criado:', targetLead.createdAt);
          
          if (targetLead.damagePhotos && targetLead.damagePhotos.length > 0) {
            console.log('   - Fotos:', targetLead.damagePhotos.length, 'anexadas');
          }
        } else {
          console.log('   ❌ Lead FLIP-20251109-0022 NÃO encontrado no banco\n');
          console.log('   📋 Leads encontrados (últimos 10):');
          leads.slice(0, 10).forEach(lead => {
            console.log(`   - ${lead.referenceNumber} | ${lead.name} | ${lead.createdAt}`);
          });
        }
        
      } else {
        console.log('   ❌ Erro ao buscar leads (Status:', leadsResponse.status, ')');
        console.log('   Resposta:', JSON.stringify(leadsResponse.data, null, 2));
      }
      
    } else {
      console.log('   ❌ Erro ao fazer login (Status:', loginResponse.status, ')');
      console.log('   Resposta:', JSON.stringify(loginResponse.data, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Erro durante verificação:', error.message);
  }
  
  console.log('\n=====================================');
}

main();
