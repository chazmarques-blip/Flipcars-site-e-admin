export enum EmailTemplateCategory {
  LEAD = 'lead',
  CUSTOMER = 'customer',
  CLAIM = 'claim',
  SYSTEM = 'system',
  MARKETING = 'marketing',
}

export enum EmailTriggerType {
  MANUAL = 'manual',
  LEAD_CREATED = 'lead_created',
  LEAD_UPDATED = 'lead_updated',
  LEAD_CONVERTED = 'lead_converted',
  CUSTOMER_CREATED = 'customer_created',
  CUSTOMER_UPDATED = 'customer_updated',
  CLAIM_CREATED = 'claim_created',
  CLAIM_UPDATED = 'claim_updated',
  CLAIM_APPROVED = 'claim_approved',
  CLAIM_REJECTED = 'claim_rejected',
  SCHEDULED = 'scheduled',
}

export enum EmailStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

export enum EmailSendStatus {
  PENDING = 'pending',
  SENDING = 'sending',
  SENT = 'sent',
  FAILED = 'failed',
  BOUNCED = 'bounced',
}

export interface EmailVariable {
  key: string
  label: string
  description: string
  example: string
}

export interface EmailTemplate {
  id: string
  name: string
  category: EmailTemplateCategory
  subject: string
  body: string
  variables: string[]
  triggers: EmailTriggerType[]
  status: EmailStatus
  createdBy: string
  createdAt: string
  updatedAt: string
  lastUsed?: string
  usageCount: number
}

export interface EmailTrigger {
  id: string
  templateId: string
  triggerType: EmailTriggerType
  enabled: boolean
  conditions?: Record<string, unknown>
  delay?: number // in minutes
  createdAt: string
  updatedAt: string
}

export interface EmailSendHistory {
  id: string
  templateId: string
  templateName: string
  recipient: string
  subject: string
  status: EmailSendStatus
  sentAt?: string
  failedAt?: string
  error?: string
  metadata?: Record<string, unknown>
}

export interface EmailPreview {
  subject: string
  body: string
  variables: Record<string, string>
}

export const DEFAULT_VARIABLES: EmailVariable[] = [
  {
    key: 'customer_name',
    label: 'Customer Name',
    description: 'Full name of the customer',
    example: 'John Doe',
  },
  {
    key: 'customer_email',
    label: 'Customer Email',
    description: 'Email address of the customer',
    example: 'john@example.com',
  },
  {
    key: 'customer_phone',
    label: 'Customer Phone',
    description: 'Phone number of the customer',
    example: '+1 (555) 123-4567',
  },
  {
    key: 'lead_id',
    label: 'Lead ID',
    description: 'Unique identifier for the lead',
    example: 'LEAD-001',
  },
  {
    key: 'vehicle_make',
    label: 'Vehicle Make',
    description: 'Make of the vehicle',
    example: 'Toyota',
  },
  {
    key: 'vehicle_model',
    label: 'Vehicle Model',
    description: 'Model of the vehicle',
    example: 'Camry',
  },
  {
    key: 'vehicle_year',
    label: 'Vehicle Year',
    description: 'Year of the vehicle',
    example: '2023',
  },
  {
    key: 'claim_id',
    label: 'Claim ID',
    description: 'Unique identifier for the claim',
    example: 'CLAIM-001',
  },
  {
    key: 'claim_status',
    label: 'Claim Status',
    description: 'Current status of the claim',
    example: 'Approved',
  },
  {
    key: 'agent_name',
    label: 'Agent Name',
    description: 'Name of the assigned agent',
    example: 'Jane Smith',
  },
  {
    key: 'agent_email',
    label: 'Agent Email',
    description: 'Email of the assigned agent',
    example: 'jane@flipcars.com',
  },
  {
    key: 'agent_phone',
    label: 'Agent Phone',
    description: 'Phone of the assigned agent',
    example: '+1 (555) 987-6543',
  },
  {
    key: 'company_name',
    label: 'Company Name',
    description: 'Name of the company',
    example: 'FlipCars',
  },
  {
    key: 'company_address',
    label: 'Company Address',
    description: 'Physical address of the company',
    example: '123 Main St, City, State 12345',
  },
  {
    key: 'company_phone',
    label: 'Company Phone',
    description: 'Company contact phone',
    example: '+1 (555) 000-0000',
  },
  {
    key: 'current_date',
    label: 'Current Date',
    description: 'Current date',
    example: 'January 15, 2024',
  },
]

export function parseVariables(text: string): string[] {
  const regex = /\{\{([^}]+)\}\}/g
  const matches = text.match(regex)
  if (!matches) return []
  return matches.map((match) => match.replace(/\{\{|\}\}/g, '').trim())
}

export function replaceVariables(
  text: string,
  values: Record<string, string>
): string {
  let result = text
  Object.keys(values).forEach((key) => {
    const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g')
    result = result.replace(regex, values[key])
  })
  return result
}
