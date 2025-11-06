'use client'

import { useState } from 'react'
import { X, Mail } from 'lucide-react'
import { EmailTemplate, DEFAULT_VARIABLES, replaceVariables } from '@/types/email'

interface TemplatePreviewProps {
  template: EmailTemplate
  onClose: () => void
  onSendTest?: (recipient: string) => void
}

export function TemplatePreview({ template, onClose, onSendTest }: TemplatePreviewProps) {
  const [testEmail, setTestEmail] = useState('')
  const [variableValues, setVariableValues] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {}
    template.variables.forEach((varKey) => {
      const variable = DEFAULT_VARIABLES.find((v) => v.key === varKey)
      defaults[varKey] = variable?.example || ''
    })
    return defaults
  })

  const previewSubject = replaceVariables(template.subject, variableValues)
  const previewBody = replaceVariables(template.body, variableValues)

  const handleSendTest = () => {
    if (testEmail && onSendTest) {
      onSendTest(testEmail)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative h-full flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-blue-600" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Template Preview
                </h2>
                <p className="text-sm text-gray-500">{template.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              aria-label="Close preview"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Variable Editor */}
              {template.variables.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Customize Preview Data
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {template.variables.map((varKey) => {
                      const variable = DEFAULT_VARIABLES.find((v) => v.key === varKey)
                      return (
                        <div key={varKey}>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            {variable?.label || varKey}
                          </label>
                          <input
                            type="text"
                            value={variableValues[varKey] || ''}
                            onChange={(e) =>
                              setVariableValues((prev) => ({
                                ...prev,
                                [varKey]: e.target.value,
                              }))
                            }
                            placeholder={variable?.example}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Email Preview */}
              <div className="bg-white border rounded-lg overflow-hidden">
                {/* Email Header */}
                <div className="bg-gray-50 border-b px-4 py-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">From:</span>
                    <span className="text-gray-900">noreply@flipcars.com</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-600">Subject:</span>
                    <span className="text-gray-900 font-medium">{previewSubject}</span>
                  </div>
                </div>

                {/* Email Body */}
                <div className="p-6">
                  <div 
                    className="prose prose-sm max-w-none"
                    style={{ whiteSpace: 'pre-wrap' }}
                  >
                    {previewBody}
                  </div>
                </div>

                {/* Email Footer */}
                <div className="bg-gray-50 border-t px-4 py-3">
                  <p className="text-xs text-gray-500 text-center">
                    This is a preview. Actual emails may render differently in various email clients.
                  </p>
                </div>
              </div>

              {/* Send Test Email */}
              {onSendTest && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-900 mb-3">
                    Send Test Email
                  </h3>
                  <div className="flex items-center space-x-3">
                    <input
                      type="email"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="flex-1 px-3 py-2 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleSendTest}
                      disabled={!testEmail}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Send Test
                    </button>
                  </div>
                  <p className="text-xs text-blue-700 mt-2">
                    A test email will be sent with the current preview data
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{template.variables.length}</span> variables detected
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
