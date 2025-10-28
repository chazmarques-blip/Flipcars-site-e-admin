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

export enum BlogPostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

@Entity('blog_posts')
export class BlogPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  @Index('idx_blog_title')
  title: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @Index('idx_blog_slug')
  slug: string;

  @Column({ type: 'text', nullable: true })
  excerpt: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 10, default: 'en' })
  @Index('idx_blog_language')
  language: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: BlogPostStatus.DRAFT,
    enum: BlogPostStatus,
  })
  @Index('idx_blog_status')
  status: BlogPostStatus;

  @Column({ type: 'text', array: true, nullable: true })
  @Index('idx_blog_tags', { synchronize: false })
  tags: string[];

  @Column({ type: 'varchar', length: 100, nullable: true })
  category: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'featured_image' })
  featuredImage: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'meta_title' })
  metaTitle: string;

  @Column({ type: 'text', nullable: true, name: 'meta_description' })
  metaDescription: string;

  @Column({ type: 'integer', default: 0, name: 'view_count' })
  viewCount: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({ type: 'uuid', nullable: true, name: 'author_id' })
  authorId: string;

  @Column({ type: 'timestamp', nullable: true, name: 'published_at' })
  @Index('idx_blog_published_at')
  publishedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
