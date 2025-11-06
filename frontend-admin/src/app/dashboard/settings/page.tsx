'use client'

import { useState } from 'react'
import {
  ProfileSettings,
  SecuritySettings,
  NotificationSettings,
  AppearanceSettings,
  LanguageSettings,
  PrivacySettings,
} from '@/components/settings'
import {
  UserPreferences,
  NotificationChannel,
  NotificationFrequency,
  ThemeMode,
  Language,
  DateFormat,
  TimeFormat,
  SETTINGS_SECTIONS,
} from '@/types/settings'
import { useAuthStore } from '@/stores/authStore'

type SettingSectionId =
  | 'profile'
  | 'security'
  | 'notifications'
  | 'appearance'
  | 'language'
  | 'privacy'

export default function SettingsPage() {
  const { user } = useAuthStore()
  const [activeSection, setActiveSection] = useState<SettingSectionId>('profile')

  // Mock user preferences - in production, these would come from an API
  const [preferences, setPreferences] = useState<UserPreferences>({
    notifications: {
      channels: [NotificationChannel.EMAIL, NotificationChannel.IN_APP],
      frequency: NotificationFrequency.REAL_TIME,
      quietHours: {
        start: '22:00',
        end: '08:00',
      },
      notificationTypes: {
        leadUpdates: true,
        customerUpdates: true,
        claimUpdates: true,
        systemAlerts: true,
        taskReminders: true,
        weeklyReports: false,
      },
    },
    theme: {
      mode: ThemeMode.LIGHT,
      primaryColor: '#3B82F6',
      compactMode: false,
      sidebarCollapsed: false,
      animations: true,
    },
    language: {
      language: Language.EN_US,
      timezone: 'America/New_York',
      dateFormat: DateFormat.MM_DD_YYYY,
      timeFormat: TimeFormat.H_12,
      currency: 'USD',
    },
    privacy: {
      profileVisibleToTeam: true,
      showEmailAddress: true,
      showPhoneNumber: false,
      shareDataForAnalytics: true,
      allowMarketingEmails: false,
    },
  })

  // Mock profile data
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    bio: '',
    photoUrl: '',
  })

  // Mock save handlers
  const handleSaveProfile = async (data: typeof profileData) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setProfileData(data)
        console.log('Profile saved:', data)
        resolve()
      }, 1000)
    })
  }

  const handleChangePassword = async (_data: {
    currentPassword: string
    newPassword: string
  }) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log('Password changed')
        resolve()
      }, 1000)
    })
  }

  const handleSaveNotifications = async (
    notificationPrefs: UserPreferences['notifications']
  ) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setPreferences({ ...preferences, notifications: notificationPrefs })
        console.log('Notification preferences saved:', notificationPrefs)
        resolve()
      }, 1000)
    })
  }

  const handleSaveAppearance = async (themePrefs: UserPreferences['theme']) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setPreferences({ ...preferences, theme: themePrefs })
        console.log('Theme preferences saved:', themePrefs)
        resolve()
      }, 1000)
    })
  }

  const handleSaveLanguage = async (
    languagePrefs: UserPreferences['language']
  ) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setPreferences({ ...preferences, language: languagePrefs })
        console.log('Language preferences saved:', languagePrefs)
        resolve()
      }, 1000)
    })
  }

  const handleSavePrivacy = async (
    privacySettings: UserPreferences['privacy']
  ) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setPreferences({ ...preferences, privacy: privacySettings })
        console.log('Privacy settings saved:', privacySettings)
        resolve()
      }, 1000)
    })
  }

  const renderSectionIcon = (icon: string) => {
    const iconMap: { [key: string]: JSX.Element } = {
      User: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      Shield: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      Bell: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      ),
      Palette: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
      ),
      Globe: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          />
        </svg>
      ),
      Lock: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
    }

    return iconMap[icon] || null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Settings Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {SETTINGS_SECTIONS.map((section) => {
              const isActive = activeSection === section.id
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as SettingSectionId)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span
                    className={`mr-3 ${
                      isActive ? 'text-blue-700' : 'text-gray-400'
                    }`}
                  >
                    {renderSectionIcon(section.icon)}
                  </span>
                  <div className="text-left">
                    <div className="font-medium">{section.label}</div>
                    <div className="text-xs text-gray-500 hidden lg:block">
                      {section.description}
                    </div>
                  </div>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white shadow rounded-lg p-6">
            {activeSection === 'profile' && (
              <ProfileSettings
                profileData={profileData}
                onSave={handleSaveProfile}
              />
            )}
            {activeSection === 'security' && (
              <SecuritySettings onChangePassword={handleChangePassword} />
            )}
            {activeSection === 'notifications' && (
              <NotificationSettings
                preferences={preferences.notifications}
                onSave={handleSaveNotifications}
              />
            )}
            {activeSection === 'appearance' && (
              <AppearanceSettings
                preferences={preferences.theme}
                onSave={handleSaveAppearance}
              />
            )}
            {activeSection === 'language' && (
              <LanguageSettings
                preferences={preferences.language}
                onSave={handleSaveLanguage}
              />
            )}
            {activeSection === 'privacy' && (
              <PrivacySettings
                settings={preferences.privacy}
                onSave={handleSavePrivacy}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
