/**
 * TESTE DE DEBUG DO DASHBOARD
 * 
 * Como usar:
 * 1. Abrir dashboard admin (https://admin.flipcars.us/)
 * 2. Abrir DevTools (F12)
 * 3. Ir na aba Console
 * 4. Copiar e colar TODO este código
 * 5. Pressionar Enter
 * 6. Ver resultado no console
 */

(async function testDashboard() {
  console.log('🔍 ========== TESTE DE DEBUG DO DASHBOARD ==========');
  console.log('');
  
  // 1. Verificar token
  console.log('📋 1. VERIFICANDO TOKEN JWT...');
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('❌ ERRO: Nenhum token encontrado!');
    console.error('➡️ SOLUÇÃO: Fazer LOGIN novamente');
    return;
  }
  console.log('✅ Token encontrado:', token.substring(0, 50) + '...');
  console.log('');
  
  // 2. Testar API health
  console.log('🏥 2. TESTANDO API HEALTH...');
  try {
    const healthResponse = await fetch('https://upbeat-dedication-production.up.railway.app/api/health');
    const healthData = await healthResponse.json();
    console.log('✅ API Health:', healthData);
  } catch (error) {
    console.error('❌ Erro ao testar health:', error);
  }
  console.log('');
  
  // 3. Testar endpoint de leads
  console.log('📊 3. TESTANDO ENDPOINT DE LEADS...');
  try {
    const leadsResponse = await fetch('https://upbeat-dedication-production.up.railway.app/api/leads', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status Code:', leadsResponse.status);
    
    if (leadsResponse.status === 401) {
      console.error('❌ ERRO 401: Token inválido ou expirado');
      console.error('➡️ SOLUÇÃO: Fazer LOGOUT e LOGIN novamente');
      console.error('');
      
      // Tentar ver quando o token expira
      try {
        const tokenParts = token.split('.');
        const payload = JSON.parse(atob(tokenParts[1]));
        const exp = new Date(payload.exp * 1000);
        console.log('📅 Token expira em:', exp.toLocaleString());
        console.log('⏰ Agora:', new Date().toLocaleString());
        console.log('');
      } catch (e) {
        console.log('Não foi possível decodificar token');
      }
      
      return;
    }
    
    if (leadsResponse.status === 403) {
      console.error('❌ ERRO 403: Sem permissão');
      console.error('➡️ SOLUÇÃO: Verificar role do usuário no banco');
      return;
    }
    
    if (leadsResponse.status === 500) {
      console.error('❌ ERRO 500: Erro no servidor');
      const errorData = await leadsResponse.text();
      console.error('Resposta:', errorData);
      console.error('➡️ SOLUÇÃO: Ver logs do Railway');
      return;
    }
    
    if (leadsResponse.status === 200) {
      const leadsData = await leadsResponse.json();
      console.log('✅ Leads Response:', leadsData);
      console.log('');
      
      if (leadsData.data && leadsData.data.length > 0) {
        console.log('🎉 LEADS ENCONTRADOS:', leadsData.data.length);
        console.log('');
        console.log('📋 Primeiros 3 leads:');
        leadsData.data.slice(0, 3).forEach((lead, index) => {
          console.log(`\n${index + 1}. ${lead.name}`);
          console.log(`   Reference: ${lead.referenceNumber}`);
          console.log(`   Email: ${lead.email}`);
          console.log(`   Created: ${new Date(lead.createdAt).toLocaleString()}`);
        });
      } else {
        console.warn('⚠️ ATENÇÃO: API retornou sucesso mas 0 leads!');
        console.log('');
        console.log('Possíveis causas:');
        console.log('1. Realmente não há leads no banco');
        console.log('2. Filtros estão escondendo os leads');
        console.log('3. Problema na query SQL');
        console.log('');
        console.log('➡️ PRÓXIMO PASSO: Verificar banco de dados diretamente');
      }
    }
  } catch (error) {
    console.error('❌ Erro ao buscar leads:', error);
  }
  console.log('');
  
  // 4. Verificar localStorage
  console.log('💾 4. VERIFICANDO LOCALSTORAGE...');
  const mockLeads = localStorage.getItem('flipcars_completed_leads');
  if (mockLeads) {
    try {
      const leads = JSON.parse(mockLeads);
      console.log(`📦 ${leads.length} leads encontrados no localStorage`);
      if (leads.length > 0) {
        console.log('Último lead:');
        console.log(leads[leads.length - 1]);
      }
    } catch (e) {
      console.log('Erro ao parsear localStorage');
    }
  } else {
    console.log('Nenhum lead no localStorage');
  }
  console.log('');
  
  // 5. Resumo e recomendações
  console.log('📝 5. RESUMO E RECOMENDAÇÕES');
  console.log('');
  console.log('Se o erro foi 401:');
  console.log('  ➡️ Fazer LOGOUT e LOGIN novamente');
  console.log('');
  console.log('Se API retornou 200 mas 0 leads:');
  console.log('  ➡️ Verificar Supabase diretamente:');
  console.log('     SELECT COUNT(*) FROM leads;');
  console.log('');
  console.log('Se API retornou 500:');
  console.log('  ➡️ Ver logs do Railway');
  console.log('  ➡️ Pode ser problema com migration');
  console.log('');
  
  console.log('🔍 ========== FIM DO TESTE ==========');
})();
