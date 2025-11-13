const { DataSource } = require('typeorm');

const AppDataSource = new DataSource({
  type: 'postgres',
  url: 'postgresql://postgres:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2anZpZWVra3VkZXF0bnVucWxiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTc1MTY0OSwiZXhwIjoyMDc3MzI3NjQ5fQ.HdU2WH0JS-oNam1nkHvax6JQC3221VkFXpY1Ejz2x04@db.kvjvieekkudeqtnunqlb.supabase.co:5432/postgres',
  entities: [],
  synchronize: false,
  logging: true,
});

async function testQuery() {
  try {
    console.log('🔄 Conectando ao banco...');
    await AppDataSource.initialize();
    
    console.log('✅ Conectado! Testando query...');
    const result = await AppDataSource.query('SELECT * FROM leads LIMIT 1');
    
    console.log('✅ Query executada com sucesso!');
    console.log('📊 Resultado:', JSON.stringify(result, null, 2));
    
    await AppDataSource.destroy();
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error('Stack:', error.stack);
  }
}

testQuery();
