import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Customer } from './customer.entity';
import { Vehicle } from './vehicle.entity';
import { User } from './user.entity';
import { ClaimTimeline } from './claim-timeline.entity';
import { ClaimDocument } from './claim-document.entity';

export enum ClaimStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  WAITING_PARTS = 'waiting_parts',
  READY_FOR_PICKUP = 'ready_for_pickup',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('claims')
export class Claim {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true, name: 'claim_number' })
  @Index('idx_claim_number')
  claimNumber: string;

  @ManyToOne(() => Customer, (customer) => customer.claims)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ type: 'uuid', name: 'customer_id' })
  @Index('idx_claim_customer')
  customerId: string;

  @ManyToOne(() => Vehicle)
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @Column({ type: 'uuid', name: 'vehicle_id' })
  vehicleId: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'insurance_company' })
  insuranceCompany: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'insurance_claim_number' })
  insuranceClaimNumber: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'estimated_cost' })
  estimatedCost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'final_cost' })
  finalCost: number;

  @Column({
    type: 'varchar',
    length: 50,
    default: ClaimStatus.OPEN,
    enum: ClaimStatus,
  })
  @Index('idx_claim_status')
  status: ClaimStatus;

  @ManyToOne(() => User, (user) => user.assignedClaims, { nullable: true })
  @JoinColumn({ name: 'assigned_agent_id' })
  assignedAgent: User;

  @Column({ type: 'uuid', nullable: true, name: 'assigned_agent_id' })
  assignedAgentId: string;

  @Column({ type: 'date', nullable: true, name: 'drop_off_date' })
  dropOffDate: Date;

  @Column({ type: 'date', nullable: true, name: 'estimated_completion_date' })
  estimatedCompletionDate: Date;

  @Column({ type: 'date', nullable: true, name: 'actual_completion_date' })
  actualCompletionDate: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @OneToMany(() => ClaimTimeline, (timeline) => timeline.claim)
  timeline: ClaimTimeline[];

  @OneToMany(() => ClaimDocument, (document) => document.claim)
  documents: ClaimDocument[];

  @CreateDateColumn({ name: 'created_at' })
  @Index('idx_claim_created_at')
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
