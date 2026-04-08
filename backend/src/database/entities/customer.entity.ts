import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Lead } from './lead.entity';
import { Vehicle } from './vehicle.entity';
import { Claim } from './claim.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid', nullable: true, name: 'user_id' })
  userId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @Index('idx_customer_email')
  email: string;

  @Column({ type: 'varchar', length: 50 })
  phone: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  type: string; // 'individual' or 'business'

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'alternate_phone' })
  alternatePhone: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  state: string;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'zip_code' })
  zipCode: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'business_name' })
  businessName: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'tax_id' })
  taxId: string;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'preferred_contact_method' })
  preferredContactMethod: string; // 'email', 'phone', 'sms'

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'language_preference' })
  languagePreference: string;

  @Column({ type: 'varchar', length: 10, default: 'en', name: 'preferred_language' })
  preferredLanguage: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'jsonb', nullable: true, default: '[]', name: 'communication_preferences' })
  communicationPreferences: Record<string, any>;

  // TEMPORARY: Disabled until schema is fixed
  // @OneToMany(() => Lead, (lead) => lead.customer)
  // leads: Lead[];

  @OneToMany(() => Vehicle, (vehicle) => vehicle.customer)
  vehicles: Vehicle[];

  @OneToMany(() => Claim, (claim) => claim.customer)
  claims: Claim[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
