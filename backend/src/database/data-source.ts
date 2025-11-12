// IMPORTANT: Force IPv4 DNS resolution FIRST - before any other imports
// This MUST be the first import to patch DNS before database connections
import { initializeIPv4Enforcement } from '../utils/force-ipv4';
import * as dns from 'dns';
import { promisify } from 'util';

// Initialize IPv4 enforcement (safe to call multiple times)
initializeIPv4Enforcement();

import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

// Promisified DNS lookup with IPv4 forcing
const dnsLookup = promisify(dns.lookup);

// Load environment variables
config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

/**
 * Resolve hostname to IPv4 address manually
 * This ensures we ALWAYS connect via IPv4, bypassing any IPv6 attempts
 */
async function resolveHostnameToIPv4(hostname: string): Promise<string> {
  try {
    console.log(`🔍 [IPv4 Resolver] Resolving hostname: ${hostname}`);
    
    // Force IPv4 lookup (family: 4)
    const result = await dnsLookup(hostname, { family: 4 });
    const ipv4Address = typeof result === 'string' ? result : result.address;
    
    console.log(`✅ [IPv4 Resolver] Resolved ${hostname} → ${ipv4Address}`);
    return ipv4Address;
  } catch (error) {
    console.error(`❌ [IPv4 Resolver] Failed to resolve ${hostname}:`, error);
    throw error;
  }
}

/**
 * Parse DATABASE_URL and replace hostname with IPv4 address
 */
async function replaceHostnameWithIPv4(databaseUrl: string): Promise<string> {
  try {
    const url = new URL(databaseUrl);
    const originalHostname = url.hostname;
    
    // If already an IP address, return as-is
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(originalHostname)) {
      console.log(`✅ [IPv4 Resolver] Already IPv4 address: ${originalHostname}`);
      return databaseUrl;
    }
    
    // Resolve hostname to IPv4
    const ipv4Address = await resolveHostnameToIPv4(originalHostname);
    
    // Replace hostname with IPv4 address
    url.hostname = ipv4Address;
    const newUrl = url.toString();
    
    console.log(`🔄 [IPv4 Resolver] Replaced hostname in DATABASE_URL`);
    console.log(`   Original: ${originalHostname}`);
    console.log(`   IPv4: ${ipv4Address}`);
    
    return newUrl;
  } catch (error) {
    console.error(`❌ [IPv4 Resolver] Failed to parse DATABASE_URL:`, error);
    // Return original URL as fallback
    return databaseUrl;
  }
}

/**
 * Build database configuration
 * DNS IPv4 enforcement + manual hostname resolution for Railway compatibility
 */
const buildDatabaseConfig = async (): Promise<DataSourceOptions> => {
  const baseConfig = {
    type: 'postgres' as const,
    entities: [join(__dirname, 'entities', '*.entity{.ts,.js}')],
    migrations: [join(__dirname, 'migrations', '*{.ts,.js}')],
    synchronize: false, // Never use synchronize in production
    logging: process.env.DATABASE_LOGGING === 'true',
    subscribers: [],
  };

  // If DATABASE_URL is provided (Railway/production), use it
  if (process.env.DATABASE_URL) {
    console.log('\n========================================');
    console.log('🔍 Using DATABASE_URL for connection');
    console.log('========================================');
    
    // CRITICAL: Replace hostname with IPv4 address to force IPv4 connection
    const ipv4DatabaseUrl = await replaceHostnameWithIPv4(process.env.DATABASE_URL);
    
    return {
      ...baseConfig,
      url: ipv4DatabaseUrl, // Use IPv4-resolved URL
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      extra: {
        // Connection timeout configurations
        connectionTimeoutMillis: 30000,
        query_timeout: 30000,
        statement_timeout: 30000,
        idle_in_transaction_session_timeout: 30000,
      },
    };
  }

  // Otherwise, use individual variables (local development)
  console.log('🔍 Using individual environment variables for connection...');
  
  return {
    ...baseConfig,
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USERNAME || 'flipcars',
    password: process.env.DATABASE_PASSWORD || 'flipcars123',
    database: process.env.DATABASE_NAME || 'flipcars_dev',
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  };
};

// Build config asynchronously (requires hostname resolution)
let dataSourceOptionsPromise: Promise<DataSourceOptions> | null = null;
let dataSourceInstance: DataSource | null = null;

/**
 * Get or create data source options (cached)
 */
export async function getDataSourceOptions(): Promise<DataSourceOptions> {
  if (!dataSourceOptionsPromise) {
    dataSourceOptionsPromise = buildDatabaseConfig();
  }
  return dataSourceOptionsPromise;
}

/**
 * Get or create data source instance (singleton)
 */
export async function getDataSource(): Promise<DataSource> {
  if (!dataSourceInstance) {
    const options = await getDataSourceOptions();
    dataSourceInstance = new DataSource(options);
  }
  return dataSourceInstance;
}

// For backward compatibility: export synchronous placeholder
// (actual initialization happens asynchronously via getDataSource())
export const dataSourceOptions = buildDatabaseConfig();
const dataSource = new DataSource({
  type: 'postgres',
  // Placeholder - will be replaced by getDataSource()
} as any);

export default dataSource;
