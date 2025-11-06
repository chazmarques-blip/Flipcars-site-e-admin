export enum ExportFormat {
  CSV = 'csv',
  PDF = 'pdf',
  EXCEL = 'excel',
  JSON = 'json',
}

export enum ExportStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface ExportColumn {
  key: string
  label: string
  width?: number
  format?: (value: unknown) => string
  align?: 'left' | 'center' | 'right'
}

export interface ExportOptions {
  format: ExportFormat
  filename: string
  columns?: ExportColumn[]
  includeHeaders?: boolean
  filters?: Record<string, unknown>
  orientation?: 'portrait' | 'landscape'
  pageSize?: 'a4' | 'letter' | 'legal'
  title?: string
  description?: string
  logo?: string
}

export interface ExportTemplate {
  id: string
  name: string
  description?: string
  entityType: string
  format: ExportFormat
  columns: ExportColumn[]
  options: Partial<ExportOptions>
  isDefault?: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
  usageCount: number
}

export interface ExportJob {
  id: string
  template?: ExportTemplate
  format: ExportFormat
  filename: string
  status: ExportStatus
  totalRecords: number
  processedRecords: number
  fileUrl?: string
  fileSize?: number
  error?: string
  startedAt: string
  completedAt?: string
  createdBy: string
}

export interface ExportHistory {
  id: string
  filename: string
  format: ExportFormat
  recordCount: number
  fileSize: number
  downloadUrl: string
  status: ExportStatus
  createdAt: string
  expiresAt?: string
}

// CSV Options
export interface CSVExportOptions extends ExportOptions {
  delimiter?: string
  lineTerminator?: string
  encoding?: 'utf-8' | 'utf-16' | 'ascii'
}

// PDF Options
export interface PDFExportOptions extends ExportOptions {
  pageSize?: 'a4' | 'letter' | 'legal'
  orientation?: 'portrait' | 'landscape'
  fontSize?: number
  showPageNumbers?: boolean
  showDate?: boolean
  marginTop?: number
  marginBottom?: number
  marginLeft?: number
  marginRight?: number
}

// Excel Options
export interface ExcelExportOptions extends ExportOptions {
  sheetName?: string
  autoWidth?: boolean
  freezeHeader?: boolean
  applyFilters?: boolean
  applyFormatting?: boolean
}
