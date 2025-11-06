'use client'

import { useState } from 'react'
import {
  ActivityAction,
  ActivityResource,
  ActivityStatus,
  ActivityFilter,
  formatAction,
  formatResource,
} from '@/types/activity'
import { X, Filter } from 'lucide-react'

interface ActivityFiltersProps {
  filters: ActivityFilter
  onFiltersChange: (filters: ActivityFilter) => void
  onClearFilters: () => void
}

export default function ActivityFilters({
  filters,
  onFiltersChange,
  onClearFilters,
}: ActivityFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleActionToggle = (action: ActivityAction) => {
    const actions = filters.actions || []
    const newActions = actions.includes(action)
      ? actions.filter((a) => a !== action)
      : [...actions, action]
    onFiltersChange({ ...filters, actions: newActions.length > 0 ? newActions : undefined })
  }

  const handleResourceToggle = (resource: ActivityResource) => {
    const resources = filters.resources || []
    const newResources = resources.includes(resource)
      ? resources.filter((r) => r !== resource)
      : [...resources, resource]
    onFiltersChange({ ...filters, resources: newResources.length > 0 ? newResources : undefined })
  }

  const handleStatusToggle = (status: ActivityStatus) => {
    const statuses = filters.statuses || []
    const newStatuses = statuses.includes(status)
      ? statuses.filter((s) => s !== status)
      : [...statuses, status]
    onFiltersChange({ ...filters, statuses: newStatuses.length > 0 ? newStatuses : undefined })
  }

  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search: search || undefined })
  }

  const handleDateChange = (field: 'dateFrom' | 'dateTo', value: string) => {
    onFiltersChange({ ...filters, [field]: value || undefined })
  }

  const activeFilterCount = 
    (filters.actions?.length || 0) +
    (filters.resources?.length || 0) +
    (filters.statuses?.length || 0) +
    (filters.dateFrom ? 1 : 0) +
    (filters.dateTo ? 1 : 0) +
    (filters.search ? 1 : 0)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {activeFilterCount}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {activeFilterCount > 0 && (
            <button
              onClick={onClearFilters}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Clear all
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {isExpanded ? 'Hide' : 'Show'} filters
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search activities..."
          value={filters.search || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Expanded filters */}
      {isExpanded && (
        <div className="space-y-4">
          {/* Date range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => handleDateChange('dateFrom', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={filters.dateTo || ''}
                onChange={(e) => handleDateChange('dateTo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Actions
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.values(ActivityAction).map((action) => (
                <button
                  key={action}
                  onClick={() => handleActionToggle(action)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filters.actions?.includes(action)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {formatAction(action)}
                </button>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resources
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.values(ActivityResource).map((resource) => (
                <button
                  key={resource}
                  onClick={() => handleResourceToggle(resource)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filters.resources?.includes(resource)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {formatResource(resource)}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.values(ActivityStatus).map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusToggle(status)}
                  className={`px-3 py-1 rounded-full text-sm font-medium capitalize transition-colors ${
                    filters.statuses?.includes(status)
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active filters chips */}
      {activeFilterCount > 0 && !isExpanded && (
        <div className="flex flex-wrap gap-2 mt-3">
          {filters.actions?.map((action) => (
            <span
              key={action}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
            >
              {formatAction(action)}
              <button
                onClick={() => handleActionToggle(action)}
                className="ml-1 hover:text-blue-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {filters.resources?.map((resource) => (
            <span
              key={resource}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800"
            >
              {formatResource(resource)}
              <button
                onClick={() => handleResourceToggle(resource)}
                className="ml-1 hover:text-green-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {filters.statuses?.map((status) => (
            <span
              key={status}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800 capitalize"
            >
              {status}
              <button
                onClick={() => handleStatusToggle(status)}
                className="ml-1 hover:text-purple-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
