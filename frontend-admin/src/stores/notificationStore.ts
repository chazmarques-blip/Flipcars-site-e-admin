import { create } from 'zustand'
import { Notification, NotificationStats, NotificationPreferences } from '@/types/notification'

interface NotificationState {
  notifications: Notification[]
  stats: NotificationStats | null
  preferences: NotificationPreferences | null
  isLoading: boolean
  error: string | null

  // Actions
  addNotification: (notification: Notification) => void
  markAsRead: (notificationId: string) => void
  markAllAsRead: () => void
  deleteNotification: (notificationId: string) => void
  clearAll: () => void
  setNotifications: (notifications: Notification[]) => void
  updateStats: () => void
  setPreferences: (preferences: NotificationPreferences) => void
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  stats: null,
  preferences: null,
  isLoading: false,
  error: null,

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
    }))
    get().updateStats()
  },

  markAsRead: (notificationId) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      ),
    }))
    get().updateStats()
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }))
    get().updateStats()
  },

  deleteNotification: (notificationId) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== notificationId),
    }))
    get().updateStats()
  },

  clearAll: () => {
    set({
      notifications: [],
      stats: {
        total: 0,
        unread: 0,
        byCategory: {
          lead: 0,
          customer: 0,
          claim: 0,
          chat: 0,
          system: 0,
        },
      },
    })
  },

  setNotifications: (notifications) => {
    set({ notifications })
    get().updateStats()
  },

  updateStats: () => {
    const { notifications } = get()
    const stats: NotificationStats = {
      total: notifications.length,
      unread: notifications.filter((n) => !n.read).length,
      byCategory: {
        lead: notifications.filter((n) => n.category === 'lead').length,
        customer: notifications.filter((n) => n.category === 'customer').length,
        claim: notifications.filter((n) => n.category === 'claim').length,
        chat: notifications.filter((n) => n.category === 'chat').length,
        system: notifications.filter((n) => n.category === 'system').length,
      },
    }
    set({ stats })
  },

  setPreferences: (preferences) => {
    set({ preferences })
  },
}))
