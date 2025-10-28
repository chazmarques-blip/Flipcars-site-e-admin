import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Customer } from './customer.entity';
import { Lead } from './lead.entity';

export enum CommunicationType {
  EMAIL = 'email',
  SMS = 'sms',
  WHATSAPP = 'whatsapp',
  PHONE = 'phone',
}

export enum CommunicationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  BOUNCED = 'bounced',
}

@Entity('communications')
export class Communication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Customer, { nullable: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ type: 'uuid', nullable: true, name: 'customer_id' })
  @Index('idx_comm_customer')
  customerId: string;

  @ManyToOne(() => Lead, { nullable: true })
  @JoinColumn({ name: 'lead_id' })
  lead: Lead;

  @Column({ type: 'uuid', nullable: true, name: 'lead_id' })
  @Index('idx_comm_lead')
  leadId: string;

  @Column({
    type: 'varchar',
    length: 20,
    enum: CommunicationType,
  })
  @Index('idx_comm_type')
  type: CommunicationType;

  @Column({ type: 'varchar', length: 255, nullable: true })
  recipient: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  subject: string;

  @Column({ type: 'text' })
  body: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: CommunicationStatus.PENDING,
    enum: CommunicationStatus,
  })
  @Index('idx_comm_status')
  status: CommunicationStatus;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'provider_message_id' })
  providerMessageId: string;

  @Column({ type: 'text', nullable: true, name: 'error_message' })
  errorMessage: string;

  @Column({ type: 'timestamp', nullable: true, name: 'sent_at' })
  sentAt: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'delivered_at' })
  deliveredAt: Date;

  @Column({ type: 'jsonb', nullable: true, default: '{}' })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  @Index('idx_comm_created_at')
  createdAt: Date;
}
