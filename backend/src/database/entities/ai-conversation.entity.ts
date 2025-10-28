import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Lead } from './lead.entity';

export enum ConversationRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

@Entity('ai_conversations')
export class AiConversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Lead, (lead) => lead.aiConversations)
  @JoinColumn({ name: 'lead_id' })
  lead: Lead;

  @Column({ type: 'uuid', name: 'lead_id' })
  @Index('idx_conversation_lead')
  leadId: string;

  @Column({
    type: 'varchar',
    length: 20,
    enum: ConversationRole,
  })
  role: ConversationRole;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'text', nullable: true })
  response: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'ai_agent' })
  aiAgent: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  confidence: number;

  @Column({ type: 'integer', nullable: true, name: 'tokens_used' })
  tokensUsed: number;

  @Column({ type: 'jsonb', nullable: true, default: '{}' })
  metadata: Record<string, any>;

  @Column({ type: 'boolean', default: false, name: 'escalated_to_human' })
  escalatedToHuman: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'escalation_reason' })
  escalationReason: string;

  @CreateDateColumn({ name: 'created_at' })
  @Index('idx_conversation_created_at')
  createdAt: Date;
}
