export enum CustomerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
}

export enum CustomerType {
  INDIVIDUAL = 'individual',
  BUSINESS = 'business',
}

export interface Customer {
  id: string;
  referenceNumber: string;
  
  // Basic info
  name: string;
  email: string;
  phone: string;
  type: CustomerType;
  status: CustomerStatus;
  
  // Additional contact info
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  
  // Business info (for business type)
  businessName?: string;
  taxId?: string;
  
  // Preferences
  preferredContactMethod?: 'email' | 'phone' | 'sms';
  languagePreference?: string;
  
  // Relationships
  assignedToId?: string;
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  };
  
  // Statistics
  totalLeads: number;
  totalClaims: number;
  totalRevenue: number;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  lastContactedAt?: string;
}

export interface CreateCustomerDto {
  name: string;
  email: string;
  phone: string;
  type: CustomerType;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  businessName?: string;
  taxId?: string;
  preferredContactMethod?: 'email' | 'phone' | 'sms';
  languagePreference?: string;
}

export interface UpdateCustomerDto extends Partial<CreateCustomerDto> {
  status?: CustomerStatus;
  assignedToId?: string;
}

export interface CustomerFilters {
  status?: CustomerStatus;
  type?: CustomerType;
  assignedToId?: string;
  search?: string;
  city?: string;
  state?: string;
  minRevenue?: number;
  maxRevenue?: number;
}

export interface CustomerStats {
  total: number;
  active: number;
  inactive: number;
  blocked: number;
  individual: number;
  business: number;
  totalRevenue: number;
  avgLeadsPerCustomer: number;
}
