export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

export enum NotificationCategory {
  LEAD = 'lead',
  CUSTOMER = 'customer',
  CLAIM = 'claim',
  CHAT = 'chat',
  SYSTEM = 'system',
}

export interface Notification {
  id: string
  type: NotificationType
  category: NotificationCategory
  title: string
  message: string
  read: boolean
  actionUrl?: string
  metadata?: {
    leadId?: string
    customerId?: string
    claimId?: string
    conversationId?: string
    [key: string]: unknown
  }
  createdAt: string
}

export interface NotificationPreferences {
  email: boolean
  push: boolean
  inApp: boolean
  categories: {
    [key in NotificationCategory]: boolean
  }
}

export interface NotificationStats {
  total: number
  unread: number
  byCategory: {
    [key in NotificationCategory]: number
  }
}
