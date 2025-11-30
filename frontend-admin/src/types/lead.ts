export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  APPOINTMENT_SCHEDULED = 'appointment_scheduled',
  IN_PROGRESS = 'in_progress',
  CONVERTED = 'converted',
  LOST = 'lost',
  ARCHIVED = 'archived',
  // Legacy statuses (keep for backward compatibility)
  PROPOSAL_SENT = 'proposal_sent',
  NEGOTIATING = 'negotiating',
  WON = 'won',
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
  city?: string;
  state?: string;
  zipCode?: string;
  
  // Contact preferences
  contactPreferences?: {
    phoneCall?: boolean;
    whatsapp?: boolean;
    textMessage?: boolean;
  };
  
  // Vehicle info
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: string;
  vehiclePlate?: string;
  vehicleMileage?: number;
  vehicleCondition?: string;
  vin?: string;
  
  // Damage info
  damageDescription?: string;
  damageType?: string[];
  damagePhotos?: string[];
  estimatedValue?: number;
  additionalNotes?: string;
  
  // Accident info (legacy fields)
  accidentDate?: string;
  accidentDescription?: string;
  hasInsurance: boolean;
  insuranceProvider?: string; // From backend (same as insuranceCompany)
  insuranceCompany?: string; // Legacy field name
  insurancePolicyNumber?: string;
  claimNumber?: string;
  adjusterName?: string;
  adjusterPhone?: string;
  
  // Service-specific fields (NEW - added 2024-11-30)
  serviceType?: string; // 'mechanic' | 'bodyshop'
  warrantyCompany?: string; // 'CARCHEX', 'CarShield', 'Private (Self-Pay)', etc.
  selectedServices?: string[]; // ['Oil', 'Engine', 'Brakes', etc.]
  symptomsDescription?: string; // Customer's description of issues
  
  // Lead management
  status: LeadStatus;
  priority: LeadPriority;
  source?: string;
  notes?: string;
  
  // Assignment
  assignedToId?: string | null;
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  } | null;
  
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

export interface LeadNote {
  id: string;
  leadId: string;
  content: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  isInternal?: boolean;
}

export interface LeadActivity {
  id: string;
  leadId: string;
  type: string;
  description: string;
  performedBy: string;
  timestamp: string;
  metadata?: Record<string, any>;
}
