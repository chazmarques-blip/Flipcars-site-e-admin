// IMPORTANT: Force IPv4 DNS resolution FIRST - before any other imports
// This MUST be the first import to patch DNS before database connections
import { initializeIPv4Enforcement } from '../utils/force-ipv4';

// Initialize IPv4 enforcement (safe to call multiple times)
initializeIPv4Enforcement();

import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

/**
 * Build database configuration
 * DNS IPv4 enforcement is handled by force-ipv4.ts import
 */
const buildDatabaseConfig = (): DataSourceOptions => {
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
    console.log('🔍 Using DATABASE_URL for connection...');
    console.log('   (IPv4 enforcement active via DNS patch)');
    
    return {
      ...baseConfig,
      url: process.env.DATABASE_URL,
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

// Build config
export const dataSourceOptions: DataSourceOptions = buildDatabaseConfig();

// Create data source
const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
