'use client'

import { useNotificationStore } from '@/stores/notificationStore'
import { NotificationItem } from './NotificationItem'
import { Button } from '@/components/ui/Button'
import { CheckCheck, Trash2 } from 'lucide-react'

interface NotificationListProps {
  onClose?: () => void
}

export function NotificationList({ onClose }: NotificationListProps) {
  const notifications = useNotificationStore((state) => state.notifications)
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead)
  const clearAll = useNotificationStore((state) => state.clearAll)
  const stats = useNotificationStore((state) => state.stats)

  const hasUnread = (stats?.unread || 0) > 0

  return (
    <div className="flex flex-col max-h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          {stats && (
            <p className="text-sm text-gray-500">
              {stats.unread > 0 ? `${stats.unread} unread` : 'All caught up!'}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          {hasUnread && (
            <button
              onClick={markAllAsRead}
              className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
              title="Mark all as read"
              aria-label="Mark all as read"
            >
              <CheckCheck className="w-5 h-5" />
            </button>
          )}

          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Clear all"
              aria-label="Clear all notifications"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Notification List */}
      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <CheckCheck className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">No notifications</p>
            <p className="text-sm text-gray-500 mt-1">
              You&apos;re all caught up! We&apos;ll notify you when something happens.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClose={onClose}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-200">
          <Button
            variant="ghost"
            fullWidth
            size="sm"
            onClick={() => {
              // TODO: Navigate to notifications page
              onClose?.()
            }}
          >
            View All Notifications
          </Button>
        </div>
      )}
    </div>
  )
}
