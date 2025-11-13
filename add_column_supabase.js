const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://kvjvieekkudeqtnunqlb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2anZpZWVra3VkZXF0bnVucWxiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTc1MTY0OSwiZXhwIjoyMDc3MzI3NjQ5fQ.HdU6WH0JS-oNam1nkHvax6JQC3221VkFXpY1Ejz2x04';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addColumn() {
  console.log('🔄 Tentando adicionar coluna contact_preferences...');
  
  // Tentar via RPC (se existir uma função)
  const { data, error } = await supabase.rpc('exec_sql', {
    query: 'ALTER TABLE leads ADD COLUMN IF NOT EXISTS contact_preferences jsonb DEFAULT NULL'
  });
  
  if (error) {
    console.error('❌ Erro:', error);
    console.log('\n📋 Por favor, execute este SQL manualmente no Supabase Dashboard:');
    console.log('\nALTER TABLE leads ADD COLUMN IF NOT EXISTS contact_preferences jsonb DEFAULT NULL;\n');
  } else {
    console.log('✅ Coluna adicionada com sucesso!');
  }
}

addColumn();
