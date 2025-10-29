import { IsArray, IsOptional, IsUUID } from 'class-validator';

export class AnalyzeConversationDto {
  @IsUUID('4')
  @IsOptional()
  leadId?: string;

  @IsArray()
  conversationHistory: Array<{ role: string; content: string; timestamp?: string }>;
}

export class ConversationAnalysisDto {
  sentiment: string;
  intent: string;
  keyTopics: string[];
  customerSatisfaction: number;
  escalationRecommended: boolean;
  summary: string;
  actionItems: string[];
}
