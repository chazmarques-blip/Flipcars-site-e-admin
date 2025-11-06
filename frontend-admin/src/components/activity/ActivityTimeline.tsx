'use client'

import { Activity, getActionColor, formatAction, getActivityIcon } from '@/types/activity'
import { formatDistanceToNow } from 'date-fns'
import * as LucideIcons from 'lucide-react'

interface ActivityTimelineProps {
  activities: Activity[]
  onActivityClick?: (activity: Activity) => void
}

export default function ActivityTimeline({ activities, onActivityClick }: ActivityTimelineProps) {
  const getIcon = (iconName: string) => {
    const Icon = LucideIcons[iconName as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>
    return Icon ? <Icon className="w-4 h-4" /> : <LucideIcons.Activity className="w-4 h-4" />
  }

  const formatTimeAgo = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
    } catch {
      return 'Invalid date'
    }
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-12">
        <LucideIcons.Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No activities found</p>
      </div>
    )
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {activities.map((activity, index) => (
          <li key={activity.id}>
            <div className="relative pb-8">
              {/* Connecting line */}
              {index !== activities.length - 1 && (
                <span
                  className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              )}

              {/* Activity item */}
              <div className="relative flex items-start space-x-3">
                {/* Icon */}
                <div>
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center ring-8 ring-white ${getActionColor(
                      activity.action
                    )}`}
                  >
                    {getIcon(getActivityIcon(activity.action))}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div
                    className={`bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow ${
                      onActivityClick ? 'cursor-pointer hover:border-blue-300' : ''
                    }`}
                    onClick={() => onActivityClick?.(activity)}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getActionColor(activity.action)}`}>
                            {formatAction(activity.action)}
                          </span>
                          {activity.status === 'failed' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-red-600 bg-red-50">
                              Failed
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {activity.description}
                        </p>
                      </div>
                      <time className="flex-shrink-0 text-xs text-gray-500 ml-2">
                        {formatTimeAgo(activity.timestamp)}
                      </time>
                    </div>

                    {/* User info */}
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <LucideIcons.User className="w-4 h-4 mr-1.5" />
                      <span className="font-medium text-gray-700">
                        {activity.userName}
                      </span>
                      <span className="mx-2">•</span>
                      <span className="capitalize">{activity.userRole.replace('_', ' ')}</span>
                      {activity.ipAddress && (
                        <>
                          <span className="mx-2">•</span>
                          <span className="font-mono text-xs">{activity.ipAddress}</span>
                        </>
                      )}
                    </div>

                    {/* Resource info */}
                    {activity.resourceName && (
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <LucideIcons.FileText className="w-4 h-4 mr-1.5" />
                        <span className="capitalize">{activity.resource}</span>
                        <span className="mx-2">•</span>
                        <span className="font-medium text-gray-700">
                          {activity.resourceName}
                        </span>
                      </div>
                    )}

                    {/* Metadata preview */}
                    {activity.metadata?.changes && activity.metadata.changes.length > 0 && (
                      <div className="mt-2 text-xs text-gray-500">
                        <div className="flex items-center">
                          <LucideIcons.Edit3 className="w-3 h-3 mr-1.5" />
                          <span>
                            {activity.metadata.changes.length} field(s) changed
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
