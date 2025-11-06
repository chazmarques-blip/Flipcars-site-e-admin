'use client'

import { useState } from 'react'
import { Star, Trash2, Edit, Play, MoreVertical } from 'lucide-react'
import { SavedSearch, SearchScope } from '@/types/search'

interface SavedSearchesProps {
  searches: SavedSearch[]
  onApply?: (search: SavedSearch) => void
  onEdit?: (search: SavedSearch) => void
  onDelete?: (searchId: string) => void
  onToggleDefault?: (searchId: string) => void
}

export function SavedSearches({
  searches,
  onApply,
  onEdit,
  onDelete,
  onToggleDefault,
}: SavedSearchesProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  const getScopeColor = (scope: SearchScope) => {
    const colors: Record<SearchScope, string> = {
      [SearchScope.ALL]: 'bg-gray-100 text-gray-800',
      [SearchScope.LEADS]: 'bg-blue-100 text-blue-800',
      [SearchScope.CUSTOMERS]: 'bg-green-100 text-green-800',
      [SearchScope.CLAIMS]: 'bg-red-100 text-red-800',
      [SearchScope.USERS]: 'bg-purple-100 text-purple-800',
      [SearchScope.FILES]: 'bg-orange-100 text-orange-800',
      [SearchScope.EMAILS]: 'bg-indigo-100 text-indigo-800',
    }
    return colors[scope]
  }

  if (searches.length === 0) {
    return (
      <div className="text-center py-12">
        <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No saved searches yet</p>
        <p className="text-sm text-gray-400 mt-1">
          Create and save custom searches for quick access
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {searches.map((search) => (
        <div
          key={search.id}
          className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
        >
          {/* Card Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-semibold text-gray-900 truncate">
                    {search.name}
                  </h3>
                  {search.isDefault && (
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                  )}
                </div>
                {search.description && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {search.description}
                  </p>
                )}
              </div>
              <div className="relative ml-2">
                <button
                  onClick={() => setActiveMenu(activeMenu === search.id ? null : search.id)}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                >
                  <MoreVertical className="h-5 w-5" />
                </button>
                {activeMenu === search.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-10">
                    {onEdit && (
                      <button
                        onClick={() => {
                          onEdit(search)
                          setActiveMenu(null)
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </button>
                    )}
                    {onToggleDefault && (
                      <button
                        onClick={() => {
                          onToggleDefault(search.id)
                          setActiveMenu(null)
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                      >
                        <Star className="h-4 w-4 mr-2" />
                        {search.isDefault ? 'Remove default' : 'Set as default'}
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete "${search.name}"?`)) {
                            onDelete(search.id)
                            setActiveMenu(null)
                          }
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600 flex items-center"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Scope Badge */}
            <div className="mt-3">
              <span className={`inline-block px-2 py-1 text-xs rounded-full ${getScopeColor(search.filter.scope)}`}>
                {search.filter.scope}
              </span>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-4">
            {/* Filter Summary */}
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-700 mb-2">Filters:</p>
              <div className="space-y-1">
                {search.filter.filterGroup.conditions.length > 0 && (
                  <p className="text-xs text-gray-600">
                    {search.filter.filterGroup.conditions.length} condition
                    {search.filter.filterGroup.conditions.length > 1 ? 's' : ''}
                  </p>
                )}
                {search.filter.query && (
                  <p className="text-xs text-gray-600">
                    Search: &quot;{search.filter.query}&quot;
                  </p>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
              <span>Used {search.usageCount} times</span>
              {search.lastUsed && (
                <span>
                  Last: {new Date(search.lastUsed).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              )}
            </div>

            {/* Apply Button */}
            {onApply && (
              <button
                onClick={() => onApply(search)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Play className="h-4 w-4" />
                <span>Apply Search</span>
              </button>
            )}
          </div>

          {/* Card Footer */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500">
            Created by {search.createdBy} on{' '}
            {new Date(search.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
