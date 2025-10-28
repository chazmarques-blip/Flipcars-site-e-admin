import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Claim } from './claim.entity';
import { User } from './user.entity';

export enum ClaimTimelineEventType {
  STATUS_CHANGE = 'status_change',
  NOTE_ADDED = 'note_added',
  DOCUMENT_UPLOADED = 'document_uploaded',
  CUSTOMER_CONTACTED = 'customer_contacted',
  PARTS_ORDERED = 'parts_ordered',
  WORK_STARTED = 'work_started',
  WORK_COMPLETED = 'work_completed',
  PAYMENT_RECEIVED = 'payment_received',
  VEHICLE_PICKED_UP = 'vehicle_picked_up',
}

@Entity('claim_timeline')
export class ClaimTimeline {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Claim, (claim) => claim.timeline)
  @JoinColumn({ name: 'claim_id' })
  claim: Claim;

  @Column({ type: 'uuid', name: 'claim_id' })
  @Index('idx_timeline_claim')
  claimId: string;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'event_type',
    enum: ClaimTimelineEventType,
  })
  eventType: ClaimTimelineEventType;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @Column({ type: 'uuid', nullable: true, name: 'created_by_id' })
  createdById: string;

  @Column({ type: 'jsonb', nullable: true, default: '{}' })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  @Index('idx_timeline_created_at')
  createdAt: Date;
}
