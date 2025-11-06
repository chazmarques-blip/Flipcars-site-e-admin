'use client'

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import clsx from 'clsx'

interface KPICardProps {
  label: string
  value: string | number
  change?: number
  changeType?: 'increase' | 'decrease' | 'neutral'
  prefix?: string
  suffix?: string
  icon?: React.ReactNode
  color?: string
  loading?: boolean
}

export function KPICard({
  label,
  value,
  change,
  changeType = 'neutral',
  prefix,
  suffix,
  icon,
  color = 'primary',
  loading = false,
}: KPICardProps) {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary',
    success: 'bg-green-50 text-green-600',
    warning: 'bg-yellow-50 text-yellow-600',
    danger: 'bg-red-50 text-red-600',
    info: 'bg-blue-50 text-blue-600',
  }

  const changeColors = {
    increase: 'text-green-600 bg-green-50',
    decrease: 'text-red-600 bg-red-50',
    neutral: 'text-gray-600 bg-gray-50',
  }

  const TrendIcon = changeType === 'increase' 
    ? TrendingUp 
    : changeType === 'decrease' 
    ? TrendingDown 
    : Minus

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="w-10 h-10 bg-gray-200 rounded-lg" />
        </div>
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/4" />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{label}</h3>
        {icon && (
          <div className={clsx('p-2 rounded-lg', colorClasses[color as keyof typeof colorClasses] || colorClasses.primary)}>
            {icon}
          </div>
        )}
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-2 mb-2">
        {prefix && <span className="text-2xl font-semibold text-gray-400">{prefix}</span>}
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {suffix && <span className="text-xl font-medium text-gray-500">{suffix}</span>}
      </div>

      {/* Change Indicator */}
      {change !== undefined && (
        <div className="flex items-center gap-1">
          <div className={clsx('flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium', changeColors[changeType])}>
            <TrendIcon className="w-3 h-3" />
            <span>{Math.abs(change)}%</span>
          </div>
          <span className="text-xs text-gray-500">vs last period</span>
        </div>
      )}
    </div>
  )
}
