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
import { User } from './user.entity';
import { Vehicle } from './vehicle.entity';
import { AiConversation } from './ai-conversation.entity';

export enum LeadStatus {
  NEW = 'new',
  QUALIFIED_AI = 'qualified_ai',
  HUMAN_CONTACTED = 'human_contacted',
  ESTIMATE_SENT = 'estimate_sent',
  CONVERTED = 'converted',
  LOST = 'lost',
}

export enum LeadPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Customer, (customer) => customer.leads, { nullable: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ type: 'uuid', nullable: true, name: 'customer_id' })
  @Index('idx_lead_customer')
  customerId: string;

  @Column({ type: 'varchar', length: 50, unique: true, name: 'reference_number' })
  @Index('idx_lead_reference')
  referenceNumber: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 10, default: 'en', name: 'preferred_language' })
  preferredLanguage: string;

  // Vehicle Information
  @ManyToOne(() => Vehicle, { nullable: true })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @Column({ type: 'uuid', nullable: true, name: 'vehicle_id' })
  vehicleId: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'vehicle_year' })
  vehicleYear: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'vehicle_make' })
  vehicleMake: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'vehicle_model' })
  vehicleModel: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'vehicle_color' })
  vehicleColor: string;

  // Insurance Information
  @Column({ type: 'boolean', default: false, name: 'has_insurance' })
  hasInsurance: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'insurance_provider' })
  insuranceProvider: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'claim_number' })
  claimNumber: string;

  // Accident Information
  @Column({ type: 'text', nullable: true, name: 'accident_description' })
  accidentDescription: string;

  @Column({ type: 'date', nullable: true, name: 'accident_date' })
  accidentDate: Date;

  @Column({ type: 'boolean', default: true, name: 'is_drivable' })
  isDrivable: boolean;

  @Column({ type: 'boolean', default: false, name: 'needs_tow' })
  needsTow: boolean;

  @Column({ type: 'boolean', default: false, name: 'needs_rental' })
  needsRental: boolean;

  @Column({ type: 'jsonb', nullable: true, default: '[]', name: 'damage_photos' })
  damagePhotos: string[];

  // AI Integration Fields
  @Column({ type: 'integer', nullable: true, name: 'ai_qualification_score' })
  @Index('idx_lead_ai_score')
  aiQualificationScore: number;

  @Column({ type: 'jsonb', nullable: true, default: '[]', name: 'ai_conversation_history' })
  aiConversationHistory: Record<string, any>[];

  @Column({ type: 'timestamp', nullable: true, name: 'last_ai_interaction' })
  lastAiInteraction: Date;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'assigned_ai_agent' })
  assignedAiAgent: string;

  // Human Assignment
  @ManyToOne(() => User, (user) => user.assignedLeads, { nullable: true })
  @JoinColumn({ name: 'assigned_human_agent_id' })
  assignedHumanAgent: User;

  @Column({ type: 'uuid', nullable: true, name: 'assigned_human_agent_id' })
  @Index('idx_lead_assigned_agent')
  assignedHumanAgentId: string;

  @Column({ type: 'timestamp', nullable: true, name: 'last_human_interaction' })
  lastHumanInteraction: Date;

  // Status & Priority
  @Column({
    type: 'varchar',
    length: 50,
    default: LeadStatus.NEW,
    enum: LeadStatus,
  })
  @Index('idx_lead_status')
  status: LeadStatus;

  @Column({
    type: 'varchar',
    length: 20,
    default: LeadPriority.MEDIUM,
    enum: LeadPriority,
  })
  priority: LeadPriority;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'estimated_value' })
  estimatedValue: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  source: string;

  @OneToMany(() => AiConversation, (conversation) => conversation.lead)
  aiConversations: AiConversation[];

  @CreateDateColumn({ name: 'created_at' })
  @Index('idx_lead_created_at')
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
