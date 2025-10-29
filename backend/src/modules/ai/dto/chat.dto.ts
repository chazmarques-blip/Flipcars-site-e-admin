import { IsString, IsOptional, IsArray, IsObject, MaxLength, IsEnum } from 'class-validator';

export class ChatMessageDto {
  @IsString()
  @MaxLength(5000)
  message: string;

  @IsString()
  @IsOptional()
  leadId?: string;

  @IsString()
  @IsOptional()
  customerId?: string;

  @IsArray()
  @IsOptional()
  conversationHistory?: Array<{ role: string; content: string }>;

  @IsEnum(['qualifier', 'support', 'sales'])
  @IsOptional()
  agentType?: string;

  @IsObject()
  @IsOptional()
  context?: Record<string, any>;
}

export class ChatResponseDto {
  message: string;
  agentType: string;
  confidence: number;
  suggestedActions?: string[];
  escalateToHuman?: boolean;
  conversationHistory: Array<{ role: string; content: string }>;
}
