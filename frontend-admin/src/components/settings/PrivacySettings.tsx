'use client'

import { useState } from 'react'
import { PrivacySettings as PrivacySettingsType } from '@/types/settings'

interface PrivacySettingsProps {
  settings: PrivacySettingsType
  onSave: (settings: PrivacySettingsType) => Promise<void>
}

export default function PrivacySettings({
  settings: initialSettings,
  onSave,
}: PrivacySettingsProps) {
  const [settings, setSettings] = useState(initialSettings)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const handleToggle = (field: keyof PrivacySettingsType) => {
    setSettings({ ...settings, [field]: !settings[field] })
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(settings)
      setHasChanges(false)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setSettings(initialSettings)
    setHasChanges(false)
  }

  return (
    <div className="space-y-6">
      {/* Profile Visibility */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Profile Visibility
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Control who can see your profile information
        </p>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-900">
                Show Profile to Team
              </div>
              <div className="text-sm text-gray-500">
                Allow team members to view your profile
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('profileVisibleToTeam')}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                settings.profileVisibleToTeam ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings.profileVisibleToTeam
                    ? 'translate-x-5'
                    : 'translate-x-0'
                }`}
              />
            </button>
          </label>

          <label className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-900">
                Show Email Address
              </div>
              <div className="text-sm text-gray-500">
                Display your email address on your profile
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('showEmailAddress')}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                settings.showEmailAddress ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings.showEmailAddress ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </label>

          <label className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-900">
                Show Phone Number
              </div>
              <div className="text-sm text-gray-500">
                Display your phone number on your profile
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('showPhoneNumber')}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                settings.showPhoneNumber ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings.showPhoneNumber ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </label>
        </div>
      </div>

      {/* Data Sharing */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Data Sharing</h3>
        <p className="text-sm text-gray-500 mb-4">
          Control how your data is used and shared
        </p>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-900">
                Share Data for Analytics
              </div>
              <div className="text-sm text-gray-500">
                Help us improve by sharing anonymous usage data
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('shareDataForAnalytics')}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                settings.shareDataForAnalytics ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings.shareDataForAnalytics
                    ? 'translate-x-5'
                    : 'translate-x-0'
                }`}
              />
            </button>
          </label>

          <label className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-900">
                Marketing Emails
              </div>
              <div className="text-sm text-gray-500">
                Receive emails about new features and updates
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('allowMarketingEmails')}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                settings.allowMarketingEmails ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings.allowMarketingEmails
                    ? 'translate-x-5'
                    : 'translate-x-0'
                }`}
              />
            </button>
          </label>
        </div>
      </div>

      {/* Data Management */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Data Management
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Manage your personal data and account
        </p>
        <div className="space-y-3">
          <button
            type="button"
            className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="text-sm font-medium text-gray-900">
              Download Your Data
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Export all your personal data in a readable format
            </div>
          </button>

          <button
            type="button"
            className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="text-sm font-medium text-gray-900">
              Request Data Deletion
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Request permanent deletion of your personal data
            </div>
          </button>
        </div>
      </div>

      {/* Account Security */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Account Security
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Review your account security status
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
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
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Your account is secure
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Strong password set</li>
                  <li>Email verified</li>
                  <li>Last login: 2 hours ago</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-red-600 mb-2">Danger Zone</h3>
        <p className="text-sm text-gray-500 mb-4">
          Irreversible account actions
        </p>
        <button
          type="button"
          className="px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Delete Account
        </button>
        <p className="mt-2 text-xs text-gray-500">
          Once you delete your account, there is no going back. Please be
          certain.
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
