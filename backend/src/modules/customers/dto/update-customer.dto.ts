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

export class UpdateCustomerDto {
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(10)
  @MaxLength(50)
  @IsOptional()
  phone?: string;

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
