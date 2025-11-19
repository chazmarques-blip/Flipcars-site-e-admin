import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getDataSourceOptions } from './database/data-source';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { LeadsModule } from './modules/leads/leads.module';
import { CustomersModule } from './modules/customers/customers.module';
import { ClaimsModule } from './modules/claims/claims.module';
import { AiModule } from './modules/ai/ai.module';
import { StorageModule } from './modules/storage/storage.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { Appointment } from './modules/appointments/entities/appointment.entity';
import { VisionModule } from './modules/vision/vision.module';

// Import all entities explicitly to ensure TypeORM finds them in production
import { User } from './database/entities/user.entity';
import { Role } from './database/entities/role.entity';
import { Permission } from './database/entities/permission.entity';
import { Lead } from './database/entities/lead.entity';
import { Customer } from './database/entities/customer.entity';
import { Claim } from './database/entities/claim.entity';
import { ClaimDocument } from './database/entities/claim-document.entity';
import { ClaimTimeline } from './database/entities/claim-timeline.entity';
import { Vehicle } from './database/entities/vehicle.entity';
import { Communication } from './database/entities/communication.entity';
import { FileUpload } from './database/entities/file-upload.entity';
import { AiConversation } from './database/entities/ai-conversation.entity';
import { AiFeedback } from './database/entities/ai-feedback.entity';
import { AiKnowledgeBase } from './database/entities/ai-knowledge-base.entity';
import { Message } from './database/entities/message.entity';
import { Page } from './database/entities/page.entity';
import { BlogPost } from './database/entities/blog-post.entity';
import { GalleryItem } from './database/entities/gallery-item.entity';
import { EmailModule } from './modules/email/email.module';
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
      useFactory: async () => {
        // Resolve hostname to IPv4 before connection
        const options = await getDataSourceOptions();
        
        // FORCE: Explicitly include ALL entities for production
        // This ensures TypeORM finds them even if path resolution fails
        const allEntities = [
          User, Role, Permission,
          Lead, Customer,
          Appointment, // ← CRITICAL: This was missing!
          Claim, ClaimDocument, ClaimTimeline,
          Vehicle, Communication,
          FileUpload, AiConversation, AiFeedback, AiKnowledgeBase,
          Message, Page, BlogPost, GalleryItem,
        ];
        
        return {
          ...options,
          entities: allEntities,
        };
      },
      inject: [ConfigService],
    }),
    
    // Feature modules
    AuthModule,
    UsersModule,
    LeadsModule,
    AppointmentsModule,
    CustomersModule,
    ClaimsModule,
    AiModule,
    StorageModule,
    VisionModule,
    EmailModule,
    
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
