import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum VehicleStatus {
  IN_STOCK = 'In Stock',
  SOLD = 'Sold',
  PENDING = 'Pending',
  RESERVED = 'Reserved',
}

export enum AcquisitionType {
  PURCHASE = 'Purchase',
  TRADE_IN = 'Trade-in',
  AUCTION = 'Auction',
  CONSIGNMENT = 'Consignment',
}

export enum FuelType {
  GASOLINE = 'Gasoline',
  DIESEL = 'Diesel',
  ELECTRIC = 'Electric',
  HYBRID = 'Hybrid',
  PLUGIN_HYBRID = 'Plug-in Hybrid',
}

@Entity('inventory_vehicles')
export class InventoryVehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Basic Information
  @Column({ type: 'varchar', length: 20, unique: true })
  @Index('idx_inventory_vehicle_vin')
  vin: string;

  @Column({ type: 'varchar', length: 100 })
  make: string;

  @Column({ type: 'varchar', length: 100 })
  model: string;

  @Column({ type: 'varchar', length: 10 })
  year: string;

  @Column({ type: 'varchar', length: 50, name: 'exterior_color' })
  exteriorColor: string;

  @Column({ type: 'varchar', length: 50, name: 'interior_color', nullable: true })
  interiorColor: string | null;

  @Column({ type: 'integer' })
  mileage: number;

  @Column({
    type: 'enum',
    enum: FuelType,
    name: 'fuel_type',
    default: FuelType.GASOLINE,
  })
  fuelType: FuelType;

  // Financial Information
  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'suggested_sale_price' })
  suggestedSalePrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  commission: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  bonus: number | null;

  // Acquisition Information
  @Column({
    type: 'enum',
    enum: AcquisitionType,
    name: 'acquisition_type',
    default: AcquisitionType.PURCHASE,
  })
  acquisitionType: AcquisitionType;

  // Status
  @Column({
    type: 'enum',
    enum: VehicleStatus,
    default: VehicleStatus.IN_STOCK,
  })
  status: VehicleStatus;

  // Additional Information
  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'json', nullable: true })
  images: string[] | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
