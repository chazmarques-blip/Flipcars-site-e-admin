import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { Lead } from '@database/entities/lead.entity';
import { AiConversation } from '@database/entities/ai-conversation.entity';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lead, AiConversation]),
    AuthModule, // Import AuthModule for guards
  ],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService], // Export for use in other modules
})
export class AiModule {}
