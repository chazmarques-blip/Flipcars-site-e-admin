import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USERNAME || 'flipcars',
  password: process.env.DATABASE_PASSWORD || 'flipcars123',
  database: process.env.DATABASE_NAME || 'flipcars_dev',
  entities: [join(__dirname, 'entities', '*.entity{.ts,.js}')],
  migrations: [join(__dirname, 'migrations', '*{.ts,.js}')],
  synchronize: false, // Never use synchronize in production
  logging: process.env.DATABASE_LOGGING === 'true',
  subscribers: [],
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
