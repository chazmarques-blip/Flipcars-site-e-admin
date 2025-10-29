import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AiService } from './ai.service';
import { ChatMessageDto } from './dto/chat.dto';
import { QualifyLeadAiDto } from './dto/qualify-lead.dto';
import { AnalyzeConversationDto } from './dto/analyze-conversation.dto';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { Public } from '@common/decorators/public.decorator';

@Controller('ai')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  /**
   * Chat with AI agent
   * Accessible by: public (for website chat widget)
   */
  @Post('chat')
  @Public()
  @HttpCode(HttpStatus.OK)
  async chat(@Body() chatDto: ChatMessageDto) {
    return this.aiService.chat(chatDto);
  }

  /**
   * Qualify a lead using AI
   * Accessible by: admin, agent, super_admin
   */
  @Post('qualify-lead')
  @Roles('admin', 'agent', 'super_admin')
  @HttpCode(HttpStatus.OK)
  async qualifyLead(@Body() qualifyDto: QualifyLeadAiDto) {
    return this.aiService.qualifyLead(qualifyDto);
  }

  /**
   * Analyze conversation sentiment and intent
   * Accessible by: admin, agent, super_admin
   */
  @Post('analyze-conversation')
  @Roles('admin', 'agent', 'super_admin')
  @HttpCode(HttpStatus.OK)
  async analyzeConversation(@Body() analyzeDto: AnalyzeConversationDto) {
    return this.aiService.analyzeConversation(analyzeDto);
  }

  /**
   * Get AI statistics
   * Accessible by: admin, super_admin
   */
  @Get('statistics')
  @Roles('admin', 'super_admin')
  async getStatistics() {
    return this.aiService.getStatistics();
  }
}
