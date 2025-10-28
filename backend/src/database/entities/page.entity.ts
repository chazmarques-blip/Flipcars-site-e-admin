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

export enum PageStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

@Entity('pages')
export class Page {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  @Index('idx_page_title')
  title: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @Index('idx_page_slug')
  slug: string;

  @Column({ type: 'text', nullable: true })
  excerpt: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 10, default: 'en' })
  @Index('idx_page_language')
  language: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: PageStatus.DRAFT,
    enum: PageStatus,
  })
  @Index('idx_page_status')
  status: PageStatus;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'meta_title' })
  metaTitle: string;

  @Column({ type: 'text', nullable: true, name: 'meta_description' })
  metaDescription: string;

  @Column({ type: 'text', array: true, nullable: true, name: 'meta_keywords' })
  metaKeywords: string[];

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'featured_image' })
  featuredImage: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({ type: 'uuid', nullable: true, name: 'author_id' })
  authorId: string;

  @Column({ type: 'timestamp', nullable: true, name: 'published_at' })
  publishedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
