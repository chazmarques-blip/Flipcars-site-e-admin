import { IsInt, Min, Max, IsString, IsOptional, MaxLength, IsObject } from 'class-validator';

export class QualifyLeadDto {
  @IsInt()
  @Min(0)
  @Max(100)
  aiQualificationScore: number;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  assignedAiAgent?: string;

  @IsObject()
  @IsOptional()
  aiConversationHistory?: Record<string, any>[];
}
