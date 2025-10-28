import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dataSourceOptions } from './database/data-source';

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    
    // TypeORM Database Connection
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => dataSourceOptions,
      inject: [ConfigService],
    }),
    
    // Feature modules will be added here
    // AuthModule,
    // UsersModule,
    // LeadsModule,
    // AiModule,
    // etc.
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
