'use client'

import { useState } from 'react'
import { ThemeMode, ThemePreferences } from '@/types/settings'

interface AppearanceSettingsProps {
  preferences: ThemePreferences
  onSave: (preferences: ThemePreferences) => Promise<void>
}

export default function AppearanceSettings({
  preferences: initialPreferences,
  onSave,
}: AppearanceSettingsProps) {
  const [preferences, setPreferences] = useState(initialPreferences)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const handleThemeChange = (mode: ThemeMode) => {
    setPreferences({ ...preferences, mode })
    setHasChanges(true)
  }

  const handlePrimaryColorChange = (color: string) => {
    setPreferences({ ...preferences, primaryColor: color })
    setHasChanges(true)
  }

  const handleToggle = (field: 'compactMode' | 'sidebarCollapsed' | 'animations') => {
    setPreferences({ ...preferences, [field]: !preferences[field] })
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(preferences)
      setHasChanges(false)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setPreferences(initialPreferences)
    setHasChanges(false)
  }

  const colors = [
    { value: '#3B82F6', name: 'Blue' },
    { value: '#10B981', name: 'Green' },
    { value: '#8B5CF6', name: 'Purple' },
    { value: '#F59E0B', name: 'Orange' },
    { value: '#EF4444', name: 'Red' },
    { value: '#EC4899', name: 'Pink' },
    { value: '#14B8A6', name: 'Teal' },
    { value: '#6366F1', name: 'Indigo' },
  ]

  return (
    <div className="space-y-6">
      {/* Theme Mode */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Theme Mode</h3>
        <p className="text-sm text-gray-500 mb-4">
          Choose your preferred color theme
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              value: ThemeMode.LIGHT,
              label: 'Light',
              description: 'Light theme',
              icon: '☀️',
            },
            {
              value: ThemeMode.DARK,
              label: 'Dark',
              description: 'Dark theme',
              icon: '🌙',
            },
            {
              value: ThemeMode.AUTO,
              label: 'Auto',
              description: 'System default',
              icon: '🔄',
            },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleThemeChange(option.value)}
              className={`relative p-4 border rounded-lg text-left transition-colors ${
                preferences.mode === option.value
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-2xl mb-2">{option.icon}</div>
              <div className="text-sm font-medium text-gray-900">
                {option.label}
              </div>
              <div className="text-xs text-gray-500">{option.description}</div>
              {preferences.mode === option.value && (
                <div className="absolute top-2 right-2">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Color */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Primary Color</h3>
        <p className="text-sm text-gray-500 mb-4">
          Choose your preferred accent color
        </p>
        <div className="grid grid-cols-4 gap-3">
          {colors.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => handlePrimaryColorChange(color.value)}
              className="relative"
            >
              <div
                className={`w-full aspect-square rounded-lg transition-transform ${
                  preferences.primaryColor === color.value
                    ? 'ring-2 ring-offset-2 ring-gray-400 scale-95'
                    : 'hover:scale-95'
                }`}
                style={{ backgroundColor: color.value }}
              >
                {preferences.primaryColor === color.value && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white drop-shadow-lg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-600 text-center mt-1">
                {color.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Display Options */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Display Options
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Customize how the interface looks and behaves
        </p>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-900">
                Compact Mode
              </div>
              <div className="text-sm text-gray-500">
                Reduce spacing and padding for a denser layout
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('compactMode')}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                preferences.compactMode ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  preferences.compactMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </label>

          <label className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-900">
                Sidebar Collapsed
              </div>
              <div className="text-sm text-gray-500">
                Keep the sidebar collapsed by default
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('sidebarCollapsed')}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                preferences.sidebarCollapsed ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  preferences.sidebarCollapsed ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </label>

          <label className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-900">
                Enable Animations
              </div>
              <div className="text-sm text-gray-500">
                Show transitions and animations throughout the app
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('animations')}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                preferences.animations ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  preferences.animations ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      {hasChanges && (
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSaving}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  )
}
