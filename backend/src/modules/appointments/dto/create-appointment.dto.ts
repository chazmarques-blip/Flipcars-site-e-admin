import {
  IsString,
  IsUUID,
  IsDateString,
  IsOptional,
  IsObject,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AppointmentStatus } from '../entities/appointment.entity';

export class ContactPreferencesDto {
  @IsOptional()
  phoneCall?: boolean;

  @IsOptional()
  whatsapp?: boolean;

  @IsOptional()
  textMessage?: boolean;
}

export class CreateAppointmentDto {
  @IsUUID()
  leadId: string;

  @IsDateString()
  appointmentDate: string; // YYYY-MM-DD

  @IsString()
  appointmentTimeSlot: string; // "9:00-11:00"

  @ValidateNested()
  @Type(() => ContactPreferencesDto)
  @IsOptional()
  contactPreferences?: ContactPreferencesDto;

  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus;

  @IsString()
  @IsOptional()
  adminNotes?: string;
}
