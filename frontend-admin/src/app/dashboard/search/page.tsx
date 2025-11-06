'use client'

import { useState } from 'react'
import { 
  Search as SearchIcon, 
  Filter, 
  Save, 
  Star,
  Download,
} from 'lucide-react'
import { GlobalSearch, FilterBuilder, SavedSearches } from '@/components/search'
import {
  SearchScope,
  SavedSearch,
  FilterGroup,
  FilterLogic,
  getFilterFieldsByScope,
} from '@/types/search'

// Mock saved searches
const mockSavedSearches: SavedSearch[] = [
  {
    id: '1',
    name: 'New Leads This Week',
    description: 'All new leads created in the last 7 days',
    scope: SearchScope.LEADS,
    filter: {
      id: 'filter-1',
      name: 'New Leads Filter',
      scope: SearchScope.LEADS,
      filterGroup: {
        id: 'group-1',
        logic: FilterLogic.AND,
        conditions: [
          {
            id: 'cond-1',
            field: 'status',
            operator: 'equals' as any,
            value: 'new',
          },
        ],
      },
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-10T10:00:00Z',
    },
    isDefault: true,
    createdBy: 'Admin User',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z',
    usageCount: 45,
    lastUsed: '2024-01-15T14:30:00Z',
  },
  {
    id: '2',
    name: 'VIP Customers',
    description: 'Active customers with VIP status and 5+ purchases',
    scope: SearchScope.CUSTOMERS,
    filter: {
      id: 'filter-2',
      name: 'VIP Filter',
      scope: SearchScope.CUSTOMERS,
      filterGroup: {
        id: 'group-2',
        logic: FilterLogic.AND,
        conditions: [
          {
            id: 'cond-2',
            field: 'status',
            operator: 'equals' as any,
            value: 'vip',
          },
        ],
      },
      createdAt: '2024-01-08T09:00:00Z',
      updatedAt: '2024-01-08T09:00:00Z',
    },
    createdBy: 'Manager User',
    createdAt: '2024-01-08T09:00:00Z',
    updatedAt: '2024-01-12T11:20:00Z',
    usageCount: 32,
    lastUsed: '2024-01-14T16:45:00Z',
  },
  {
    id: '3',
    name: 'Pending Claims',
    description: 'Claims with pending or in review status',
    scope: SearchScope.CLAIMS,
    filter: {
      id: 'filter-3',
      name: 'Pending Claims Filter',
      scope: SearchScope.CLAIMS,
      filterGroup: {
        id: 'group-3',
        logic: FilterLogic.OR,
        conditions: [
          {
            id: 'cond-3',
            field: 'status',
            operator: 'in' as any,
            value: ['pending', 'in_review'],
          },
        ],
      },
      createdAt: '2024-01-05T08:00:00Z',
      updatedAt: '2024-01-05T08:00:00Z',
    },
    createdBy: 'Admin User',
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-01-13T10:15:00Z',
    usageCount: 28,
    lastUsed: '2024-01-15T09:30:00Z',
  },
]

type TabType = 'search' | 'filters' | 'saved'

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState<TabType>('search')
  const [scope, setScope] = useState<SearchScope>(SearchScope.ALL)
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(mockSavedSearches)
  const [filterGroup, setFilterGroup] = useState<FilterGroup>({
    id: 'root',
    logic: FilterLogic.AND,
    conditions: [],
  })
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [saveName, setSaveName] = useState('')
  const [saveDescription, setSaveDescription] = useState('')

  const fields = getFilterFieldsByScope(scope)

  const handleApplySearch = (search: SavedSearch) => {
    setScope(search.filter.scope)
    setFilterGroup(search.filter.filterGroup)
    setActiveTab('filters')
    
    // Update usage stats
    setSavedSearches((prev) =>
      prev.map((s) =>
        s.id === search.id
          ? {
              ...s,
              usageCount: s.usageCount + 1,
              lastUsed: new Date().toISOString(),
            }
          : s
      )
    )
  }

  const handleSaveSearch = () => {
    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name: saveName,
      description: saveDescription,
      scope,
      filter: {
        id: `filter-${Date.now()}`,
        name: saveName,
        scope,
        filterGroup,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      createdBy: 'Current User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0,
    }

    setSavedSearches((prev) => [newSearch, ...prev])
    setShowSaveDialog(false)
    setSaveName('')
    setSaveDescription('')
    setActiveTab('saved')
  }

  const handleDeleteSearch = (searchId: string) => {
    setSavedSearches((prev) => prev.filter((s) => s.id !== searchId))
  }

  const handleToggleDefault = (searchId: string) => {
    setSavedSearches((prev) =>
      prev.map((s) => ({
        ...s,
        isDefault: s.id === searchId ? !s.isDefault : false,
      }))
    )
  }

  const handleExportResults = () => {
    alert('Export functionality will be implemented in the next feature!')
  }

  const hasActiveFilters = filterGroup.conditions.length > 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Advanced Search</h1>
          <p className="text-gray-500 mt-1">
            Search and filter across all your data
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {hasActiveFilters && (
            <button
              onClick={() => setShowSaveDialog(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Save className="h-5 w-5" />
              <span>Save Search</span>
            </button>
          )}
          <button
            onClick={handleExportResults}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-5 w-5" />
            <span>Export Results</span>
          </button>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="bg-white rounded-lg border p-6">
        <GlobalSearch
          onSearch={(query, searchScope) => {
            console.log('Search:', query, searchScope)
          }}
          onResultClick={(result) => {
            console.log('Result clicked:', result)
          }}
        />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('search')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'search'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <SearchIcon className="h-4 w-4" />
                <span>Quick Search</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('filters')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'filters'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>Advanced Filters</span>
                {hasActiveFilters && (
                  <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {filterGroup.conditions.length}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'saved'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4" />
                <span>Saved Searches</span>
                <span className="ml-1 px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                  {savedSearches.length}
                </span>
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Quick Search Tab */}
          {activeTab === 'search' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Use the search bar above for quick searches across all data, or switch to Advanced Filters for more precise control.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">Global Search</h3>
                  <p className="text-sm text-blue-700">
                    Search across all entities including leads, customers, claims, and more
                  </p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-medium text-green-900 mb-2">Recent Searches</h3>
                  <p className="text-sm text-green-700">
                    Access your search history and quickly re-run previous searches
                  </p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-medium text-purple-900 mb-2">Scoped Search</h3>
                  <p className="text-sm text-purple-700">
                    Filter by specific entity types for more focused results
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Advanced Filters Tab */}
          {activeTab === 'filters' && (
            <div className="space-y-6">
              {/* Scope Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Scope
                </label>
                <select
                  value={scope}
                  onChange={(e) => {
                    setScope(e.target.value as SearchScope)
                    // Reset filters when scope changes
                    setFilterGroup({
                      id: 'root',
                      logic: FilterLogic.AND,
                      conditions: [],
                    })
                  }}
                  className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={SearchScope.LEADS}>Leads</option>
                  <option value={SearchScope.CUSTOMERS}>Customers</option>
                  <option value={SearchScope.CLAIMS}>Claims</option>
                  <option value={SearchScope.USERS}>Users</option>
                  <option value={SearchScope.FILES}>Files</option>
                  <option value={SearchScope.EMAILS}>Emails</option>
                </select>
              </div>

              {/* Filter Builder */}
              {fields.length > 0 ? (
                <FilterBuilder
                  fields={fields}
                  filterGroup={filterGroup}
                  onChange={setFilterGroup}
                />
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">
                    Select a scope to start building filters
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              {hasActiveFilters && (
                <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={() =>
                      setFilterGroup({
                        id: 'root',
                        logic: FilterLogic.AND,
                        conditions: [],
                      })
                    }
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Clear Filters
                  </button>
                  <button
                    onClick={() => alert('Search with current filters')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Apply Filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Saved Searches Tab */}
          {activeTab === 'saved' && (
            <SavedSearches
              searches={savedSearches}
              onApply={handleApplySearch}
              onDelete={handleDeleteSearch}
              onToggleDefault={handleToggleDefault}
            />
          )}
        </div>
      </div>

      {/* Save Search Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowSaveDialog(false)}
          />
          <div className="relative h-full flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Save Search</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search Name *
                  </label>
                  <input
                    type="text"
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    placeholder="e.g., High Priority Leads"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (optional)
                  </label>
                  <textarea
                    value={saveDescription}
                    onChange={(e) => setSaveDescription(e.target.value)}
                    placeholder="Brief description of this search..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSearch}
                  disabled={!saveName.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Search
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
