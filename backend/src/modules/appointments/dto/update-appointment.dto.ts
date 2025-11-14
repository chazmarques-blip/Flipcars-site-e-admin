import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsString, IsOptional } from 'class-validator';
import { AppointmentStatus } from '../entities/appointment.entity';
import { CreateAppointmentDto } from './create-appointment.dto';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus;

  @IsString()
  @IsOptional()
  adminNotes?: string;
}
