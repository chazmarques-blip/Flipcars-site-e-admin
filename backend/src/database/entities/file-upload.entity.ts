import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';

export enum FileCategory {
  DOCUMENT = 'document',
  PHOTO = 'photo',
  VIDEO = 'video',
  AVATAR = 'avatar',
  OTHER = 'other',
}

@Entity('file_uploads')
export class FileUpload {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, name: 'original_name' })
  originalName: string;

  @Column({ type: 'varchar', length: 255, name: 'file_name' })
  fileName: string;

  @Column({ type: 'varchar', length: 255, name: 'file_path' })
  filePath: string;

  @Column({ type: 'varchar', length: 500, name: 'file_url' })
  fileUrl: string;

  @Column({ type: 'varchar', length: 100, name: 'mime_type' })
  mimeType: string;

  @Column({ type: 'integer', name: 'file_size' })
  fileSize: number;

  @Column({
    type: 'varchar',
    length: 50,
    enum: FileCategory,
  })
  @Index('idx_file_category')
  category: FileCategory;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'entity_type' })
  entityType: string;

  @Column({ type: 'uuid', nullable: true, name: 'entity_id' })
  @Index('idx_file_entity')
  entityId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'uploaded_by_id' })
  uploadedBy: User;

  @Column({ type: 'uuid', nullable: true, name: 'uploaded_by_id' })
  @Index('idx_file_uploaded_by')
  uploadedById: string;

  @Column({ type: 'jsonb', nullable: true, default: '{}' })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  @Index('idx_file_created_at')
  createdAt: Date;
}
