'use client'

import { useRouter } from 'next/navigation'
import { Notification, NotificationType } from '@/types/notification'
import { useNotificationStore } from '@/stores/notificationStore'
import { formatRelativeTime } from '@/lib/utils/format'
import { X, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import clsx from 'clsx'

interface NotificationItemProps {
  notification: Notification
  onClose?: () => void
}

const typeIcons = {
  [NotificationType.INFO]: Info,
  [NotificationType.SUCCESS]: CheckCircle,
  [NotificationType.WARNING]: AlertTriangle,
  [NotificationType.ERROR]: XCircle,
}

const typeColors = {
  [NotificationType.INFO]: 'text-blue-600 bg-blue-100',
  [NotificationType.SUCCESS]: 'text-green-600 bg-green-100',
  [NotificationType.WARNING]: 'text-yellow-600 bg-yellow-100',
  [NotificationType.ERROR]: 'text-red-600 bg-red-100',
}

export function NotificationItem({ notification, onClose }: NotificationItemProps) {
  const router = useRouter()
  const markAsRead = useNotificationStore((state) => state.markAsRead)
  const deleteNotification = useNotificationStore((state) => state.deleteNotification)

  const Icon = typeIcons[notification.type]

  const handleClick = () => {
    if (!notification.read) {
      markAsRead(notification.id)
    }

    if (notification.actionUrl) {
      router.push(notification.actionUrl)
      onClose?.()
    }
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    deleteNotification(notification.id)
  }

  return (
    <div
      className={clsx(
        'p-4 hover:bg-gray-50 transition-colors cursor-pointer relative group',
        !notification.read && 'bg-blue-50/50'
      )}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick()
        }
      }}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div className={clsx('flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center', typeColors[notification.type])}>
          <Icon className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-medium text-gray-900 text-sm">
              {notification.title}
            </h4>

            {!notification.read && (
              <div
                className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-1"
                aria-label="Unread"
              />
            )}
          </div>

          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
            {notification.message}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {formatRelativeTime(notification.createdAt)}
            </span>

            {notification.actionUrl && (
              <span className="text-xs text-primary font-medium">
                View →
              </span>
            )}
          </div>
        </div>

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          className="flex-shrink-0 p-1 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 rounded transition-all focus:opacity-100"
          aria-label="Delete notification"
          title="Delete"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
