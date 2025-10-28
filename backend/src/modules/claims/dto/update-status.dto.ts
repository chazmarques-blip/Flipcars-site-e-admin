import { IsEnum, IsString, IsOptional, MaxLength } from 'class-validator';
import { ClaimStatus } from '@database/entities/claim.entity';

export class UpdateClaimStatusDto {
  @IsEnum(ClaimStatus)
  status: ClaimStatus;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  statusNote?: string;
}
