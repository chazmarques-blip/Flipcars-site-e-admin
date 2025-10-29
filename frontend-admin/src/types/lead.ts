export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  PROPOSAL_SENT = 'proposal_sent',
  NEGOTIATING = 'negotiating',
  WON = 'won',
  LOST = 'lost',
}

export enum LeadPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface Lead {
  id: string;
  referenceNumber: string;
  
  // Customer info
  name: string;
  email: string;
  phone: string;
  
  // Vehicle info
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: string;
  vehiclePlate?: string;
  
  // Accident info
  accidentDate?: string;
  accidentDescription?: string;
  hasInsurance: boolean;
  insuranceCompany?: string;
  insurancePolicyNumber?: string;
  
  // Lead management
  status: LeadStatus;
  priority: LeadPriority;
  source?: string;
  
  // Assignment
  assignedToId?: string;
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  };
  
  // AI qualification
  aiQualificationScore?: number;
  aiQualificationNotes?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadDto {
  name: string;
  email: string;
  phone: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: string;
  vehiclePlate?: string;
  accidentDate?: string;
  accidentDescription?: string;
  hasInsurance: boolean;
  insuranceCompany?: string;
  insurancePolicyNumber?: string;
  source?: string;
}

export interface UpdateLeadDto extends Partial<CreateLeadDto> {
  status?: LeadStatus;
  priority?: LeadPriority;
  assignedToId?: string;
  aiQualificationScore?: number;
  aiQualificationNotes?: string;
}

export interface LeadFilters {
  status?: LeadStatus;
  priority?: LeadPriority;
  assignedToId?: string;
  search?: string;
  hasInsurance?: boolean;
  minAiScore?: number;
  maxAiScore?: number;
}

export interface LeadStats {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  won: number;
  lost: number;
  avgAiScore: number;
}
