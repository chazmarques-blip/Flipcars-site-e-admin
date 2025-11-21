import { getDataSource } from '../database/data-source';

async function checkLeads() {
  console.log('🔍 Checking leads in database...\n');
  
  const dataSource = await getDataSource();
  
  try {
    await dataSource.initialize();
    console.log('✅ Connected to database\n');
    
    const totalLeads = await dataSource.query('SELECT COUNT(*) as count FROM leads');
    console.log('📊 Total leads:', totalLeads[0].count);
    
    const allLeads = await dataSource.query(`
      SELECT id, "referenceNumber", name, email, phone, status, "createdAt"
      FROM leads ORDER BY "createdAt" DESC LIMIT 10
    `);
    
    console.log('\n📝 Recent leads:');
    allLeads.forEach((lead: any, idx: number) => {
      console.log(`${idx + 1}. ${lead.referenceNumber} - ${lead.name} (${lead.status})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await dataSource.destroy();
  }
}

checkLeads();
