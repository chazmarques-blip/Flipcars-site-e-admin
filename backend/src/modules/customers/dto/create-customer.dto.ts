import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  MinLength,
  MaxLength,
  IsUUID,
  IsObject,
} from 'class-validator';

export enum CustomerType {
  INDIVIDUAL = 'individual',
  BUSINESS = 'business',
}

export class CreateCustomerDto {
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(10)
  @MaxLength(50)
  phone: string;

  @IsEnum(CustomerType)
  @IsOptional()
  type?: CustomerType;

  @IsString()
  @IsOptional()
  @MinLength(10)
  @MaxLength(50)
  alternatePhone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  address?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  city?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  state?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  zipCode?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  businessName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  taxId?: string;

  @IsEnum(['email', 'phone', 'sms'])
  @IsOptional()
  preferredContactMethod?: 'email' | 'phone' | 'sms';

  @IsString()
  @IsOptional()
  @MaxLength(100)
  languagePreference?: string;

  @IsEnum(['en', 'es', 'pt'])
  @IsOptional()
  preferredLanguage?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  notes?: string;

  @IsObject()
  @IsOptional()
  communicationPreferences?: Record<string, any>;

  @IsUUID('4')
  @IsOptional()
  userId?: string;
}
