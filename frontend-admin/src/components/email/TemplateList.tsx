'use client'

import { useState } from 'react'
import { 
  Edit, 
  Trash2, 
  Copy, 
  Eye,
  MoreVertical,
  Mail,
  Calendar,
  Activity,
} from 'lucide-react'
import { 
  EmailTemplate, 
  EmailTemplateCategory, 
  EmailStatus,
} from '@/types/email'

interface TemplateListProps {
  templates: EmailTemplate[]
  onEdit?: (template: EmailTemplate) => void
  onDelete?: (templateId: string) => void
  onDuplicate?: (template: EmailTemplate) => void
  onPreview?: (template: EmailTemplate) => void
  loading?: boolean
}

export function TemplateList({
  templates,
  onEdit,
  onDelete,
  onDuplicate,
  onPreview,
  loading = false,
}: TemplateListProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  const getCategoryColor = (category: EmailTemplateCategory) => {
    const colors: Record<EmailTemplateCategory, string> = {
      [EmailTemplateCategory.LEAD]: 'bg-blue-100 text-blue-800',
      [EmailTemplateCategory.CUSTOMER]: 'bg-green-100 text-green-800',
      [EmailTemplateCategory.CLAIM]: 'bg-red-100 text-red-800',
      [EmailTemplateCategory.SYSTEM]: 'bg-purple-100 text-purple-800',
      [EmailTemplateCategory.MARKETING]: 'bg-orange-100 text-orange-800',
    }
    return colors[category]
  }

  const getStatusColor = (status: EmailStatus) => {
    const colors: Record<EmailStatus, string> = {
      [EmailStatus.DRAFT]: 'bg-gray-100 text-gray-800',
      [EmailStatus.ACTIVE]: 'bg-green-100 text-green-800',
      [EmailStatus.INACTIVE]: 'bg-yellow-100 text-yellow-800',
      [EmailStatus.ARCHIVED]: 'bg-gray-100 text-gray-600',
    }
    return colors[status]
  }

  const handleDelete = (templateId: string, templateName: string) => {
    if (window.confirm(`Are you sure you want to delete "${templateName}"?`)) {
      onDelete?.(templateId)
      setActiveMenu(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-12">
        <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No email templates found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <div
          key={template.id}
          className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
        >
          {/* Card Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-gray-900 truncate">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1 truncate">
                  {template.subject}
                </p>
              </div>
              <div className="relative ml-2">
                <button
                  onClick={() => setActiveMenu(activeMenu === template.id ? null : template.id)}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                >
                  <MoreVertical className="h-5 w-5" />
                </button>
                {activeMenu === template.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-10">
                    {onEdit && (
                      <button
                        onClick={() => {
                          onEdit(template)
                          setActiveMenu(null)
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </button>
                    )}
                    {onPreview && (
                      <button
                        onClick={() => {
                          onPreview(template)
                          setActiveMenu(null)
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </button>
                    )}
                    {onDuplicate && (
                      <button
                        onClick={() => {
                          onDuplicate(template)
                          setActiveMenu(null)
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => handleDelete(template.id, template.name)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600 flex items-center"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Badges */}
            <div className="flex items-center space-x-2 mt-3">
              <span className={`inline-block px-2 py-1 text-xs rounded-full ${getCategoryColor(template.category)}`}>
                {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
              </span>
              <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(template.status)}`}>
                {template.status.charAt(0).toUpperCase() + template.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-4 space-y-3">
            {/* Triggers */}
            {template.triggers.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-700 mb-2">Triggers:</p>
                <div className="flex flex-wrap gap-1">
                  {template.triggers.slice(0, 3).map((trigger) => (
                    <span
                      key={trigger}
                      className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                    >
                      {trigger.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </span>
                  ))}
                  {template.triggers.length > 3 && (
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      +{template.triggers.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Variables */}
            {template.variables.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-700 mb-2">Variables:</p>
                <div className="flex flex-wrap gap-1">
                  {template.variables.slice(0, 4).map((variable) => (
                    <code
                      key={variable}
                      className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                    >
                      {`{{${variable}}}`}
                    </code>
                  ))}
                  {template.variables.length > 4 && (
                    <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                      +{template.variables.length - 4}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center">
                  <Activity className="h-3 w-3 mr-1" />
                  <span>{template.usageCount} sent</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>
                    {new Date(template.updatedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-end space-x-2">
            {onPreview && (
              <button
                onClick={() => onPreview(template)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-white rounded"
                aria-label="Preview template"
              >
                <Eye className="h-4 w-4" />
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(template)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-white rounded"
                aria-label="Edit template"
              >
                <Edit className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
