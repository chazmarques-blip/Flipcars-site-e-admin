'use client'

import { useState } from 'react'
import {
  NotificationChannel,
  NotificationFrequency,
  NotificationPreferences,
} from '@/types/settings'

interface NotificationSettingsProps {
  preferences: NotificationPreferences
  onSave: (preferences: NotificationPreferences) => Promise<void>
}

export default function NotificationSettings({
  preferences: initialPreferences,
  onSave,
}: NotificationSettingsProps) {
  const [preferences, setPreferences] = useState(initialPreferences)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const handleChannelToggle = (channel: NotificationChannel) => {
    const channels = preferences.channels.includes(channel)
      ? preferences.channels.filter((c) => c !== channel)
      : [...preferences.channels, channel]

    setPreferences({ ...preferences, channels })
    setHasChanges(true)
  }

  const handleNotificationTypeToggle = (type: string) => {
    const types = { ...preferences.notificationTypes }
    types[type] = !types[type]
    setPreferences({ ...preferences, notificationTypes: types })
    setHasChanges(true)
  }

  const handleFrequencyChange = (frequency: NotificationFrequency) => {
    setPreferences({ ...preferences, frequency })
    setHasChanges(true)
  }

  const handleQuietHoursChange = (field: 'start' | 'end', value: string) => {
    const quietHours = {
      ...preferences.quietHours,
      [field]: value,
    }
    setPreferences({ ...preferences, quietHours })
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

  return (
    <div className="space-y-6">
      {/* Notification Channels */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Notification Channels
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Choose how you want to receive notifications
        </p>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={preferences.channels.includes(NotificationChannel.EMAIL)}
              onChange={() => handleChannelToggle(NotificationChannel.EMAIL)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-3 text-sm text-gray-700">
              <span className="font-medium">Email Notifications</span>
              <span className="block text-gray-500">
                Receive notifications via email
              </span>
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={preferences.channels.includes(NotificationChannel.PUSH)}
              onChange={() => handleChannelToggle(NotificationChannel.PUSH)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-3 text-sm text-gray-700">
              <span className="font-medium">Push Notifications</span>
              <span className="block text-gray-500">
                Receive browser push notifications
              </span>
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={preferences.channels.includes(NotificationChannel.IN_APP)}
              onChange={() => handleChannelToggle(NotificationChannel.IN_APP)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-3 text-sm text-gray-700">
              <span className="font-medium">In-App Notifications</span>
              <span className="block text-gray-500">
                Show notifications in the app
              </span>
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={preferences.channels.includes(NotificationChannel.SMS)}
              onChange={() => handleChannelToggle(NotificationChannel.SMS)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-3 text-sm text-gray-700">
              <span className="font-medium">SMS Notifications</span>
              <span className="block text-gray-500">
                Receive important alerts via SMS (Pro feature)
              </span>
            </span>
          </label>
        </div>
      </div>

      {/* Notification Frequency */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Notification Frequency
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          How often do you want to receive notifications?
        </p>
        <div className="space-y-2">
          {[
            {
              value: NotificationFrequency.REAL_TIME,
              label: 'Real-time',
              description: 'Get notified immediately',
            },
            {
              value: NotificationFrequency.HOURLY,
              label: 'Hourly',
              description: 'Get a summary every hour',
            },
            {
              value: NotificationFrequency.DAILY,
              label: 'Daily',
              description: 'Get a daily digest',
            },
            {
              value: NotificationFrequency.WEEKLY,
              label: 'Weekly',
              description: 'Get a weekly summary',
            },
          ].map((option) => (
            <label key={option.value} className="flex items-center">
              <input
                type="radio"
                name="frequency"
                value={option.value}
                checked={preferences.frequency === option.value}
                onChange={() => handleFrequencyChange(option.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-3 text-sm text-gray-700">
                <span className="font-medium">{option.label}</span>
                <span className="block text-gray-500">{option.description}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Notification Types */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Notification Types
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Choose what you want to be notified about
        </p>
        <div className="space-y-3">
          {[
            { key: 'leadUpdates', label: 'Lead Updates', description: 'New leads and status changes' },
            { key: 'customerUpdates', label: 'Customer Updates', description: 'Customer activity and changes' },
            { key: 'claimUpdates', label: 'Claim Updates', description: 'Claim submissions and approvals' },
            { key: 'systemAlerts', label: 'System Alerts', description: 'Important system notifications' },
            { key: 'taskReminders', label: 'Task Reminders', description: 'Upcoming tasks and deadlines' },
            { key: 'weeklyReports', label: 'Weekly Reports', description: 'Weekly performance summaries' },
          ].map((type) => (
            <label key={type.key} className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.notificationTypes[type.key] ?? true}
                onChange={() => handleNotificationTypeToggle(type.key)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-3 text-sm text-gray-700">
                <span className="font-medium">{type.label}</span>
                <span className="block text-gray-500">{type.description}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Quiet Hours */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Quiet Hours</h3>
        <p className="text-sm text-gray-500 mb-4">
          Set times when you don&apos;t want to receive notifications
        </p>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Time
            </label>
            <input
              type="time"
              value={preferences.quietHours.start}
              onChange={(e) => handleQuietHoursChange('start', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Time
            </label>
            <input
              type="time"
              value={preferences.quietHours.end}
              onChange={(e) => handleQuietHoursChange('end', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Notifications will be paused during these hours
        </p>
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
