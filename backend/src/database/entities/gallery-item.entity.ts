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
import { User } from './user.entity';

export enum GalleryItemType {
  BEFORE_AFTER = 'before_after',
  FACILITY = 'facility',
  TEAM = 'team',
  WORK_IN_PROGRESS = 'work_in_progress',
  COMPLETED_WORK = 'completed_work',
}

@Entity('gallery_items')
export class GalleryItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, name: 'image_url' })
  imageUrl: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'thumbnail_url' })
  thumbnailUrl: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'before_image_url' })
  beforeImageUrl: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'after_image_url' })
  afterImageUrl: string;

  @Column({
    type: 'varchar',
    length: 50,
    enum: GalleryItemType,
  })
  @Index('idx_gallery_type')
  type: GalleryItemType;

  @Column({ type: 'text', array: true, nullable: true })
  tags: string[];

  @Column({ type: 'integer', default: 0, name: 'display_order' })
  displayOrder: number;

  @Column({ type: 'boolean', default: true, name: 'is_featured' })
  isFeatured: boolean;

  @Column({ type: 'boolean', default: true, name: 'is_visible' })
  @Index('idx_gallery_visible')
  isVisible: boolean;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'uploaded_by_id' })
  uploadedBy: User;

  @Column({ type: 'uuid', nullable: true, name: 'uploaded_by_id' })
  uploadedById: string;

  @CreateDateColumn({ name: 'created_at' })
  @Index('idx_gallery_created_at')
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
