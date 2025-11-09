import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import dataSource from './database/data-source';
import { runSeeds } from './database/seeds/run-seeds';

async function runMigrations() {
  console.log('\n========================================');
  console.log('📦 Running Database Migrations...');
  console.log('========================================\n');

  try {
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
  // Run migrations and seeds FIRST in production
  if (process.env.NODE_ENV === 'production') {
    const migrationsSucceeded = await runMigrations();
    
    // Only run seeds if migrations succeeded
    if (migrationsSucceeded) {
      await runDatabaseSeeds();
    }
  }

  const app = await NestFactory.create(AppModule);

  // Serve static files (uploaded photos)
  const express = await import('express');
  app.use('/uploads', express.static('uploads'));

  // Enable CORS - Support multiple origins
  const defaultOrigins = [
    'http://localhost:3000',
    'http://localhost:3002',
    'http://localhost:8080',
    'https://admin.flipcars.us',
    'https://www.flipcars.us',
    'https://flipcars.us',
  ];
  
  const allowedOrigins = process.env.FRONTEND_URL
    ? [...defaultOrigins, ...process.env.FRONTEND_URL.split(',').map((url) => url.trim())]
    : defaultOrigins;

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        console.log('✅ CORS: Allowing request with no origin');
        return callback(null, true);
      }
      
      if (allowedOrigins.includes(origin)) {
        console.log(`✅ CORS: Allowing request from origin: ${origin}`);
        callback(null, true);
      } else {
        console.warn(`❌ CORS: Blocked request from origin: ${origin}`);
        console.warn(`📝 Allowed origins:`, allowedOrigins);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: false, // Changed to false for public endpoints
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    exposedHeaders: ['Content-Type', 'X-Total-Count'],
    maxAge: 3600, // Cache preflight request for 1 hour
  });

  // Global validation pipe
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
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0'); // Listen on all interfaces for Railway

  console.log(`🚀 FlipCars Backend API running on: http://localhost:${port}/api`);
  console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for origins:`, allowedOrigins);
}

bootstrap();
