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

export enum MessageStatus {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived',
}

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.sentMessages)
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @Column({ type: 'uuid', name: 'sender_id' })
  @Index('idx_message_sender')
  senderId: string;

  @ManyToOne(() => User, (user) => user.receivedMessages)
  @JoinColumn({ name: 'recipient_id' })
  recipient: User;

  @Column({ type: 'uuid', name: 'recipient_id' })
  @Index('idx_message_recipient')
  recipientId: string;

  @Column({ type: 'varchar', length: 255 })
  subject: string;

  @Column({ type: 'text' })
  body: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: MessageStatus.UNREAD,
    enum: MessageStatus,
  })
  @Index('idx_message_status')
  status: MessageStatus;

  @Column({ type: 'timestamp', nullable: true, name: 'read_at' })
  readAt: Date;

  @Column({ type: 'uuid', nullable: true, name: 'reply_to_id' })
  replyToId: string;

  @CreateDateColumn({ name: 'created_at' })
  @Index('idx_message_created_at')
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
