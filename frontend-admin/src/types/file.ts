export enum FileCategory {
  LEAD_DOCUMENT = 'lead_document',
  CUSTOMER_DOCUMENT = 'customer_document',
  CLAIM_DOCUMENT = 'claim_document',
  VEHICLE_DOCUMENT = 'vehicle_document',
  INSURANCE_DOCUMENT = 'insurance_document',
  CONTRACT = 'contract',
  INVOICE = 'invoice',
  OTHER = 'other',
}

export enum FileStatus {
  UPLOADING = 'uploading',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface FileMetadata {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  category: FileCategory
  status: FileStatus
  url?: string
  thumbnailUrl?: string
  uploadedBy: string
  uploadedAt: string
  entityType?: string
  entityId?: string
  description?: string
  tags?: string[]
  error?: string
}

export interface FileUploadProgress {
  fileId: string
  filename: string
  progress: number
  status: FileStatus
  error?: string
}

export interface FileUploadOptions {
  category: FileCategory
  entityType?: string
  entityId?: string
  description?: string
  tags?: string[]
  maxSize?: number
  allowedTypes?: string[]
}

export interface FileFilter {
  category?: FileCategory[]
  status?: FileStatus[]
  entityType?: string
  entityId?: string
  tags?: string[]
  startDate?: string
  endDate?: string
  searchQuery?: string
}

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/csv',
]

export const FILE_TYPE_LABELS: Record<string, string> = {
  'image/jpeg': 'JPEG Image',
  'image/png': 'PNG Image',
  'image/gif': 'GIF Image',
  'image/webp': 'WebP Image',
  'application/pdf': 'PDF Document',
  'application/msword': 'Word Document',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document',
  'application/vnd.ms-excel': 'Excel Spreadsheet',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel Spreadsheet',
  'text/plain': 'Text File',
  'text/csv': 'CSV File',
}
