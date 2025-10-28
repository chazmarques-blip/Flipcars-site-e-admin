import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
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
