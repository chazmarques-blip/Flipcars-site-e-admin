'use client'

import { useEffect } from 'react'
import { useWebSocket } from '@/lib/hooks/useWebSocket'
import { useNotificationStore } from '@/stores/notificationStore'
import { useAuthStore } from '@/stores/authStore'
import { Notification } from '@/types/notification'
import toast from 'react-hot-toast'

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore()
  const addNotification = useNotificationStore((state) => state.addNotification)

  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001/notifications'

  const { isConnected } = useWebSocket({
    url: `${wsUrl}?userId=${user?.id}`,
    reconnectAttempts: 5,
    reconnectInterval: 3000,
    onMessage: (data) => {
      const notification = data as Notification
      
      // Add to store
      addNotification(notification)

      // Show toast notification
      const toastOptions = {
        duration: 5000,
        position: 'top-right' as const,
      }

      switch (notification.type) {
        case 'success':
          toast.success(notification.message, toastOptions)
          break
        case 'error':
          toast.error(notification.message, toastOptions)
          break
        case 'warning':
          toast(notification.message, { ...toastOptions, icon: '⚠️' })
          break
        default:
          toast(notification.message, toastOptions)
      }
    },
    onOpen: () => {
      console.log('✅ Notification WebSocket connected')
    },
    onClose: () => {
      console.log('❌ Notification WebSocket disconnected')
    },
    onError: (error) => {
      console.error('⚠️ Notification WebSocket error:', error)
    },
  })

  // Log connection status for debugging
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('📡 WebSocket Status:', isConnected ? 'Connected' : 'Disconnected')
    }
  }, [isConnected, isAuthenticated, user])

  // Don't render children differently, just provide the WebSocket connection
  return <>{children}</>
}
