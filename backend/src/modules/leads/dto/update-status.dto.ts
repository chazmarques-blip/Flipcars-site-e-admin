import { IsEnum, IsString, IsOptional, MaxLength } from 'class-validator';
import { LeadStatus } from '@database/entities/lead.entity';

export class UpdateLeadStatusDto {
  @IsEnum(LeadStatus)
  status: LeadStatus;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  statusNote?: string;
}
