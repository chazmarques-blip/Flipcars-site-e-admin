import {
  IsString,
  IsOptional,
  IsEnum,
  IsUUID,
  IsNumber,
  IsDateString,
  MaxLength,
  Min,
} from 'class-validator';
import { ClaimStatus } from '@database/entities/claim.entity';

export class CreateClaimDto {
  @IsUUID('4')
  customerId: string;

  @IsUUID('4')
  vehicleId: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  insuranceCompany?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  insuranceClaimNumber?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  estimatedCost?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  finalCost?: number;

  @IsEnum(ClaimStatus)
  @IsOptional()
  status?: ClaimStatus;

  @IsUUID('4')
  @IsOptional()
  assignedAgentId?: string;

  @IsDateString()
  @IsOptional()
  dropOffDate?: string;

  @IsDateString()
  @IsOptional()
  estimatedCompletionDate?: string;

  @IsDateString()
  @IsOptional()
  actualCompletionDate?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  notes?: string;
}
