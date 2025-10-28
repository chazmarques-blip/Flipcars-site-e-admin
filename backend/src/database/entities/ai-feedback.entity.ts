import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { AiConversation } from './ai-conversation.entity';
import { User } from './user.entity';

export enum FeedbackRating {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
}

@Entity('ai_feedback')
export class AiFeedback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AiConversation)
  @JoinColumn({ name: 'conversation_id' })
  conversation: AiConversation;

  @Column({ type: 'uuid', name: 'conversation_id' })
  @Index('idx_feedback_conversation')
  conversationId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'agent_id' })
  agent: User;

  @Column({ type: 'uuid', name: 'agent_id' })
  agentId: string;

  @Column({
    type: 'varchar',
    length: 20,
    enum: FeedbackRating,
  })
  rating: FeedbackRating;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ type: 'boolean', default: false, name: 'was_accurate' })
  wasAccurate: boolean;

  @Column({ type: 'boolean', default: false, name: 'was_helpful' })
  wasHelpful: boolean;

  @Column({ type: 'jsonb', nullable: true, default: '[]', name: 'improvement_suggestions' })
  improvementSuggestions: string[];

  @CreateDateColumn({ name: 'created_at' })
  @Index('idx_feedback_created_at')
  createdAt: Date;
}
