import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dataSourceOptions } from './database/data-source';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { LeadsModule } from './modules/leads/leads.module';
import { CustomersModule } from './modules/customers/customers.module';
import { ClaimsModule } from './modules/claims/claims.module';
import { AiModule } from './modules/ai/ai.module';
import { StorageModule } from './modules/storage/storage.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from './modules/auth/guards/roles.guard';

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    
    // Rate limiting (protect public endpoints from spam)
    ThrottlerModule.forRoot([{
      name: 'short',
      ttl: 60000, // 1 minute
      limit: 10, // 10 requests per minute
    }, {
      name: 'long',
      ttl: 3600000, // 1 hour
      limit: 100, // 100 requests per hour
    }]),
    
    // TypeORM Database Connection
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => dataSourceOptions,
      inject: [ConfigService],
    }),
    
    // Feature modules
    AuthModule,
    UsersModule,
    LeadsModule,
    CustomersModule,
    ClaimsModule,
    AiModule,
    StorageModule,
    
    // Phase 1 Complete! 🎉
    // Phase 2 modules (future):
    // NotificationsModule,
    // ReportsModule,
    // etc.
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global rate limiting guard (applies to all routes)
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // Global guards (JWT auth required by default, use @Public() to bypass)
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
