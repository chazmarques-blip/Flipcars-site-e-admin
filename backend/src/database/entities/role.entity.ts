import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Permission } from './permission.entity';

export enum RoleName {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  AGENT = 'agent',
  CUSTOMER = 'customer',
  READ_ONLY = 'read_only',
}

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    enum: RoleName,
  })
  name: RoleName;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  @ManyToMany(() => Permission, (permission) => permission.roles)
  permissions: Permission[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
