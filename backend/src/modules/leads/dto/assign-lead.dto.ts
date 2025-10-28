import { IsUUID } from 'class-validator';

export class AssignLeadDto {
  @IsUUID('4')
  agentId: string;
}
