import { IsString, IsOptional, IsObject, MaxLength, IsUUID } from 'class-validator';

export class QualifyLeadAiDto {
  @IsUUID('4')
  leadId: string;

  @IsString()
  @IsOptional()
  @MaxLength(5000)
  additionalInfo?: string;

  @IsObject()
  @IsOptional()
  context?: Record<string, any>;
}

export class LeadQualificationResponseDto {
  leadId: string;
  qualificationScore: number;
  priority: string;
  reasoning: string;
  suggestedActions: string[];
  confidence: number;
  estimatedValue?: number;
  recommendedAgent?: string;
}
