'use client'

import { useState } from 'react'
import {
  Language,
  DateFormat,
  TimeFormat,
  LanguagePreferences,
  TIMEZONES,
  CURRENCIES,
} from '@/types/settings'

interface LanguageSettingsProps {
  preferences: LanguagePreferences
  onSave: (preferences: LanguagePreferences) => Promise<void>
}

export default function LanguageSettings({
  preferences: initialPreferences,
  onSave,
}: LanguageSettingsProps) {
  const [preferences, setPreferences] = useState(initialPreferences)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const handleChange = (field: keyof LanguagePreferences, value: string) => {
    setPreferences({ ...preferences, [field]: value })
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

  const languages = [
    { value: Language.EN_US, label: 'English (US)', flag: '🇺🇸' },
    { value: Language.EN_GB, label: 'English (UK)', flag: '🇬🇧' },
    { value: Language.PT_BR, label: 'Português (Brasil)', flag: '🇧🇷' },
    { value: Language.ES_ES, label: 'Español (España)', flag: '🇪🇸' },
    { value: Language.FR_FR, label: 'Français (France)', flag: '🇫🇷' },
    { value: Language.DE_DE, label: 'Deutsch (Deutschland)', flag: '🇩🇪' },
  ]

  const dateFormats = [
    { value: DateFormat.MM_DD_YYYY, label: 'MM/DD/YYYY', example: '12/31/2024' },
    { value: DateFormat.DD_MM_YYYY, label: 'DD/MM/YYYY', example: '31/12/2024' },
    { value: DateFormat.YYYY_MM_DD, label: 'YYYY-MM-DD', example: '2024-12-31' },
  ]

  const timeFormats = [
    { value: TimeFormat.H_12, label: '12-hour', example: '11:30 PM' },
    { value: TimeFormat.H_24, label: '24-hour', example: '23:30' },
  ]

  // Get current date/time for preview
  const now = new Date()
  const previewDate = (() => {
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const year = now.getFullYear()

    switch (preferences.dateFormat) {
      case DateFormat.MM_DD_YYYY:
        return `${month}/${day}/${year}`
      case DateFormat.DD_MM_YYYY:
        return `${day}/${month}/${year}`
      case DateFormat.YYYY_MM_DD:
        return `${year}-${month}-${day}`
      default:
        return `${month}/${day}/${year}`
    }
  })()

  const previewTime = (() => {
    const hours = now.getHours()
    const minutes = String(now.getMinutes()).padStart(2, '0')

    if (preferences.timeFormat === TimeFormat.H_12) {
      const period = hours >= 12 ? 'PM' : 'AM'
      const hour12 = hours % 12 || 12
      return `${hour12}:${minutes} ${period}`
    } else {
      return `${String(hours).padStart(2, '0')}:${minutes}`
    }
  })()

  return (
    <div className="space-y-6">
      {/* Language */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Language</h3>
        <p className="text-sm text-gray-500 mb-4">
          Select your preferred language for the interface
        </p>
        <select
          value={preferences.language}
          onChange={(e) => handleChange('language', e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          {languages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.flag} {lang.label}
            </option>
          ))}
        </select>
      </div>

      {/* Timezone */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Timezone</h3>
        <p className="text-sm text-gray-500 mb-4">
          Choose your timezone for accurate time displays
        </p>
        <select
          value={preferences.timezone}
          onChange={(e) => handleChange('timezone', e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          {TIMEZONES.map((tz) => (
            <option key={tz.value} value={tz.value}>
              {tz.label}
            </option>
          ))}
        </select>
      </div>

      {/* Date Format */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Date Format</h3>
        <p className="text-sm text-gray-500 mb-4">
          Choose how dates are displayed
        </p>
        <div className="space-y-2">
          {dateFormats.map((format) => (
            <label key={format.value} className="flex items-center">
              <input
                type="radio"
                name="dateFormat"
                value={format.value}
                checked={preferences.dateFormat === format.value}
                onChange={(e) => handleChange('dateFormat', e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-3 text-sm text-gray-700">
                <span className="font-medium">{format.label}</span>
                <span className="text-gray-500 ml-2">({format.example})</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Time Format */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Time Format</h3>
        <p className="text-sm text-gray-500 mb-4">
          Choose how times are displayed
        </p>
        <div className="space-y-2">
          {timeFormats.map((format) => (
            <label key={format.value} className="flex items-center">
              <input
                type="radio"
                name="timeFormat"
                value={format.value}
                checked={preferences.timeFormat === format.value}
                onChange={(e) => handleChange('timeFormat', e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-3 text-sm text-gray-700">
                <span className="font-medium">{format.label}</span>
                <span className="text-gray-500 ml-2">({format.example})</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Currency */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Currency</h3>
        <p className="text-sm text-gray-500 mb-4">
          Select your preferred currency
        </p>
        <select
          value={preferences.currency}
          onChange={(e) => handleChange('currency', e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          {CURRENCIES.map((currency) => (
            <option key={currency.code} value={currency.code}>
              {currency.symbol} {currency.name} ({currency.code})
            </option>
          ))}
        </select>
      </div>

      {/* Preview */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Preview</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <div>
            <span className="text-gray-500">Date:</span>{' '}
            <span className="font-medium">{previewDate}</span>
          </div>
          <div>
            <span className="text-gray-500">Time:</span>{' '}
            <span className="font-medium">{previewTime}</span>
          </div>
          <div>
            <span className="text-gray-500">Currency:</span>{' '}
            <span className="font-medium">
              {CURRENCIES.find((c) => c.code === preferences.currency)?.symbol}
              1,234.56
            </span>
          </div>
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
