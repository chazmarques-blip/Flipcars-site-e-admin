export enum NotificationChannel {
  EMAIL = 'email',
  PUSH = 'push',
  IN_APP = 'in_app',
  SMS = 'sms',
}

export enum NotificationFrequency {
  REAL_TIME = 'realtime',
  HOURLY = 'hourly',
  DAILY = 'daily',
  WEEKLY = 'weekly',
}

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  AUTO = 'auto',
}

export enum Language {
  EN_US = 'en-US',
  EN_GB = 'en-GB',
  PT_BR = 'pt-BR',
  ES_ES = 'es-ES',
  FR_FR = 'fr-FR',
  DE_DE = 'de-DE',
}

export enum DateFormat {
  MM_DD_YYYY = 'MM/DD/YYYY',
  DD_MM_YYYY = 'DD/MM/YYYY',
  YYYY_MM_DD = 'YYYY-MM-DD',
}

export enum TimeFormat {
  H_12 = '12h',
  H_24 = '24h',
}

export interface NotificationPreferences {
  channels: NotificationChannel[]
  frequency: NotificationFrequency
  quietHours: {
    start: string
    end: string
  }
  notificationTypes: {
    [key: string]: boolean
  }
}

export interface ThemePreferences {
  mode: ThemeMode
  primaryColor: string
  compactMode: boolean
  sidebarCollapsed: boolean
  animations: boolean
}

export interface LanguagePreferences {
  language: Language
  timezone: string
  dateFormat: DateFormat
  timeFormat: TimeFormat
  currency: string
}

export interface PrivacySettings {
  profileVisibleToTeam: boolean
  showEmailAddress: boolean
  showPhoneNumber: boolean
  shareDataForAnalytics: boolean
  allowMarketingEmails: boolean
}

export interface UserPreferences {
  notifications: NotificationPreferences
  theme: ThemePreferences
  language: LanguagePreferences
  privacy: PrivacySettings
}

export interface SettingsSection {
  id: string
  label: string
  description: string
  icon: string
}

export const SETTINGS_SECTIONS: SettingsSection[] = [
  {
    id: 'profile',
    label: 'Profile',
    description: 'Manage your personal information',
    icon: 'User',
  },
  {
    id: 'security',
    label: 'Security',
    description: 'Password and authentication settings',
    icon: 'Shield',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    description: 'Configure how you receive notifications',
    icon: 'Bell',
  },
  {
    id: 'appearance',
    label: 'Appearance',
    description: 'Customize the look and feel',
    icon: 'Palette',
  },
  {
    id: 'language',
    label: 'Language & Region',
    description: 'Language, timezone, and formats',
    icon: 'Globe',
  },
  {
    id: 'privacy',
    label: 'Privacy',
    description: 'Control your data and visibility',
    icon: 'Lock',
  },
]

export const TIMEZONES = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'Eastern Time (US & Canada)' },
  { value: 'America/Chicago', label: 'Central Time (US & Canada)' },
  { value: 'America/Denver', label: 'Mountain Time (US & Canada)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (US & Canada)' },
  { value: 'America/Sao_Paulo', label: 'Brasília Time' },
  { value: 'Europe/London', label: 'London' },
  { value: 'Europe/Paris', label: 'Paris' },
  { value: 'Europe/Berlin', label: 'Berlin' },
  { value: 'Asia/Tokyo', label: 'Tokyo' },
  { value: 'Asia/Shanghai', label: 'Shanghai' },
  { value: 'Australia/Sydney', label: 'Sydney' },
]

export const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
]
