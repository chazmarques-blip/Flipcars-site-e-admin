import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  Max,
  MinLength,
  MaxLength,
  IsUUID,
  IsDateString,
  IsBoolean,
  IsArray,
  IsNumber,
} from 'class-validator';
import { LeadStatus, LeadPriority } from '@database/entities/lead.entity';

export class CreateLeadDto {
  // Customer Information
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(10)
  @MaxLength(50)
  phone: string;

  @IsEnum(['en', 'es', 'pt'])
  @IsOptional()
  preferredLanguage?: string;

  // Vehicle Information
  @IsString()
  @IsOptional()
  @MaxLength(100)
  vehicleMake?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  vehicleModel?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  vehicleYear?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  vehicleColor?: string;

  // Insurance Information
  @IsBoolean()
  @IsOptional()
  hasInsurance?: boolean;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  insuranceProvider?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  claimNumber?: string;

  // Accident Information
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  accidentDescription?: string;

  @IsDateString()
  @IsOptional()
  accidentDate?: string;

  @IsBoolean()
  @IsOptional()
  isDrivable?: boolean;

  @IsBoolean()
  @IsOptional()
  needsTow?: boolean;

  @IsBoolean()
  @IsOptional()
  needsRental?: boolean;

  @IsArray()
  @IsOptional()
  damagePhotos?: string[];

  // Lead Information
  @IsString()
  @IsOptional()
  @MaxLength(50)
  source?: string;

  @IsEnum(LeadStatus)
  @IsOptional()
  status?: LeadStatus;

  @IsEnum(LeadPriority)
  @IsOptional()
  priority?: LeadPriority;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  notes?: string;

  @IsNumber()
  @IsOptional()
  estimatedValue?: number;

  // Assignment
  @IsUUID('4')
  @IsOptional()
  assignedHumanAgentId?: string;

  // AI Qualification
  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  aiQualificationScore?: number;

  @IsString()
  @IsOptional()
  assignedAiAgent?: string;

  // Customer ID (if linking to existing customer)
  @IsUUID('4')
  @IsOptional()
  customerId?: string;

  // Vehicle ID (if linking to existing vehicle)
  @IsUUID('4')
  @IsOptional()
  vehicleId?: string;
}
