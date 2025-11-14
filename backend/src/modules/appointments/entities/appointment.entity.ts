import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Lead } from '../../leads/lead.entity';
import { User } from '../../users/user.entity';

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
  RESCHEDULED = 'rescheduled',
}

export interface ContactPreferences {
  phoneCall?: boolean;
  whatsapp?: boolean;
  textMessage?: boolean;
}

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Relacionamento com Lead
  @ManyToOne(() => Lead, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lead_id' })
  lead: Lead;

  @Column({ name: 'lead_id' })
  leadId: string;

  // Data e Horário
  @Column({ type: 'date', name: 'appointment_date' })
  appointmentDate: string; // YYYY-MM-DD

  @Column({ name: 'appointment_time_slot', length: 20 })
  appointmentTimeSlot: string; // "9:00-11:00"

  @Column({ type: 'time', name: 'appointment_start_time', nullable: true })
  appointmentStartTime: string; // "09:00:00"

  @Column({ type: 'time', name: 'appointment_end_time', nullable: true })
  appointmentEndTime: string; // "11:00:00"

  // Status
  @Column({
    type: 'varchar',
    length: 20,
    default: AppointmentStatus.SCHEDULED,
  })
  status: AppointmentStatus;

  // Preferências de Contato
  @Column({ type: 'jsonb', name: 'contact_preferences', nullable: true })
  contactPreferences: ContactPreferences;

  // Notas
  @Column({ type: 'text', name: 'admin_notes', nullable: true })
  adminNotes: string;

  // Confirmação
  @Column({ type: 'timestamp', name: 'confirmed_at', nullable: true })
  confirmedAt: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'confirmed_by' })
  confirmedBy: User;

  @Column({ name: 'confirmed_by', nullable: true })
  confirmedById: string;

  // Timestamps
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
