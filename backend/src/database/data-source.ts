import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

// Build database configuration
// In production (Railway), use DATABASE_URL
// In development, use individual variables
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
    return {
      ...baseConfig,
      url: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    };
  }

  // Otherwise, use individual variables (local development)
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

export const dataSourceOptions: DataSourceOptions = buildDatabaseConfig();

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
