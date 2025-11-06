'use client'

import { useState } from 'react'
import { Copy, Code, Type } from 'lucide-react'
import { 
  EmailTemplate, 
  EmailTemplateCategory, 
  EmailStatus,
  EmailTriggerType,
  DEFAULT_VARIABLES,
  parseVariables,
} from '@/types/email'

interface TemplateEditorProps {
  template?: EmailTemplate
  onSave: (template: Partial<EmailTemplate>) => void
  onCancel: () => void
}

export function TemplateEditor({ template, onSave, onCancel }: TemplateEditorProps) {
  const [name, setName] = useState(template?.name || '')
  const [category, setCategory] = useState<EmailTemplateCategory>(
    template?.category || EmailTemplateCategory.LEAD
  )
  const [subject, setSubject] = useState(template?.subject || '')
  const [body, setBody] = useState(template?.body || '')
  const [status, setStatus] = useState<EmailStatus>(
    template?.status || EmailStatus.DRAFT
  )
  const [selectedTriggers, setSelectedTriggers] = useState<EmailTriggerType[]>(
    template?.triggers || []
  )
  const [showVariables, setShowVariables] = useState(true)

  const detectedVariables = parseVariables(`${subject} ${body}`)

  const handleInsertVariable = (variableKey: string) => {
    const variable = `{{${variableKey}}}`
    // Insert at cursor position in body
    const textarea = document.getElementById('body-textarea') as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newBody = body.substring(0, start) + variable + body.substring(end)
      setBody(newBody)
      
      // Set cursor position after inserted variable
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + variable.length, start + variable.length)
      }, 0)
    } else {
      setBody((prev) => prev + variable)
    }
  }

  const handleTriggerToggle = (trigger: EmailTriggerType) => {
    setSelectedTriggers((prev) =>
      prev.includes(trigger)
        ? prev.filter((t) => t !== trigger)
        : [...prev, trigger]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      id: template?.id,
      name,
      category,
      subject,
      body,
      status,
      triggers: selectedTriggers,
      variables: detectedVariables,
      usageCount: template?.usageCount || 0,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {template ? 'Edit Template' : 'Create Template'}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowVariables(!showVariables)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            aria-label="Toggle variables panel"
          >
            <Code className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg border p-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Template Name *
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g., Welcome Email, Lead Follow-up"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as EmailTemplateCategory)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.values(EmailTemplateCategory).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as EmailStatus)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.values(EmailStatus).map((stat) => (
                    <option key={stat} value={stat}>
                      {stat.charAt(0).toUpperCase() + stat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Subject */}
          <div className="bg-white rounded-lg border p-6 space-y-4">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Email Subject *
              </label>
              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                placeholder="Use {{variable_name}} for dynamic content"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Body */}
          <div className="bg-white rounded-lg border p-6 space-y-4">
            <div>
              <label htmlFor="body-textarea" className="block text-sm font-medium text-gray-700 mb-1">
                Email Body *
              </label>
              <textarea
                id="body-textarea"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                rows={12}
                placeholder="Write your email content here. Use {{variable_name}} for dynamic content..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              />
            </div>

            {detectedVariables.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm font-medium text-blue-900 mb-2">
                  Detected Variables:
                </p>
                <div className="flex flex-wrap gap-2">
                  {detectedVariables.map((variable) => (
                    <span
                      key={variable}
                      className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                    >
                      {variable}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Triggers */}
          <div className="bg-white rounded-lg border p-6 space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Automation Triggers</h3>
            <p className="text-xs text-gray-500">
              Select when this email should be sent automatically
            </p>
            <div className="grid grid-cols-2 gap-3">
              {Object.values(EmailTriggerType).map((trigger) => (
                <label
                  key={trigger}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedTriggers.includes(trigger)}
                    onChange={() => handleTriggerToggle(trigger)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    {trigger.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Variables Panel */}
        {showVariables && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-4 sticky top-4">
              <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                <Type className="h-4 w-4 mr-2" />
                Available Variables
              </h3>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {DEFAULT_VARIABLES.map((variable) => (
                  <div
                    key={variable.key}
                    className="group p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {variable.label}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {variable.description}
                        </p>
                        <code className="text-xs text-blue-600 mt-1 block">
                          {`{{${variable.key}}}`}
                        </code>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleInsertVariable(variable.key)}
                        className="ml-2 p-1 text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={`Insert ${variable.label}`}
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-3 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {template ? 'Update Template' : 'Create Template'}
        </button>
      </div>
    </form>
  )
}
