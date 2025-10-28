import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Claim } from './claim.entity';
import { User } from './user.entity';

export enum DocumentType {
  ESTIMATE = 'estimate',
  INVOICE = 'invoice',
  PHOTO = 'photo',
  INSURANCE_DOCUMENT = 'insurance_document',
  RECEIPT = 'receipt',
  OTHER = 'other',
}

@Entity('claim_documents')
export class ClaimDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Claim, (claim) => claim.documents)
  @JoinColumn({ name: 'claim_id' })
  claim: Claim;

  @Column({ type: 'uuid', name: 'claim_id' })
  @Index('idx_document_claim')
  claimId: string;

  @Column({ type: 'varchar', length: 255, name: 'file_name' })
  fileName: string;

  @Column({ type: 'varchar', length: 255, name: 'file_url' })
  fileUrl: string;

  @Column({ type: 'varchar', length: 100, name: 'file_type' })
  fileType: string;

  @Column({ type: 'integer', name: 'file_size' })
  fileSize: number;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'document_type',
    enum: DocumentType,
  })
  documentType: DocumentType;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'uploaded_by_id' })
  uploadedBy: User;

  @Column({ type: 'uuid', nullable: true, name: 'uploaded_by_id' })
  uploadedById: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  @Index('idx_document_created_at')
  createdAt: Date;
}
