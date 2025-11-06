'use client'

import { Activity } from '@/types/activity'
import { TrendingUp, Users, AlertCircle, Activity as ActivityIcon } from 'lucide-react'

interface ActivityStatsProps {
  activities: Activity[]
}

export default function ActivityStats({ activities }: ActivityStatsProps) {
  // Calculate stats
  const totalActivities = activities.length
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayActivities = activities.filter(
    (a) => new Date(a.timestamp) >= today
  ).length

  const uniqueUsers = new Set(activities.map((a) => a.userId)).size

  const failedActivities = activities.filter((a) => a.status === 'failed').length

  // Top actions
  const actionCounts: Record<string, number> = {}
  activities.forEach((a) => {
    actionCounts[a.action] = (actionCounts[a.action] || 0) + 1
  })
  const topActions = Object.entries(actionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  // Top resources
  const resourceCounts: Record<string, number> = {}
  activities.forEach((a) => {
    resourceCounts[a.resource] = (resourceCounts[a.resource] || 0) + 1
  })
  const topResources = Object.entries(resourceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const stats = [
    {
      name: 'Total Activities',
      value: totalActivities,
      icon: ActivityIcon,
      color: 'text-blue-600 bg-blue-100',
      change: null,
    },
    {
      name: 'Today',
      value: todayActivities,
      icon: TrendingUp,
      color: 'text-green-600 bg-green-100',
      change: null,
    },
    {
      name: 'Active Users',
      value: uniqueUsers,
      icon: Users,
      color: 'text-purple-600 bg-purple-100',
      change: null,
    },
    {
      name: 'Failed',
      value: failedActivities,
      icon: AlertCircle,
      color: 'text-red-600 bg-red-100',
      change: null,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Top Actions & Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Actions
          </h3>
          <div className="space-y-3">
            {topActions.map(([action, count]) => {
              const percentage = (count / totalActivities) * 100
              return (
                <div key={action}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700 capitalize">
                      {action}
                    </span>
                    <span className="text-gray-500">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top Resources */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Resources
          </h3>
          <div className="space-y-3">
            {topResources.map(([resource, count]) => {
              const percentage = (count / totalActivities) * 100
              return (
                <div key={resource}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700 capitalize">
                      {resource}
                    </span>
                    <span className="text-gray-500">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
