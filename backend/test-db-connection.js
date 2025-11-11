#!/usr/bin/env node
/**
 * Test Database Connection Script
 * Tests IPv4 connectivity to Supabase before deployment
 */

const { Client } = require('pg');
const dns = require('dns');

// Configure DNS to prefer IPv4
dns.setDefaultResultOrder('ipv4first');

/**
 * Patch DNS lookup to force IPv4
 */
function patchDNSLookup() {
  const originalLookup = dns.lookup;

  dns.lookup = (hostname, optionsOrCallback, callback) => {
    let options = {};
    let actualCallback;

    if (typeof optionsOrCallback === 'function') {
      actualCallback = optionsOrCallback;
    } else {
      options = optionsOrCallback || {};
      actualCallback = callback;
    }

    // Force IPv4
    options = {
      ...options,
      family: 4,
    };

    console.log(`🔍 [DNS Patch] Forcing IPv4 lookup for: ${hostname}`);

    return originalLookup(hostname, options, (err, address, family) => {
      if (err) {
        console.error(`❌ [DNS Patch] Failed: ${err.message}`);
      } else {
        console.log(`✅ [DNS Patch] Resolved to IPv4: ${address}`);
      }
      actualCallback(err, address, family);
    });
  };

  console.log('✅ DNS lookup patched to force IPv4\n');
}

// Apply patch immediately
patchDNSLookup();

/**
 * Test database connection
 */
async function testConnection() {
  console.log('\n========================================');
  console.log('🧪 Testing Database Connection');
  console.log('========================================\n');

  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  console.log('🔍 DATABASE_URL found (showing first 50 chars):', databaseUrl.substring(0, 50) + '...\n');

  // Test connection (DNS patch will force IPv4)
  console.log('🔌 Attempting database connection...');
  console.log('   (DNS patch active - will force IPv4 resolution)\n');
  
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    await client.connect();
    console.log('✅ Database connection successful!\n');
    
    // Test query
    console.log('🔍 Testing simple query...');
    const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
    console.log('✅ Query successful!');
    console.log('   Server time:', result.rows[0].current_time);
    console.log('   PostgreSQL:', result.rows[0].pg_version.split(' ')[0], result.rows[0].pg_version.split(' ')[1]);
    
    await client.end();
    
    console.log('\n========================================');
    console.log('✅ Connection Test PASSED');
    console.log('========================================\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Connection Test FAILED');
    console.error('Error details:', error.message);
    
    if (error.message.includes('ENETUNREACH')) {
      console.error('\n💡 Diagnosis: IPv6 connection issue detected!');
      console.error('   The database is trying to connect via IPv6 which is not supported.');
      console.error('\n🔧 Solutions:');
      console.error('   1. Use IPv4 address directly in DATABASE_URL');
      console.error('   2. Add NODE_OPTIONS=--dns-result-order=ipv4first');
      console.error('   3. Check Railway network settings');
    }
    
    await client.end();
    
    console.log('\n========================================\n');
    process.exit(1);
  }
}

// Run test
testConnection().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
