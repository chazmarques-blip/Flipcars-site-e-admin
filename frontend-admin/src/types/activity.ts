export enum ActivityAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  VIEW = 'view',
  EXPORT = 'export',
  IMPORT = 'import',
  LOGIN = 'login',
  LOGOUT = 'logout',
  SHARE = 'share',
  DOWNLOAD = 'download',
  UPLOAD = 'upload',
  APPROVE = 'approve',
  REJECT = 'reject',
  SUBMIT = 'submit',
  ASSIGN = 'assign',
  COMMENT = 'comment',
}

export enum ActivityResource {
  LEAD = 'lead',
  CUSTOMER = 'customer',
  CLAIM = 'claim',
  USER = 'user',
  FILE = 'file',
  EMAIL = 'email',
  TEMPLATE = 'template',
  REPORT = 'report',
  SETTINGS = 'settings',
  PROFILE = 'profile',
  NOTIFICATION = 'notification',
}

export enum ActivityStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  PENDING = 'pending',
  WARNING = 'warning',
}

export interface ActivityMetadata {
  [key: string]: unknown
  changes?: {
    field: string
    oldValue: unknown
    newValue: unknown
  }[]
  reason?: string
  comment?: string
  ipAddress?: string
  userAgent?: string
  location?: string
  duration?: number
}

export interface Activity {
  id: string
  action: ActivityAction
  resource: ActivityResource
  resourceId?: string
  resourceName?: string
  description: string
  status: ActivityStatus
  userId: string
  userName: string
  userRole: string
  userAvatar?: string
  metadata?: ActivityMetadata
  timestamp: string
  ipAddress?: string
}

export interface ActivityFilter {
  actions?: ActivityAction[]
  resources?: ActivityResource[]
  statuses?: ActivityStatus[]
  userIds?: string[]
  dateFrom?: string
  dateTo?: string
  search?: string
}

export interface ActivityStats {
  totalActivities: number
  todayActivities: number
  activeUsers: number
  failedActivities: number
  topActions: { action: ActivityAction; count: number }[]
  topResources: { resource: ActivityResource; count: number }[]
  activityTrend: { date: string; count: number }[]
}

// Helper functions
export function getActionColor(action: ActivityAction): string {
  const colors: Record<ActivityAction, string> = {
    [ActivityAction.CREATE]: 'text-green-600 bg-green-50',
    [ActivityAction.UPDATE]: 'text-blue-600 bg-blue-50',
    [ActivityAction.DELETE]: 'text-red-600 bg-red-50',
    [ActivityAction.VIEW]: 'text-gray-600 bg-gray-50',
    [ActivityAction.EXPORT]: 'text-purple-600 bg-purple-50',
    [ActivityAction.IMPORT]: 'text-purple-600 bg-purple-50',
    [ActivityAction.LOGIN]: 'text-green-600 bg-green-50',
    [ActivityAction.LOGOUT]: 'text-gray-600 bg-gray-50',
    [ActivityAction.SHARE]: 'text-blue-600 bg-blue-50',
    [ActivityAction.DOWNLOAD]: 'text-indigo-600 bg-indigo-50',
    [ActivityAction.UPLOAD]: 'text-indigo-600 bg-indigo-50',
    [ActivityAction.APPROVE]: 'text-green-600 bg-green-50',
    [ActivityAction.REJECT]: 'text-red-600 bg-red-50',
    [ActivityAction.SUBMIT]: 'text-blue-600 bg-blue-50',
    [ActivityAction.ASSIGN]: 'text-yellow-600 bg-yellow-50',
    [ActivityAction.COMMENT]: 'text-gray-600 bg-gray-50',
  }
  return colors[action] || 'text-gray-600 bg-gray-50'
}

export function getStatusColor(status: ActivityStatus): string {
  const colors: Record<ActivityStatus, string> = {
    [ActivityStatus.SUCCESS]: 'text-green-600 bg-green-50',
    [ActivityStatus.FAILED]: 'text-red-600 bg-red-50',
    [ActivityStatus.PENDING]: 'text-yellow-600 bg-yellow-50',
    [ActivityStatus.WARNING]: 'text-orange-600 bg-orange-50',
  }
  return colors[status] || 'text-gray-600 bg-gray-50'
}

export function formatAction(action: ActivityAction): string {
  return action.charAt(0).toUpperCase() + action.slice(1)
}

export function formatResource(resource: ActivityResource): string {
  return resource.charAt(0).toUpperCase() + resource.slice(1)
}

export function getActivityIcon(action: ActivityAction): string {
  const icons: Record<ActivityAction, string> = {
    [ActivityAction.CREATE]: 'PlusCircle',
    [ActivityAction.UPDATE]: 'Edit',
    [ActivityAction.DELETE]: 'Trash2',
    [ActivityAction.VIEW]: 'Eye',
    [ActivityAction.EXPORT]: 'Download',
    [ActivityAction.IMPORT]: 'Upload',
    [ActivityAction.LOGIN]: 'LogIn',
    [ActivityAction.LOGOUT]: 'LogOut',
    [ActivityAction.SHARE]: 'Share2',
    [ActivityAction.DOWNLOAD]: 'Download',
    [ActivityAction.UPLOAD]: 'Upload',
    [ActivityAction.APPROVE]: 'CheckCircle',
    [ActivityAction.REJECT]: 'XCircle',
    [ActivityAction.SUBMIT]: 'Send',
    [ActivityAction.ASSIGN]: 'UserPlus',
    [ActivityAction.COMMENT]: 'MessageSquare',
  }
  return icons[action] || 'Activity'
}
