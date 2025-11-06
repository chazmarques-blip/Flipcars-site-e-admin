'use client'

import { Activity, getActionColor, formatAction, formatResource } from '@/types/activity'
import { X, Calendar, User, FileText, MapPin, Clock, Code } from 'lucide-react'
import { format } from 'date-fns'

interface ActivityDetailsModalProps {
  activity: Activity | null
  onClose: () => void
}

export default function ActivityDetailsModal({
  activity,
  onClose,
}: ActivityDetailsModalProps) {
  if (!activity) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Activity Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Action & Status */}
            <div className="flex items-center space-x-3">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getActionColor(
                  activity.action
                )}`}
              >
                {formatAction(activity.action)}
              </span>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  activity.status === 'success'
                    ? 'bg-green-100 text-green-800'
                    : activity.status === 'failed'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {activity.status}
              </span>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Description
              </h3>
              <p className="text-base text-gray-900">{activity.description}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* User */}
              <div className="space-y-1">
                <div className="flex items-center text-sm text-gray-500">
                  <User className="w-4 h-4 mr-2" />
                  User
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {activity.userName}
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {activity.userRole.replace('_', ' ')}
                </div>
              </div>

              {/* Timestamp */}
              <div className="space-y-1">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  Timestamp
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {format(new Date(activity.timestamp), 'PPpp')}
                </div>
              </div>

              {/* Resource */}
              {activity.resourceName && (
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <FileText className="w-4 h-4 mr-2" />
                    Resource
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatResource(activity.resource)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {activity.resourceName}
                  </div>
                </div>
              )}

              {/* IP Address */}
              {activity.ipAddress && (
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-2" />
                    IP Address
                  </div>
                  <div className="text-sm font-medium text-gray-900 font-mono">
                    {activity.ipAddress}
                  </div>
                </div>
              )}

              {/* Duration */}
              {activity.metadata?.duration && (
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-2" />
                    Duration
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {activity.metadata.duration}ms
                  </div>
                </div>
              )}
            </div>

            {/* Changes */}
            {activity.metadata?.changes && activity.metadata.changes.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  Changes
                </h3>
                <div className="space-y-2">
                  {activity.metadata.changes.map((change, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                    >
                      <div className="text-sm font-medium text-gray-900 mb-2 capitalize">
                        {change.field}
                      </div>
                      <div className="flex items-center space-x-3 text-sm">
                        <div className="flex-1">
                          <div className="text-xs text-gray-500 mb-1">Old Value</div>
                          <div className="font-mono text-xs bg-red-50 text-red-900 px-2 py-1 rounded">
                            {String(change.oldValue)}
                          </div>
                        </div>
                        <div className="text-gray-400">→</div>
                        <div className="flex-1">
                          <div className="text-xs text-gray-500 mb-1">New Value</div>
                          <div className="font-mono text-xs bg-green-50 text-green-900 px-2 py-1 rounded">
                            {String(change.newValue)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            {activity.metadata && (
              <div>
                <h3 className="flex items-center text-sm font-medium text-gray-500 mb-3">
                  <Code className="w-4 h-4 mr-2" />
                  Technical Details
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <pre className="text-xs text-gray-700 overflow-x-auto">
                    {JSON.stringify(activity.metadata, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
