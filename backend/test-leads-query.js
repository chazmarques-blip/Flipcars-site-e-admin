const { DataSource } = require('typeorm');

async function testLeadsQuery() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'aws-0-us-east-1.pooler.supabase.com',
    port: parseInt(process.env.DATABASE_PORT) || 6543,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await dataSource.initialize();
    console.log('✅ Database connected');

    // Test 1: Count leads
    const countResult = await dataSource.query('SELECT COUNT(*) as total FROM leads');
    console.log('Total leads:', countResult[0].total);

    // Test 2: Select with new columns
    const leads = await dataSource.query(`
      SELECT 
        id, 
        name, 
        email, 
        phone, 
        status,
        preferred_date,
        preferred_time_slot,
        created_at
      FROM leads
      ORDER BY created_at DESC
      LIMIT 5
    `);
    console.log('Sample leads:', JSON.stringify(leads, null, 2));

    await dataSource.destroy();
    console.log('✅ Test completed successfully');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

testLeadsQuery();
