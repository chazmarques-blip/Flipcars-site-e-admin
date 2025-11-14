/**
 * Script de Debug para Encontrar Lead FL-2025-4645
 * 
 * Como usar:
 * 1. Abra o Admin Dashboard: https://admin.flipcars.us/dashboard
 * 2. Abra o DevTools (F12)
 * 3. Vá para a aba Console
 * 4. Copie e cole este script inteiro
 * 5. Pressione Enter
 * 6. Aguarde os resultados
 */

console.log('🔍 ========== DEBUG: PROCURANDO LEAD FL-2025-4645 ==========');
console.log('');

// Função para buscar o token de autenticação
function getAuthToken() {
  // Tenta diferentes keys possíveis
  const possibleKeys = [
    'flipcars-auth-token',
    'auth-token',
    'token',
    'accessToken',
    'jwt-token',
  ];
  
  for (const key of possibleKeys) {
    const token = localStorage.getItem(key);
    if (token) {
      console.log(`✅ Token encontrado na key: "${key}"`);
      return token;
    }
  }
  
  console.error('❌ Token de autenticação NÃO encontrado!');
  console.log('📝 Keys disponíveis no localStorage:');
  for (let i = 0; i < localStorage.length; i++) {
    console.log(`   - ${localStorage.key(i)}`);
  }
  return null;
}

// Passo 1: Verificar token
console.log('📋 PASSO 1: Verificando autenticação...');
const token = getAuthToken();
if (!token) {
  console.error('❌ ERRO: Faça login novamente!');
  console.log('');
  console.log('🔧 SOLUÇÃO:');
  console.log('1. Faça logout do admin');
  console.log('2. Faça login novamente');
  console.log('3. Execute este script novamente');
  throw new Error('Token não encontrado');
}
console.log('');

// Passo 2: Determinar URL da API
console.log('📋 PASSO 2: Determinando URL da API...');
const apiUrl = window.location.hostname.includes('localhost')
  ? 'http://localhost:3001'
  : 'https://flipcars-backend-production.up.railway.app';
console.log(`📍 API URL: ${apiUrl}`);
console.log('');

// Passo 3: Buscar todos os leads
console.log('📋 PASSO 3: Buscando todos os leads...');
fetch(`${apiUrl}/leads?page=1&limit=100`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
})
.then(response => {
  console.log(`📡 Status da resposta: ${response.status} ${response.statusText}`);
  
  if (response.status === 401) {
    console.error('❌ ERRO 401: Token expirado ou inválido!');
    console.log('');
    console.log('🔧 SOLUÇÃO:');
    console.log('1. Faça logout do admin');
    console.log('2. Faça login novamente');
    console.log('3. Execute este script novamente');
    throw new Error('Unauthorized');
  }
  
  if (response.status === 404) {
    console.error('❌ ERRO 404: Rota não encontrada!');
    console.log('');
    console.log('🔧 SOLUÇÃO:');
    console.log(`Verifique se o backend está rodando em: ${apiUrl}`);
    throw new Error('Not Found');
  }
  
  if (!response.ok) {
    console.error(`❌ ERRO ${response.status}: ${response.statusText}`);
    throw new Error(`HTTP ${response.status}`);
  }
  
  return response.json();
})
.then(data => {
  console.log('✅ Resposta recebida!');
  console.log('');
  
  console.log('📊 ESTATÍSTICAS:');
  console.log(`   Total de leads: ${data.meta?.total || data.data?.length || 0}`);
  console.log(`   Página atual: ${data.meta?.currentPage || 1}`);
  console.log(`   Total de páginas: ${data.meta?.totalPages || 1}`);
  console.log(`   Leads nesta página: ${data.data?.length || 0}`);
  console.log('');
  
  // Buscar o lead específico
  console.log('🔍 PROCURANDO LEAD FL-2025-4645...');
  const leads = data.data || [];
  
  // Tentar encontrar por referência completa
  let targetLead = leads.find(l => 
    l.referenceNumber === 'FL-2025-4645' ||
    l.referenceNumber?.includes('4645')
  );
  
  // Tentar encontrar por nome
  if (!targetLead) {
    targetLead = leads.find(l => 
      l.name?.toLowerCase().includes('juan') ||
      l.name?.toLowerCase().includes('felipe')
    );
  }
  
  // Tentar encontrar por email
  if (!targetLead) {
    targetLead = leads.find(l => 
      l.email?.toLowerCase().includes('jufeliecn')
    );
  }
  
  if (targetLead) {
    console.log('✅ ✅ ✅ LEAD ENCONTRADO! ✅ ✅ ✅');
    console.log('');
    console.log('📄 DADOS DO LEAD:');
    console.log(JSON.stringify(targetLead, null, 2));
    console.log('');
    console.log('🎯 RESUMO:');
    console.log(`   ID: ${targetLead.id}`);
    console.log(`   Referência: ${targetLead.referenceNumber}`);
    console.log(`   Nome: ${targetLead.name}`);
    console.log(`   Email: ${targetLead.email}`);
    console.log(`   Telefone: ${targetLead.phone}`);
    console.log(`   Status: ${targetLead.status}`);
    console.log(`   Criado em: ${targetLead.createdAt}`);
    console.log(`   Veículo: ${targetLead.vehicleYear || ''} ${targetLead.vehicleMake || ''} ${targetLead.vehicleModel || ''}`);
    console.log('');
    console.log('✅ CONCLUSÃO: O lead EXISTE no banco de dados!');
    console.log('❓ Mas por que não aparece no dashboard?');
    console.log('');
    console.log('🔍 POSSÍVEIS CAUSAS:');
    console.log('1. Ordenação: Lead pode estar após a posição 5 (Recent Leads mostra apenas 5)');
    console.log('2. Filtros: Algum filtro pode estar escondendo o lead');
    console.log('3. Cache: Dashboard pode estar usando dados em cache');
    console.log('');
    console.log('🔧 SOLUÇÃO: Vá para a página "Leads" (menu lateral) para ver TODOS os leads');
    
  } else {
    console.error('❌ ❌ ❌ LEAD NÃO ENCONTRADO! ❌ ❌ ❌');
    console.log('');
    console.log('📋 Leads disponíveis:');
    leads.forEach((lead, index) => {
      console.log(`   ${index + 1}. ${lead.name} - ${lead.referenceNumber} - ${lead.createdAt}`);
    });
    console.log('');
    console.log('🔍 CAUSAS POSSÍVEIS:');
    console.log('1. Lead foi criado em outro ambiente (dev vs prod)');
    console.log('2. Lead não foi salvo no banco de dados');
    console.log('3. Formulário público está apontando para backend diferente');
    console.log('4. Lead foi criado mas depois deletado');
    console.log('');
    console.log('🔧 PRÓXIMOS PASSOS:');
    console.log('1. Verificar logs do backend durante a criação do lead');
    console.log('2. Verificar variável NEXT_PUBLIC_API_URL no frontend-public');
    console.log('3. Tentar criar outro lead de teste');
  }
  console.log('');
  console.log('========== FIM DO DEBUG ==========');
})
.catch(error => {
  console.error('❌ ❌ ❌ ERRO DURANTE A BUSCA! ❌ ❌ ❌');
  console.error('');
  console.error('📋 Detalhes do erro:');
  console.error(error);
  console.error('');
  console.error('🔧 SOLUÇÕES:');
  console.error('1. Verifique se o backend está rodando');
  console.error('2. Verifique se o token de autenticação é válido');
  console.error('3. Verifique a URL da API');
  console.error('4. Tente fazer logout/login novamente');
});
