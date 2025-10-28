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

export enum KnowledgeBaseCategory {
  FAQ = 'faq',
  PROCESS = 'process',
  POLICY = 'policy',
  TECHNICAL = 'technical',
  PRICING = 'pricing',
  GENERAL = 'general',
}

@Entity('ai_knowledge_base')
export class AiKnowledgeBase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  @Index('idx_kb_title')
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'varchar',
    length: 50,
    enum: KnowledgeBaseCategory,
  })
  @Index('idx_kb_category')
  category: KnowledgeBaseCategory;

  @Column({ type: 'varchar', length: 10, default: 'en' })
  language: string;

  @Column({ type: 'text', array: true, nullable: true })
  @Index('idx_kb_keywords', { synchronize: false })
  keywords: string[];

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ type: 'integer', default: 0, name: 'usage_count' })
  usageCount: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @Column({ type: 'uuid', nullable: true, name: 'created_by_id' })
  createdById: string;

  @Column({ type: 'jsonb', nullable: true, default: '{}' })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
