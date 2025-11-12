#!/usr/bin/env node

/**
 * Teste de visualização de lead no Admin Panel
 * Simula login + busca de leads
 */

const axios = require('axios');

const ADMIN_API_URL = 'https://upbeat-dedication-production.up.railway.app/api';
const ADMIN_EMAIL = 'admin@flipcars.com';
const ADMIN_PASSWORD = 'Admin123!';

async function testarAdminPanel() {
  console.log('\n========================================');
  console.log('🔐 TESTE DE ADMIN PANEL');
  console.log('========================================\n');

  try {
    // 1. Login
    console.log('1️⃣ Fazendo login como admin...');
    const loginResponse = await axios.post(`${ADMIN_API_URL}/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });

    // Response format: { user: {...}, tokens: { accessToken, refreshToken } }
    const { user, tokens } = loginResponse.data;
    
    if (!user || !tokens) {
      throw new Error(`Login falhou: ${JSON.stringify(loginResponse.data)}`);
    }

    const { accessToken } = tokens;
    console.log('✅ Login bem-sucedido!');
    console.log(`   Token: ${accessToken.substring(0, 20)}...`);

    // 2. Buscar leads
    console.log('\n2️⃣ Buscando leads via API...');
    const leadsResponse = await axios.get(`${ADMIN_API_URL}/leads`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log('   Response status:', leadsResponse.status);
    console.log('   Response data:', JSON.stringify(leadsResponse.data, null, 2));
    
    const leads = Array.isArray(leadsResponse.data) ? leadsResponse.data : 
                  leadsResponse.data.data ? leadsResponse.data.data :
                  leadsResponse.data.leads ? leadsResponse.data.leads : [];
    
    console.log(`✅ API retornou: ${leads.length} lead(s)`);

    // 3. Exibir leads
    if (leads.length > 0) {
      console.log('\n========================================');
      console.log('📋 LEADS VISÍVEIS NO ADMIN');
      console.log('========================================\n');

      leads.forEach((lead, index) => {
        console.log(`\n🔹 Lead #${index + 1}`);
        console.log(`   ID: ${lead.id}`);
        console.log(`   Reference: ${lead.referenceNumber || lead.reference_number || 'N/A'}`);
        console.log(`   Nome: ${lead.name}`);
        console.log(`   Email: ${lead.email}`);
        console.log(`   Telefone: ${lead.phone}`);
        console.log(`   Status: ${lead.status}`);
        console.log(`   Veículo: ${lead.vehicleYear || lead.vehicle_year} ${lead.vehicleMake || lead.vehicle_make} ${lead.vehicleModel || lead.vehicle_model}`);
        
        if (lead.damagePhotos || lead.damage_photos) {
          const photos = lead.damagePhotos || lead.damage_photos;
          const photoCount = Array.isArray(photos) ? photos.length : 
                           typeof photos === 'object' ? Object.keys(photos).filter(k => photos[k]).length : 0;
          console.log(`   📸 Fotos: ${photoCount}`);
        }
      });

      console.log('\n========================================');
      console.log('✅ TESTE CONCLUÍDO COM SUCESSO!');
      console.log('========================================\n');
      console.log('Para ver no navegador:');
      console.log('1. Acesse: https://admin.flipcars.us/auth/login');
      console.log('2. Login: admin@flipcars.com / Admin123!');
      console.log('3. Vá para: Dashboard ou Leads');
      console.log(`4. Encontre: ${leads[0].name} (${leads[0].referenceNumber || leads[0].reference_number})`);
      
    } else {
      console.log('\n⚠️  Nenhum lead visível via API do admin');
      console.log('Possíveis razões:');
      console.log('1. Relations comentadas no código');
      console.log('2. Filtros aplicados na query');
      console.log('3. Permissões de acesso');
    }

  } catch (error) {
    console.error('\n❌ ERRO NO TESTE:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    process.exit(1);
  }
}

testarAdminPanel();
