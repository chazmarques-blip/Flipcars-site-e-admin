'use client'

import { useState } from 'react'
import { useActivityStore } from '@/stores/activityStore'
import {
  ActivityTimeline,
  ActivityFilters,
  ActivityDetailsModal,
  ActivityStats,
} from '@/components/activity'
import { Activity } from '@/types/activity'
import { RefreshCw } from 'lucide-react'
import { ExportButton } from '@/components/export/ExportButton'
import { ExportColumn } from '@/types/export'

export default function ActivityPage() {
  const { getActivities, filters, setFilters, clearFilters } = useActivityStore()
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [view, setView] = useState<'timeline' | 'stats'>('timeline')

  const activities = getActivities()
  const filteredActivities = getActivities(filters)

  const handleRefresh = () => {
    // In production, this would refresh from API
    window.location.reload()
  }

  // Export columns configuration
  const exportColumns: ExportColumn[] = [
    { key: 'timestamp', label: 'Timestamp', format: (value) => new Date(value as string).toLocaleString() },
    { key: 'action', label: 'Action' },
    { key: 'resource', label: 'Resource' },
    { key: 'resourceName', label: 'Resource Name' },
    { key: 'description', label: 'Description' },
    { key: 'status', label: 'Status' },
    { key: 'userName', label: 'User Name' },
    { key: 'userRole', label: 'User Role' },
    { key: 'ipAddress', label: 'IP Address' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track all system activities and user actions
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {/* View Toggle */}
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setView('timeline')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                view === 'timeline'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setView('stats')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md border-t border-r border-b ${
                view === 'stats'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Statistics
            </button>
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>

          {/* Export Button */}
          <ExportButton
            data={filteredActivities}
            columns={exportColumns}
            filename="activity-log"
            title="Export Activity Log"
            description="Export filtered activity log data"
          />
        </div>
      </div>

      {/* Results count */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-blue-900">
              Showing <span className="font-bold">{filteredActivities.length}</span> of{' '}
              <span className="font-bold">{activities.length}</span> activities
            </span>
          </div>
          {Object.keys(filters).length > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <ActivityFilters
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
      />

      {/* Content */}
      {view === 'timeline' ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <ActivityTimeline
            activities={filteredActivities}
            onActivityClick={setSelectedActivity}
          />
        </div>
      ) : (
        <ActivityStats activities={filteredActivities} />
      )}

      {/* Details Modal */}
      <ActivityDetailsModal
        activity={selectedActivity}
        onClose={() => setSelectedActivity(null)}
      />
    </div>
  )
}
