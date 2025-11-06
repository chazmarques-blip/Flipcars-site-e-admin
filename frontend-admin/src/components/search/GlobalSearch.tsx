'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, Clock, TrendingUp } from 'lucide-react'
import { SearchScope, SearchResult, SearchHistory } from '@/types/search'

interface GlobalSearchProps {
  onSearch?: (query: string, scope: SearchScope) => void
  onResultClick?: (result: SearchResult) => void
}

export function GlobalSearch({ onSearch, onResultClick }: GlobalSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [scope, setScope] = useState<SearchScope>(SearchScope.ALL)
  const [results, setResults] = useState<SearchResult[]>([])
  const [recentSearches, setRecentSearches] = useState<SearchHistory[]>([])
  const [isSearching, setIsSearching] = useState(false)
  
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recent-searches')
    if (stored) {
      setRecentSearches(JSON.parse(stored))
    }
  }, [])

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Mock search function
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsSearching(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300))

    // Mock results
    const mockResults: SearchResult[] = [
      {
        id: '1',
        type: SearchScope.LEADS,
        title: 'John Doe - Toyota Camry Inquiry',
        description: 'New lead from website, interested in 2023 Toyota Camry',
        score: 0.95,
        data: { id: '1', name: 'John Doe' },
      },
      {
        id: '2',
        type: SearchScope.CUSTOMERS,
        title: 'Jane Smith',
        description: 'Active customer, 3 purchases, VIP status',
        score: 0.89,
        data: { id: '2', name: 'Jane Smith' },
      },
      {
        id: '3',
        type: SearchScope.CLAIMS,
        title: 'Claim #CLM-001',
        description: 'Pending claim for vehicle damage, filed on 2024-01-15',
        score: 0.76,
        data: { id: '3', claimNumber: 'CLM-001' },
      },
    ].filter(r => 
      scope === SearchScope.ALL || r.type === scope
    )

    setResults(mockResults)
    setIsSearching(false)

    // Save to recent searches
    const newSearch: SearchHistory = {
      id: Date.now().toString(),
      query: searchQuery,
      scope,
      timestamp: new Date().toISOString(),
      resultsCount: mockResults.length,
    }
    
    const updated = [newSearch, ...recentSearches.slice(0, 9)]
    setRecentSearches(updated)
    localStorage.setItem('recent-searches', JSON.stringify(updated))

    onSearch?.(searchQuery, scope)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(query)
  }

  const handleResultClick = (result: SearchResult) => {
    onResultClick?.(result)
    setIsOpen(false)
    setQuery('')
    setResults([])
  }

  const handleRecentSearchClick = (search: SearchHistory) => {
    setQuery(search.query)
    setScope(search.scope)
    performSearch(search.query)
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recent-searches')
  }

  const getScopeColor = (scopeType: SearchScope) => {
    const colors: Record<SearchScope, string> = {
      [SearchScope.ALL]: 'bg-gray-100 text-gray-800',
      [SearchScope.LEADS]: 'bg-blue-100 text-blue-800',
      [SearchScope.CUSTOMERS]: 'bg-green-100 text-green-800',
      [SearchScope.CLAIMS]: 'bg-red-100 text-red-800',
      [SearchScope.USERS]: 'bg-purple-100 text-purple-800',
      [SearchScope.FILES]: 'bg-orange-100 text-orange-800',
      [SearchScope.EMAILS]: 'bg-indigo-100 text-indigo-800',
    }
    return colors[scopeType]
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            if (e.target.value) {
              performSearch(e.target.value)
            } else {
              setResults([])
            }
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search leads, customers, claims..."
          className="w-full pl-10 pr-24 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        {/* Scope Selector */}
        <select
          value={scope}
          onChange={(e) => setScope(e.target.value as SearchScope)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 text-sm border-l border-gray-300 focus:outline-none"
        >
          <option value={SearchScope.ALL}>All</option>
          <option value={SearchScope.LEADS}>Leads</option>
          <option value={SearchScope.CUSTOMERS}>Customers</option>
          <option value={SearchScope.CLAIMS}>Claims</option>
          <option value={SearchScope.USERS}>Users</option>
          <option value={SearchScope.FILES}>Files</option>
          <option value={SearchScope.EMAILS}>Emails</option>
        </select>

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setResults([])
              inputRef.current?.focus()
            }}
            className="absolute right-24 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50">
          {/* Results */}
          {results.length > 0 && (
            <div className="p-2">
              <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                Search Results ({results.length})
              </h3>
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {result.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {result.description}
                      </p>
                    </div>
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full flex-shrink-0 ${getScopeColor(result.type)}`}>
                      {result.type}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Loading */}
          {isSearching && (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
              <p className="text-sm text-gray-500 mt-2">Searching...</p>
            </div>
          )}

          {/* No Results */}
          {query && !isSearching && results.length === 0 && (
            <div className="p-8 text-center">
              <Search className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No results found</p>
            </div>
          )}

          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <div className="p-2">
              <div className="flex items-center justify-between px-3 py-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Recent Searches
                </h3>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Clear
                </button>
              </div>
              {recentSearches.slice(0, 5).map((search) => (
                <button
                  key={search.id}
                  onClick={() => handleRecentSearchClick(search)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{search.query}</p>
                      <p className="text-xs text-gray-500">
                        {search.resultsCount} results
                      </p>
                    </div>
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getScopeColor(search.scope)}`}>
                      {search.scope}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!query && recentSearches.length === 0 && (
            <div className="p-8 text-center">
              <TrendingUp className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Start typing to search</p>
              <p className="text-xs text-gray-400 mt-1">
                Search across leads, customers, claims, and more
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
