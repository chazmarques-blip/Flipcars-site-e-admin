#!/usr/bin/env node

/**
 * Script para verificar dados no banco de produção
 * Conecta ao Supabase e verifica:
 * - Total de leads
 * - Leads recentes (últimas 24h)
 * - Dados completos dos leads
 * - Fotos anexadas
 */

const { createClient } = require('@supabase/supabase-js');

// Credenciais do Supabase (de /home/user/webapp/backend/.env)
const SUPABASE_URL = 'https://kvjvieekkudeqtnunqlb.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2anZpZWVra3VkZXF0bnVucWxiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTc1MTY0OSwiZXhwIjoyMDc3MzI3NjQ5fQ.HdU6WH0JS-oNam1nkHvax6JQC3221VkFXpY1Ejz2x04';

async function verificarDados() {
  console.log('\n========================================');
  console.log('🔍 VERIFICAÇÃO DE DADOS NO BANCO');
  console.log('========================================\n');

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    // 1. Contar total de leads
    console.log('1️⃣ Contando total de leads...');
    const { count: totalLeads, error: countError } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Erro ao contar leads:', countError.message);
      throw countError;
    }

    console.log(`✅ Total de leads no banco: ${totalLeads}`);

    // 2. Buscar leads recentes (últimas 24 horas)
    console.log('\n2️⃣ Buscando leads das últimas 24 horas...');
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    const { data: recentLeads, error: recentError } = await supabase
      .from('leads')
      .select('*')
      .gte('created_at', oneDayAgo)
      .order('created_at', { ascending: false });

    if (recentError) {
      console.error('❌ Erro ao buscar leads recentes:', recentError.message);
      throw recentError;
    }

    console.log(`✅ Leads criados nas últimas 24h: ${recentLeads.length}`);

    // 3. Buscar TODOS os leads (se houver)
    console.log('\n3️⃣ Buscando todos os leads...');
    const { data: allLeads, error: allError } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10); // Últimos 10

    if (allError) {
      console.error('❌ Erro ao buscar todos os leads:', allError.message);
      throw allError;
    }

    console.log(`✅ Encontrados: ${allLeads.length} leads (mostrando até 10 mais recentes)`);

    // 4. Exibir detalhes dos leads
    if (allLeads.length > 0) {
      console.log('\n========================================');
      console.log('📋 DETALHES DOS LEADS');
      console.log('========================================\n');

      allLeads.forEach((lead, index) => {
        console.log(`\n🔹 Lead #${index + 1}`);
        console.log(`   ID: ${lead.id}`);
        console.log(`   Reference: ${lead.reference_number || 'N/A'}`);
        console.log(`   Nome: ${lead.name}`);
        console.log(`   Email: ${lead.email}`);
        console.log(`   Telefone: ${lead.phone}`);
        console.log(`   Status: ${lead.status || 'new'}`);
        console.log(`   Criado: ${new Date(lead.created_at).toLocaleString('pt-BR')}`);
        
        // Veículo
        if (lead.vehicle_year || lead.vehicle_make || lead.vehicle_model) {
          console.log(`   Veículo: ${lead.vehicle_year} ${lead.vehicle_make} ${lead.vehicle_model}`);
        }
        
        // Fotos
        if (lead.damage_photos) {
          const photos = typeof lead.damage_photos === 'string' 
            ? JSON.parse(lead.damage_photos) 
            : lead.damage_photos;
          
          if (Array.isArray(photos)) {
            console.log(`   📸 Fotos: ${photos.length} anexadas`);
          } else if (typeof photos === 'object') {
            const photoKeys = Object.keys(photos).filter(k => photos[k]);
            console.log(`   📸 Fotos: ${photoKeys.length} anexadas`);
            if (photoKeys.length > 0) {
              console.log(`   Tipos: ${photoKeys.join(', ')}`);
            }
          }
        } else {
          console.log(`   📸 Fotos: Nenhuma`);
        }
        
        // Insurance
        if (lead.has_insurance) {
          console.log(`   🛡️  Seguro: ${lead.insurance_provider || 'Sim'}`);
          if (lead.claim_number) {
            console.log(`   Claim #: ${lead.claim_number}`);
          }
        }
        
        // AI Data
        if (lead.ai_qualification_score) {
          console.log(`   🤖 AI Score: ${lead.ai_qualification_score}`);
        }
      });
    } else {
      console.log('\n⚠️  NENHUM LEAD ENCONTRADO NO BANCO!');
      console.log('\nPossíveis razões:');
      console.log('1. Nenhum lead foi cadastrado ainda');
      console.log('2. Problema na API de criação de leads');
      console.log('3. Dados sendo salvos em tabela diferente');
    }

    // 5. Verificar estrutura da tabela
    console.log('\n========================================');
    console.log('🗂️  VERIFICANDO ESTRUTURA DA TABELA');
    console.log('========================================\n');

    const { data: columns, error: columnsError } = await supabase
      .from('leads')
      .select('*')
      .limit(1);

    if (!columnsError && columns && columns.length > 0) {
      const sampleLead = columns[0];
      const columnNames = Object.keys(sampleLead);
      console.log(`✅ Colunas disponíveis (${columnNames.length}):`);
      columnNames.sort().forEach(col => {
        const value = sampleLead[col];
        const type = typeof value;
        const preview = value === null ? 'null' : 
                       type === 'string' && value.length > 50 ? value.substring(0, 50) + '...' :
                       JSON.stringify(value);
        console.log(`   - ${col} (${type}): ${preview}`);
      });
    } else if (allLeads.length === 0) {
      console.log('⚠️  Não foi possível verificar estrutura (sem dados)');
    }

    // 6. Verificar bucket de fotos
    console.log('\n========================================');
    console.log('📸 VERIFICANDO STORAGE DE FOTOS');
    console.log('========================================\n');

    const { data: files, error: storageError } = await supabase
      .storage
      .from('lead-photos')
      .list('', { limit: 10, sortBy: { column: 'created_at', order: 'desc' } });

    if (storageError) {
      console.error('❌ Erro ao listar fotos:', storageError.message);
    } else {
      console.log(`✅ Fotos no storage: ${files.length} (mostrando até 10 mais recentes)`);
      
      if (files.length > 0) {
        console.log('\nÚltimas fotos carregadas:');
        files.forEach((file, index) => {
          const sizeKB = (file.metadata?.size / 1024).toFixed(2);
          const date = new Date(file.created_at).toLocaleString('pt-BR');
          console.log(`   ${index + 1}. ${file.name} (${sizeKB} KB) - ${date}`);
        });
      } else {
        console.log('⚠️  Nenhuma foto encontrada no storage');
      }
    }

    // 7. Resumo final
    console.log('\n========================================');
    console.log('📊 RESUMO FINAL');
    console.log('========================================\n');
    console.log(`Total de leads: ${totalLeads}`);
    console.log(`Leads (24h): ${recentLeads.length}`);
    console.log(`Fotos no storage: ${files ? files.length : 0}`);
    
    if (totalLeads === 0) {
      console.log('\n⚠️  ATENÇÃO: Banco está vazio!');
      console.log('\nPara testar criação de lead:');
      console.log('1. Acesse: https://www.flipcars.us');
      console.log('2. Clique em "Get Free Estimate"');
      console.log('3. Preencha o formulário');
      console.log('4. Execute este script novamente');
    } else {
      console.log('\n✅ Banco está funcionando corretamente!');
    }

  } catch (error) {
    console.error('\n❌ ERRO NA VERIFICAÇÃO:', error);
    process.exit(1);
  }
}

// Executar
verificarDados();
