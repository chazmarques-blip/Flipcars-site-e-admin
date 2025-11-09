import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  MinLength,
  MaxLength,
  IsBoolean,
  IsArray,
  IsDateString,
  ValidateNested,
  IsObject,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO for public lead creation from website estimate form
 * Supports both Body Shop and Mechanic service types
 */

export class ContactPreferencesDto {
  @IsBoolean()
  @IsOptional()
  phoneCall?: boolean;

  @IsBoolean()
  @IsOptional()
  whatsapp?: boolean;

  @IsBoolean()
  @IsOptional()
  textMessage?: boolean;
}

export class VehicleInfoDto {
  @IsString()
  @IsOptional()
  @MaxLength(17)
  vin?: string;

  @IsString()
  @IsOptional()
  @MaxLength(4)
  @MinLength(4)
  @Matches(/^(19[0-9]{2}|20[0-9]{2})$/, {
    message: 'Year must be a valid 4-digit year between 1900 and 2099',
  })
  year?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  make?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  model?: string;
}

export class EstimatePhotosDto {
  @IsString()
  @IsOptional()
  driverFront?: string;

  @IsString()
  @IsOptional()
  passengerFront?: string;

  @IsString()
  @IsOptional()
  driverRear?: string;

  @IsString()
  @IsOptional()
  passengerRear?: string;

  @IsString()
  @IsOptional()
  vinNumber?: string;

  @IsString()
  @IsOptional()
  odometer?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  details?: string[];
}

export class WarrantyDocumentsDto {
  @IsString()
  @IsOptional()
  policyDocument?: string;

  @IsString()
  @IsOptional()
  vinPhoto?: string;

  @IsString()
  @IsOptional()
  odometerPhoto?: string;

  @IsArray()
  @IsString({ each: true })
  selectedIssues: string[];

  @IsString()
  @MinLength(10)
  symptomsDescription: string;
}

export class CreatePublicLeadDto {
  // Step 1: Basic Contact Information (REQUIRED)
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  lastName: string;

  @IsString()
  @MinLength(10)
  @MaxLength(50)
  phone: string;

  @IsEmail()
  email: string;

  @IsEnum(['bodyshop', 'mechanic'])
  serviceType: 'bodyshop' | 'mechanic';

  // Step 2A: Body Shop Information (OPTIONAL - only for bodyshop)
  @IsString()
  @IsOptional()
  @MaxLength(100)
  insuranceCompany?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  claimNumber?: string;

  @IsBoolean()
  @IsOptional()
  hasClaimNumber?: boolean;

  // Step 2B: Mechanic/Warranty Information (OPTIONAL - only for mechanic)
  @IsString()
  @IsOptional()
  @MaxLength(100)
  warrantyCompany?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  warrantyClaimNumber?: string;

  @IsBoolean()
  @IsOptional()
  hasWarrantyClaimNumber?: boolean;

  // Scheduling Information (OPTIONAL)
  @IsDateString()
  @IsOptional()
  preferredDate?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  preferredTimeSlot?: string;

  @IsBoolean()
  @IsOptional()
  dateSkipped?: boolean;

  // Vehicle Information (OPTIONAL)
  @ValidateNested()
  @Type(() => VehicleInfoDto)
  @IsOptional()
  vehicle?: VehicleInfoDto;

  // Step 3: Photos (OPTIONAL - only for bodyshop)
  @ValidateNested()
  @Type(() => EstimatePhotosDto)
  @IsOptional()
  photos?: EstimatePhotosDto;

  // Step 2.5: Warranty Documents (OPTIONAL - only for mechanic)
  @ValidateNested()
  @Type(() => WarrantyDocumentsDto)
  @IsOptional()
  warrantyDocs?: WarrantyDocumentsDto;

  // Step 4: Contact Preferences (REQUIRED)
  @ValidateNested()
  @Type(() => ContactPreferencesDto)
  contactPreferences: ContactPreferencesDto;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  additionalNotes?: string;

  // System fields (auto-populated)
  @IsString()
  @IsOptional()
  source?: string; // Always 'website_estimate_form'

  @IsString()
  @IsOptional()
  status?: string; // Always 'new'
}
