import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  Index,
} from 'typeorm';
import { Role } from './role.entity';
import { Lead } from './lead.entity';
import { Claim } from './claim.entity';
import { Message } from './message.entity';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @Index('idx_user_email')
  email: string;

  @Column({ type: 'varchar', length: 255, select: false })
  password: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'avatar_url' })
  avatarUrl: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: UserStatus.ACTIVE,
    enum: UserStatus,
  })
  status: UserStatus;

  @Column({ type: 'varchar', length: 10, default: 'en' })
  @Index('idx_user_language')
  language: string;

  @Column({ type: 'timestamp', nullable: true, name: 'last_login' })
  lastLogin: Date;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'reset_password_token' })
  resetPasswordToken: string;

  @Column({ type: 'timestamp', nullable: true, name: 'reset_password_expires' })
  resetPasswordExpires: Date;

  @Column({ type: 'boolean', default: false, name: 'email_verified' })
  emailVerified: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'email_verification_token' })
  emailVerificationToken: string;

  @ManyToMany(() => Role, (role) => role.users, { eager: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  @OneToMany(() => Lead, (lead) => lead.assignedHumanAgent)
  assignedLeads: Lead[];

  @OneToMany(() => Claim, (claim) => claim.assignedAgent)
  assignedClaims: Claim[];

  @OneToMany(() => Message, (message) => message.sender)
  sentMessages: Message[];

  @OneToMany(() => Message, (message) => message.recipient)
  receivedMessages: Message[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
