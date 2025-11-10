#!/usr/bin/env node

/**
 * Test specific lead ID from URL
 * Lead ID: 4d4cd75-84aa-414d-b9a6-495ec54964a7
 */

const axios = require('axios');

const API_URL = 'https://upbeat-dedication-production.up.railway.app/api';
const LEAD_ID = '4d4cd75-84aa-414d-b9a6-495ec54964a7';

async function testSpecificLead() {
  console.log('🔍 TESTANDO LEAD ESPECÍFICO DA URL');
  console.log('=====================================\n');
  
  try {
    // 1. Login
    console.log('1️⃣ Fazendo login...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@flipcars.com',
      password: 'Admin@2024'
    });
    
    const { accessToken } = loginResponse.data;
    console.log('   ✅ Login OK\n');
    
    // 2. Test specific lead by ID
    console.log(`2️⃣ Testando lead específico: ${LEAD_ID}`);
    
    try {
      const leadResponse = await axios.get(`${API_URL}/leads/${LEAD_ID}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      console.log('   ✅ Lead encontrado!');
      console.log('   Status:', leadResponse.status);
      console.log('\n📋 DADOS DO LEAD:');
      console.log('   ID:', leadResponse.data.id);
      console.log('   Reference:', leadResponse.data.referenceNumber);
      console.log('   Name:', leadResponse.data.name || leadResponse.data.firstName + ' ' + leadResponse.data.lastName);
      console.log('   Email:', leadResponse.data.email);
      console.log('   Status:', leadResponse.data.status);
      console.log('   Created:', leadResponse.data.createdAt);
      
    } catch (leadError) {
      console.log('   ❌ Lead NÃO encontrado');
      console.log('   Status:', leadError.response?.status);
      console.log('   Erro:', leadError.response?.data?.message || leadError.message);
      
      // Try to get all leads to see what IDs exist
      console.log('\n3️⃣ Buscando todos os leads para verificar IDs disponíveis...');
      const allLeads = await axios.get(`${API_URL}/leads`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      console.log(`   ✅ Total de leads no banco: ${allLeads.data.data.length}`);
      console.log('\n📋 IDs VÁLIDOS NO BANCO:');
      allLeads.data.data.forEach((lead, index) => {
        console.log(`   ${index + 1}. ID: ${lead.id}`);
        console.log(`      Ref: ${lead.referenceNumber}`);
        console.log(`      Name: ${lead.name || (lead.firstName + ' ' + lead.lastName)}`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('❌ ERRO:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testSpecificLead();
