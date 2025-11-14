/**
 * SCRIPT DE TESTE - API DE LEADS
 * 
 * Este script testa diretamente a API do backend para verificar
 * se os leads estão sendo retornados corretamente
 * 
 * Como executar:
 * 1. cd /home/user/webapp
 * 2. node test-api-leads.js
 */

const https = require('https');

const API_URL = 'upbeat-dedication-production.up.railway.app';
const API_PATH = '/api/leads?page=1&limit=100&sortBy=createdAt&sortOrder=DESC';

console.log('🔍 ========== TESTE DE API - LEADS ==========');
console.log('');
console.log('📍 API URL:', `https://${API_URL}${API_PATH}`);
console.log('');

// Função para fazer request HTTPS
function makeRequest() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: API_URL,
      path: API_PATH,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    };

    console.log('📡 Fazendo requisição...');
    console.log('');

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log(`✅ Status: ${res.statusCode} ${res.statusMessage}`);
        console.log('');

        if (res.statusCode === 200) {
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          } catch (error) {
            console.error('❌ Erro ao parsear JSON:', error.message);
            console.log('Raw data:', data.substring(0, 500));
            reject(error);
          }
        } else if (res.statusCode === 401) {
          console.error('❌ ERRO 401: Unauthorized');
          console.error('');
          console.error('🔧 SOLUÇÃO: Este endpoint requer autenticação JWT');
          console.error('   O teste não pode prosseguir sem token de autenticação');
          console.error('');
          console.error('💡 ALTERNATIVA: Use o teste via browser console com token');
          reject(new Error('Unauthorized'));
        } else {
          console.error(`❌ ERRO ${res.statusCode}: ${res.statusMessage}`);
          console.error('Response:', data.substring(0, 500));
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Erro de rede:', error.message);
      reject(error);
    });

    req.end();
  });
}

// Executar teste
makeRequest()
  .then((data) => {
    console.log('📊 DADOS RECEBIDOS:');
    console.log('');
    
    if (data.data && Array.isArray(data.data)) {
      const leads = data.data;
      const pagination = data.pagination || data.meta;
      
      console.log(`📈 Total de leads no banco: ${pagination?.total || leads.length}`);
      console.log(`📄 Leads nesta página: ${leads.length}`);
      console.log('');
      
      console.log('📋 LISTA DE LEADS (primeiros 10):');
      console.log('');
      
      leads.slice(0, 10).forEach((lead, index) => {
        console.log(`${index + 1}. ${lead.name || 'Sem nome'}`);
        console.log(`   Ref: ${lead.referenceNumber || lead.reference_number || 'N/A'}`);
        console.log(`   Email: ${lead.email || 'N/A'}`);
        console.log(`   Phone: ${lead.phone || 'N/A'}`);
        console.log(`   Vehicle: ${lead.vehicleYear || lead.vehicle_year || ''} ${lead.vehicleMake || lead.vehicle_make || ''} ${lead.vehicleModel || lead.vehicle_model || ''}`);
        console.log(`   Status: ${lead.status || 'N/A'}`);
        console.log(`   Created: ${lead.createdAt || lead.created_at || 'N/A'}`);
        console.log('');
      });
      
      console.log('🔍 PROCURANDO LEAD FL-2025-4645 (Juan Felipe)...');
      console.log('');
      
      // Buscar por referência
      const targetByRef = leads.find(l => 
        (l.referenceNumber || l.reference_number || '').includes('4645') ||
        (l.referenceNumber || l.reference_number || '').includes('FL-2025-4645')
      );
      
      // Buscar por nome
      const targetByName = leads.find(l => 
        (l.name || '').toLowerCase().includes('juan') ||
        (l.name || '').toLowerCase().includes('felipe')
      );
      
      // Buscar por email
      const targetByEmail = leads.find(l => 
        (l.email || '').toLowerCase().includes('jufeliecn')
      );
      
      const targetLead = targetByRef || targetByName || targetByEmail;
      
      if (targetLead) {
        console.log('✅✅✅ LEAD ENCONTRADO! ✅✅✅');
        console.log('');
        console.log('📄 DADOS COMPLETOS:');
        console.log(JSON.stringify(targetLead, null, 2));
        console.log('');
        console.log('🎯 RESUMO:');
        console.log(`   ID: ${targetLead.id}`);
        console.log(`   Referência: ${targetLead.referenceNumber || targetLead.reference_number}`);
        console.log(`   Nome: ${targetLead.name}`);
        console.log(`   Email: ${targetLead.email}`);
        console.log(`   Telefone: ${targetLead.phone}`);
        console.log(`   Status: ${targetLead.status}`);
        console.log(`   Priority: ${targetLead.priority}`);
        console.log(`   Criado em: ${targetLead.createdAt || targetLead.created_at}`);
        console.log('');
        
        // Calcular posição na lista
        const position = leads.findIndex(l => l.id === targetLead.id) + 1;
        console.log(`📍 POSIÇÃO NA LISTA: ${position} de ${leads.length}`);
        console.log('');
        
        if (position <= 5) {
          console.log('✅ Este lead DEVERIA aparecer em "Recent Leads" (top 5)');
        } else {
          console.log('⚠️  Este lead NÃO aparece em "Recent Leads" (mostra apenas top 5)');
          console.log(`   Posição: ${position} (fora do top 5)`);
          console.log('');
          console.log('💡 SOLUÇÃO:');
          console.log('   1. Vá para a página "Leads" completa (menu lateral)');
          console.log('   2. Ou use a busca para procurar "Juan" ou "4645"');
        }
        
      } else {
        console.error('❌❌❌ LEAD NÃO ENCONTRADO! ❌❌❌');
        console.log('');
        console.log('🔍 LEADS DISPONÍVEIS:');
        leads.forEach((lead, i) => {
          console.log(`   ${i+1}. ${lead.name} - ${lead.referenceNumber || lead.reference_number}`);
        });
        console.log('');
        console.log('⚠️  CAUSAS POSSÍVEIS:');
        console.log('   1. Lead foi criado em ambiente diferente (dev vs prod)');
        console.log('   2. Lead não foi salvo no banco de dados');
        console.log('   3. Formulário público usando backend diferente');
        console.log('   4. Lead foi deletado após criação');
      }
      
    } else {
      console.log('⚠️  Estrutura de dados inesperada:');
      console.log(JSON.stringify(data, null, 2));
    }
    
    console.log('');
    console.log('========== FIM DO TESTE ==========');
  })
  .catch((error) => {
    console.log('');
    console.log('========== TESTE FALHOU ==========');
    console.error('Erro:', error.message);
    console.log('');
    
    if (error.message.includes('Unauthorized')) {
      console.log('💡 COMO CONTORNAR:');
      console.log('');
      console.log('Execute este código no CONSOLE DO NAVEGADOR (F12) no admin dashboard:');
      console.log('');
      console.log('```javascript');
      console.log('// Buscar token');
      console.log('const token = localStorage.getItem("flipcars-auth-token") || ');
      console.log('              Object.keys(localStorage).find(k => k.includes("token"));');
      console.log('');
      console.log('// Fazer request com token');
      console.log('fetch("https://upbeat-dedication-production.up.railway.app/api/leads?page=1&limit=100", {');
      console.log('  headers: {');
      console.log('    "Authorization": `Bearer ${localStorage.getItem(token)}`,');
      console.log('    "Content-Type": "application/json"');
      console.log('  }');
      console.log('})');
      console.log('.then(r => r.json())');
      console.log('.then(data => {');
      console.log('  console.log("Total leads:", data.pagination?.total || data.data?.length);');
      console.log('  console.log("Leads:", data.data);');
      console.log('  ');
      console.log('  const target = data.data.find(l => ');
      console.log('    l.referenceNumber?.includes("4645") || ');
      console.log('    l.name?.toLowerCase().includes("juan")');
      console.log('  );');
      console.log('  ');
      console.log('  if (target) {');
      console.log('    console.log("✅ LEAD ENCONTRADO:", target);');
      console.log('  } else {');
      console.log('    console.log("❌ LEAD NÃO ENCONTRADO");');
      console.log('  }');
      console.log('});');
      console.log('```');
    }
  });
