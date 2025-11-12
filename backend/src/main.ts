// IMPORTANT: Import and initialize force-ipv4 FIRST to patch DNS before any connections
import { initializeIPv4Enforcement } from './utils/force-ipv4';

// Initialize IPv4 enforcement immediately
initializeIPv4Enforcement();

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { getDataSource } from './database/data-source';
import { runSeeds } from './database/seeds/run-seeds';

async function runMigrations() {
  console.log('\n========================================');
  console.log('📦 Running Database Migrations...');
  console.log('========================================\n');

  try {
    // Get data source with IPv4-resolved hostname
    const dataSource = await getDataSource();
    
    // Initialize the data source
    if (!dataSource.isInitialized) {
      console.log('🔌 Initializing database connection...');
      await dataSource.initialize();
      console.log('✅ Database connection established');
    }

    // Run pending migrations
    console.log('🔄 Checking for pending migrations...');
    const pendingMigrations = await dataSource.showMigrations();
    
    if (pendingMigrations) {
      console.log('⏳ Running pending migrations...');
      const migrations = await dataSource.runMigrations({ transaction: 'all' });
      
      if (migrations.length === 0) {
        console.log('✅ No pending migrations - database is up to date');
      } else {
        console.log(`✅ Successfully ran ${migrations.length} migration(s):`);
        migrations.forEach(migration => {
          console.log(`   - ${migration.name}`);
        });
      }
    } else {
      console.log('✅ No pending migrations - database is up to date');
    }

    console.log('\n========================================');
    console.log('✅ Migration Process Completed');
    console.log('========================================\n');

    return true;
  } catch (error) {
    console.error('\n❌ Migration Error:');
    console.error(error);
    console.error('\n⚠️  Continuing with application startup...\n');
    return false;
  } finally {
    // Close the connection after migrations
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

async function runDatabaseSeeds() {
  console.log('\n========================================');
  console.log('🌱 Running Database Seeds...');
  console.log('========================================\n');

  try {
    await runSeeds();
    
    console.log('\n========================================');
    console.log('✅ Seed Process Completed');
    console.log('========================================\n');

  } catch (error) {
    console.error('\n❌ Seed Error:');
    console.error(error);
    console.error('\n⚠️  Continuing with application startup...\n');
  }
}

async function bootstrap() {
  console.log('\n========================================');
  console.log('🚀 Starting FlipCars Backend Application');
  console.log('========================================\n');

  // ⚠️ MIGRATIONS AND SEEDS DISABLED IN PRODUCTION
  // Database is already seeded via Supabase SQL Editor
  // Migrations are run manually when needed to avoid startup delays
  // 
  // To run migrations manually:
  // 1. Locally: npm run typeorm migration:run
  // 2. Supabase: Execute migrations via SQL Editor
  //
  // if (process.env.NODE_ENV === 'production') {
  //   const migrationsSucceeded = await runMigrations();
  //   if (migrationsSucceeded) {
  //     await runDatabaseSeeds();
  //   }
  // }

  console.log('📦 Creating NestJS application...');
  const app = await NestFactory.create(AppModule);
  console.log('✅ NestJS application created successfully');

  // Serve static files (uploaded photos)
  console.log('📁 Setting up static file serving...');
  const express = await import('express');
  app.use('/uploads', express.static('uploads'));
  console.log('✅ Static file serving configured');

  // Enable CORS - Support multiple origins
  console.log('🔐 Configuring CORS...');
  const defaultOrigins = [
    'http://localhost:3000',
    'http://localhost:3002',
    'http://localhost:8080',
    'https://admin.flipcars.us',
    'https://www.flipcars.us',
    'https://flipcars.us',
  ];
  
  const allowedOrigins: string[] = process.env.FRONTEND_URL
    ? [...defaultOrigins, ...process.env.FRONTEND_URL.split(',').map((url: string) => url.trim())]
    : defaultOrigins;

  // Production CORS configuration
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    exposedHeaders: ['Content-Type', 'X-Total-Count'],
    maxAge: 3600,
  });
  
  console.log('✅ CORS enabled for origins:', allowedOrigins);

  // Global validation pipe
  console.log('✅ Configuring global validation pipe...');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // API prefix
  console.log('🔧 Setting API prefix to /api...');
  app.setGlobalPrefix('api');
  console.log('✅ API prefix configured');

  const port = process.env.PORT || 3001;
  console.log(`🌐 Starting server on port ${port}...`);
  await app.listen(port, '0.0.0.0'); // Listen on all interfaces for Railway

  console.log('\n========================================');
  console.log(`🚀 FlipCars Backend API running on: http://0.0.0.0:${port}/api`);
  console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for origins:`, allowedOrigins);
}

// Global error handlers to catch uncaught errors
process.on('uncaughtException', (error) => {
  console.error('💥 [UNCAUGHT EXCEPTION] Unhandled error:', error);
  console.error('Stack trace:', error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 [UNHANDLED REJECTION] Promise rejection:', reason);
  console.error('Promise:', promise);
  process.exit(1);
});

// Start application with error handling
bootstrap().catch((error) => {
  console.error('💥 [BOOTSTRAP ERROR] Failed to start application:', error);
  console.error('Stack trace:', error.stack);
  process.exit(1);
});
