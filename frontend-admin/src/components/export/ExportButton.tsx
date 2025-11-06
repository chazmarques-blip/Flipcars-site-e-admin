'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import { ExportDialog } from './ExportDialog'
import { ExportColumn } from '@/types/export'

interface ExportButtonProps<T> {
  data: T[]
  columns: ExportColumn[]
  filename: string
  title?: string
  description?: string
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

export function ExportButton<T>({
  data,
  columns,
  filename,
  title,
  description,
  variant = 'primary',
  size = 'md',
  disabled = false,
}: ExportButtonProps<T>) {
  const [showDialog, setShowDialog] = useState(false)

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        disabled={disabled || data.length === 0}
        className={`
          inline-flex items-center space-x-2 rounded-lg transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantClasses[variant]}
          ${sizeClasses[size]}
        `}
      >
        <Download className={iconSizes[size]} />
        <span>Export</span>
        {data.length > 0 && (
          <span className="ml-1 px-2 py-0.5 bg-white bg-opacity-20 rounded-full text-xs">
            {data.length}
          </span>
        )}
      </button>

      {showDialog && (
        <ExportDialog
          data={data}
          columns={columns}
          defaultFilename={filename}
          title={title}
          description={description}
          onClose={() => setShowDialog(false)}
        />
      )}
    </>
  )
}
