import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  Activity,
  ActivityAction,
  ActivityResource,
  ActivityStatus,
  ActivityFilter,
} from '@/types/activity'

interface ActivityStore {
  activities: Activity[]
  filters: ActivityFilter
  isLoading: boolean
  
  // Actions
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void
  getActivities: (filter?: ActivityFilter) => Activity[]
  getActivityById: (id: string) => Activity | undefined
  setFilters: (filters: ActivityFilter) => void
  clearFilters: () => void
  deleteActivity: (id: string) => void
  clearActivities: () => void
}

// Mock activity generator
function generateMockActivities(): Activity[] {
  const actions = Object.values(ActivityAction)
  const resources = Object.values(ActivityResource)
  
  const users = [
    { id: '1', name: 'Admin User', role: 'super_admin' },
    { id: '2', name: 'Manager User', role: 'admin' },
    { id: '3', name: 'Agent User', role: 'agent' },
    { id: '4', name: 'John Smith', role: 'agent' },
    { id: '5', name: 'Sarah Johnson', role: 'admin' },
  ]

  const activities: Activity[] = []
  const now = new Date()

  // Generate 50 mock activities
  for (let i = 0; i < 50; i++) {
    const user = users[Math.floor(Math.random() * users.length)]
    const action = actions[Math.floor(Math.random() * actions.length)]
    const resource = resources[Math.floor(Math.random() * resources.length)]
    const status = i % 10 === 0 ? ActivityStatus.FAILED : ActivityStatus.SUCCESS
    
    // Generate timestamp (last 30 days)
    const daysAgo = Math.floor(Math.random() * 30)
    const hoursAgo = Math.floor(Math.random() * 24)
    const timestamp = new Date(now)
    timestamp.setDate(timestamp.getDate() - daysAgo)
    timestamp.setHours(timestamp.getHours() - hoursAgo)

    const descriptions: Record<ActivityAction, string> = {
      [ActivityAction.CREATE]: `Created new ${resource} #${1000 + i}`,
      [ActivityAction.UPDATE]: `Updated ${resource} #${1000 + i}`,
      [ActivityAction.DELETE]: `Deleted ${resource} #${1000 + i}`,
      [ActivityAction.VIEW]: `Viewed ${resource} details`,
      [ActivityAction.EXPORT]: `Exported ${resource} data to CSV`,
      [ActivityAction.IMPORT]: `Imported ${resource} data`,
      [ActivityAction.LOGIN]: `Logged into the system`,
      [ActivityAction.LOGOUT]: `Logged out of the system`,
      [ActivityAction.SHARE]: `Shared ${resource} with team`,
      [ActivityAction.DOWNLOAD]: `Downloaded ${resource} file`,
      [ActivityAction.UPLOAD]: `Uploaded ${resource} file`,
      [ActivityAction.APPROVE]: `Approved ${resource} #${1000 + i}`,
      [ActivityAction.REJECT]: `Rejected ${resource} #${1000 + i}`,
      [ActivityAction.SUBMIT]: `Submitted ${resource} for review`,
      [ActivityAction.ASSIGN]: `Assigned ${resource} to team member`,
      [ActivityAction.COMMENT]: `Commented on ${resource}`,
    }

    activities.push({
      id: `activity-${i + 1}`,
      action,
      resource,
      resourceId: `${resource}-${1000 + i}`,
      resourceName: `${resource.charAt(0).toUpperCase() + resource.slice(1)} #${1000 + i}`,
      description: descriptions[action],
      status,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      timestamp: timestamp.toISOString(),
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      metadata: {
        ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        duration: Math.floor(Math.random() * 5000),
        ...(action === ActivityAction.UPDATE && {
          changes: [
            {
              field: 'status',
              oldValue: 'pending',
              newValue: 'approved',
            },
            {
              field: 'priority',
              oldValue: 'low',
              newValue: 'high',
            },
          ],
        }),
      },
    })
  }

  // Sort by timestamp (newest first)
  return activities.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
}

export const useActivityStore = create<ActivityStore>()(
  persist(
    (set, get) => ({
      activities: generateMockActivities(),
      filters: {},
      isLoading: false,

      addActivity: (activity) => {
        const newActivity: Activity = {
          ...activity,
          id: `activity-${Date.now()}`,
          timestamp: new Date().toISOString(),
        }
        set((state) => ({
          activities: [newActivity, ...state.activities],
        }))
      },

      getActivities: (filter) => {
        const { activities } = get()
        const activeFilter = filter || get().filters

        if (Object.keys(activeFilter).length === 0) {
          return activities
        }

        return activities.filter((activity) => {
          // Filter by actions
          if (activeFilter.actions && activeFilter.actions.length > 0) {
            if (!activeFilter.actions.includes(activity.action)) {
              return false
            }
          }

          // Filter by resources
          if (activeFilter.resources && activeFilter.resources.length > 0) {
            if (!activeFilter.resources.includes(activity.resource)) {
              return false
            }
          }

          // Filter by statuses
          if (activeFilter.statuses && activeFilter.statuses.length > 0) {
            if (!activeFilter.statuses.includes(activity.status)) {
              return false
            }
          }

          // Filter by users
          if (activeFilter.userIds && activeFilter.userIds.length > 0) {
            if (!activeFilter.userIds.includes(activity.userId)) {
              return false
            }
          }

          // Filter by date range
          if (activeFilter.dateFrom) {
            const activityDate = new Date(activity.timestamp)
            const fromDate = new Date(activeFilter.dateFrom)
            if (activityDate < fromDate) {
              return false
            }
          }

          if (activeFilter.dateTo) {
            const activityDate = new Date(activity.timestamp)
            const toDate = new Date(activeFilter.dateTo)
            toDate.setHours(23, 59, 59, 999) // End of day
            if (activityDate > toDate) {
              return false
            }
          }

          // Filter by search
          if (activeFilter.search) {
            const searchLower = activeFilter.search.toLowerCase()
            const matchesSearch =
              activity.description.toLowerCase().includes(searchLower) ||
              activity.userName.toLowerCase().includes(searchLower) ||
              (activity.resourceName?.toLowerCase() || '').includes(searchLower)
            if (!matchesSearch) {
              return false
            }
          }

          return true
        })
      },

      getActivityById: (id) => {
        return get().activities.find((activity) => activity.id === id)
      },

      setFilters: (filters) => {
        set({ filters })
      },

      clearFilters: () => {
        set({ filters: {} })
      },

      deleteActivity: (id) => {
        set((state) => ({
          activities: state.activities.filter((activity) => activity.id !== id),
        }))
      },

      clearActivities: () => {
        set({ activities: [] })
      },
    }),
    {
      name: 'activity-storage',
      partialize: (state) => ({
        // Only persist filters, regenerate activities on load
        filters: state.filters,
      }),
    }
  )
)
