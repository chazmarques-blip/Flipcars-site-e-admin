import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Customer } from './customer.entity';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Customer, (customer) => customer.vehicles)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ type: 'uuid', name: 'customer_id' })
  @Index('idx_vehicle_customer')
  customerId: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  @Index('idx_vehicle_vin')
  vin: string;

  @Column({ type: 'varchar', length: 100 })
  make: string;

  @Column({ type: 'varchar', length: 100 })
  model: string;

  @Column({ type: 'varchar', length: 10 })
  year: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  color: string;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'license_plate' })
  licensePlate: string;

  @Column({ type: 'integer', nullable: true })
  mileage: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
