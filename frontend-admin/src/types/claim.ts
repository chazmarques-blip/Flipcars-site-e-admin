export enum ClaimStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  IN_REPAIR = 'in_repair',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum ClaimPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum DamageType {
  COLLISION = 'collision',
  THEFT = 'theft',
  VANDALISM = 'vandalism',
  NATURAL_DISASTER = 'natural_disaster',
  FIRE = 'fire',
  GLASS_DAMAGE = 'glass_damage',
  MECHANICAL = 'mechanical',
  OTHER = 'other',
}

export interface ClaimDocument {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  uploadedBy?: {
    id: string;
    name: string;
  };
}

export interface Claim {
  id: string;
  claimNumber: string;
  
  // Customer & Vehicle info
  customerId: string;
  customer?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: string;
  vehiclePlate?: string;
  vehicleVin?: string;
  
  // Incident details
  incidentDate: string;
  incidentLocation?: string;
  incidentDescription: string;
  damageType: DamageType;
  damageDescription?: string;
  policeReportNumber?: string;
  
  // Claim management
  status: ClaimStatus;
  priority: ClaimPriority;
  
  // Financial
  estimatedAmount?: number;
  approvedAmount?: number;
  paidAmount?: number;
  
  // Assignment
  assignedToId?: string;
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  };
  
  // Insurance info
  insuranceCompany?: string;
  insurancePolicyNumber?: string;
  insuranceClaimNumber?: string;
  
  // Documents
  documents: ClaimDocument[];
  documentCount: number;
  
  // AI analysis
  aiRiskScore?: number;
  aiRiskNotes?: string;
  aiFraudIndicators?: string[];
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  approvedAt?: string;
  completedAt?: string;
}

export interface CreateClaimDto {
  customerId: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: string;
  vehiclePlate?: string;
  vehicleVin?: string;
  incidentDate: string;
  incidentLocation?: string;
  incidentDescription: string;
  damageType: DamageType;
  damageDescription?: string;
  policeReportNumber?: string;
  estimatedAmount?: number;
  insuranceCompany?: string;
  insurancePolicyNumber?: string;
  insuranceClaimNumber?: string;
}

export interface UpdateClaimDto extends Partial<CreateClaimDto> {
  status?: ClaimStatus;
  priority?: ClaimPriority;
  assignedToId?: string;
  approvedAmount?: number;
  paidAmount?: number;
  aiRiskScore?: number;
  aiRiskNotes?: string;
  aiFraudIndicators?: string[];
}

export interface ClaimFilters {
  status?: ClaimStatus;
  priority?: ClaimPriority;
  damageType?: DamageType;
  customerId?: string;
  assignedToId?: string;
  search?: string;
  minAmount?: number;
  maxAmount?: number;
  minRiskScore?: number;
  maxRiskScore?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface ClaimStats {
  total: number;
  draft: number;
  submitted: number;
  underReview: number;
  approved: number;
  rejected: number;
  inRepair: number;
  completed: number;
  totalEstimated: number;
  totalApproved: number;
  totalPaid: number;
  avgRiskScore: number;
}
