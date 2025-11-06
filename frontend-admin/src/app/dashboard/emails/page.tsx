'use client'

import { useState } from 'react'
import { 
  Plus, 
  Search, 
  Filter,
  Mail,
  Send,
  Clock,
  CheckCircle,
} from 'lucide-react'
import { 
  TemplateEditor, 
  TemplatePreview, 
  TemplateList,
  SendHistory,
} from '@/components/email'
import { 
  EmailTemplate, 
  EmailTemplateCategory, 
  EmailStatus,
  EmailTriggerType,
  EmailSendHistory,
  EmailSendStatus,
} from '@/types/email'

// Mock data for demonstration
const mockTemplates: EmailTemplate[] = [
  {
    id: '1',
    name: 'Welcome Email',
    category: EmailTemplateCategory.LEAD,
    subject: 'Welcome to FlipCars, {{customer_name}}!',
    body: `Hello {{customer_name}},

Thank you for your interest in FlipCars! We're excited to help you find your perfect vehicle.

Our agent {{agent_name}} will be in touch with you shortly to discuss your requirements.

Best regards,
The FlipCars Team
{{company_phone}}`,
    variables: ['customer_name', 'agent_name', 'company_phone'],
    triggers: [EmailTriggerType.LEAD_CREATED],
    status: EmailStatus.ACTIVE,
    createdBy: 'John Doe',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    usageCount: 45,
  },
  {
    id: '2',
    name: 'Lead Follow-up',
    category: EmailTemplateCategory.LEAD,
    subject: 'Following up on your {{vehicle_make}} {{vehicle_model}} inquiry',
    body: `Hi {{customer_name}},

I wanted to follow up on your interest in the {{vehicle_year}} {{vehicle_make}} {{vehicle_model}}.

Do you have any questions I can help answer? I'm here to make this process as smooth as possible.

Feel free to reach me at {{agent_email}} or {{agent_phone}}.

Best regards,
{{agent_name}}
FlipCars`,
    variables: ['customer_name', 'vehicle_make', 'vehicle_model', 'vehicle_year', 'agent_name', 'agent_email', 'agent_phone'],
    triggers: [EmailTriggerType.MANUAL],
    status: EmailStatus.ACTIVE,
    createdBy: 'Jane Smith',
    createdAt: '2024-01-12T09:00:00Z',
    updatedAt: '2024-01-12T09:00:00Z',
    usageCount: 32,
  },
  {
    id: '3',
    name: 'Claim Approved',
    category: EmailTemplateCategory.CLAIM,
    subject: 'Your claim {{claim_id}} has been approved',
    body: `Dear {{customer_name}},

Great news! Your claim ({{claim_id}}) has been approved.

Status: {{claim_status}}

Our team will process this shortly and reach out with next steps.

If you have any questions, please contact us at {{company_phone}}.

Best regards,
FlipCars Claims Team`,
    variables: ['customer_name', 'claim_id', 'claim_status', 'company_phone'],
    triggers: [EmailTriggerType.CLAIM_APPROVED],
    status: EmailStatus.ACTIVE,
    createdBy: 'Mike Johnson',
    createdAt: '2024-01-08T11:00:00Z',
    updatedAt: '2024-01-14T16:00:00Z',
    usageCount: 18,
  },
  {
    id: '4',
    name: 'Customer Onboarding',
    category: EmailTemplateCategory.CUSTOMER,
    subject: 'Welcome aboard, {{customer_name}}!',
    body: `Hello {{customer_name}},

Congratulations on becoming a FlipCars customer!

Here's what you can expect next:
1. Your dedicated agent {{agent_name}} will contact you
2. Vehicle inspection and documentation
3. Finalizing your purchase

Visit our website or call {{company_phone}} for any assistance.

Welcome to the FlipCars family!

Best regards,
The FlipCars Team`,
    variables: ['customer_name', 'agent_name', 'company_phone'],
    triggers: [EmailTriggerType.CUSTOMER_CREATED, EmailTriggerType.LEAD_CONVERTED],
    status: EmailStatus.ACTIVE,
    createdBy: 'Sarah Wilson',
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-01-10T10:30:00Z',
    usageCount: 28,
  },
  {
    id: '5',
    name: 'Monthly Newsletter',
    category: EmailTemplateCategory.MARKETING,
    subject: 'FlipCars Newsletter - {{current_date}}',
    body: `Hello {{customer_name}},

Check out this month's featured vehicles and special offers!

[Newsletter content here]

Don't miss out on these great deals. Contact us today!

Best regards,
{{company_name}}
{{company_phone}}`,
    variables: ['customer_name', 'current_date', 'company_name', 'company_phone'],
    triggers: [EmailTriggerType.SCHEDULED],
    status: EmailStatus.DRAFT,
    createdBy: 'John Doe',
    createdAt: '2024-01-14T13:00:00Z',
    updatedAt: '2024-01-14T13:00:00Z',
    usageCount: 0,
  },
]

const mockHistory: EmailSendHistory[] = [
  {
    id: '1',
    templateId: '1',
    templateName: 'Welcome Email',
    recipient: 'john.doe@example.com',
    subject: 'Welcome to FlipCars, John Doe!',
    status: EmailSendStatus.SENT,
    sentAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    templateId: '2',
    templateName: 'Lead Follow-up',
    recipient: 'jane.smith@example.com',
    subject: 'Following up on your Toyota Camry inquiry',
    status: EmailSendStatus.SENT,
    sentAt: '2024-01-15T09:15:00Z',
  },
  {
    id: '3',
    templateId: '3',
    templateName: 'Claim Approved',
    recipient: 'mike.johnson@example.com',
    subject: 'Your claim CLAIM-001 has been approved',
    status: EmailSendStatus.SENT,
    sentAt: '2024-01-14T16:45:00Z',
  },
  {
    id: '4',
    templateId: '1',
    templateName: 'Welcome Email',
    recipient: 'sarah.wilson@example.com',
    subject: 'Welcome to FlipCars, Sarah Wilson!',
    status: EmailSendStatus.FAILED,
    failedAt: '2024-01-14T14:20:00Z',
    error: 'Invalid email address',
  },
  {
    id: '5',
    templateId: '4',
    templateName: 'Customer Onboarding',
    recipient: 'alex.brown@example.com',
    subject: 'Welcome aboard, Alex Brown!',
    status: EmailSendStatus.SENT,
    sentAt: '2024-01-13T11:00:00Z',
  },
]

type TabType = 'templates' | 'history'

export default function EmailsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('templates')
  const [templates, setTemplates] = useState<EmailTemplate[]>(mockTemplates)
  const [history] = useState<EmailSendHistory[]>(mockHistory)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<EmailTemplateCategory | 'all'>('all')
  const [selectedStatus, setSelectedStatus] = useState<EmailStatus | 'all'>('all')
  const [showEditor, setShowEditor] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | undefined>()
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null)

  const handleSaveTemplate = (templateData: Partial<EmailTemplate>) => {
    if (templateData.id) {
      // Update existing
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === templateData.id
            ? {
                ...t,
                ...templateData,
                updatedAt: new Date().toISOString(),
              }
            : t
        )
      )
    } else {
      // Create new
      const newTemplate: EmailTemplate = {
        id: `new-${Date.now()}`,
        name: templateData.name!,
        category: templateData.category!,
        subject: templateData.subject!,
        body: templateData.body!,
        variables: templateData.variables || [],
        triggers: templateData.triggers || [],
        status: templateData.status || EmailStatus.DRAFT,
        createdBy: 'Current User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 0,
      }
      setTemplates((prev) => [newTemplate, ...prev])
    }
    setShowEditor(false)
    setEditingTemplate(undefined)
  }

  const handleEditTemplate = (template: EmailTemplate) => {
    setEditingTemplate(template)
    setShowEditor(true)
  }

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== templateId))
  }

  const handleDuplicateTemplate = (template: EmailTemplate) => {
    const newTemplate: EmailTemplate = {
      ...template,
      id: `dup-${Date.now()}`,
      name: `${template.name} (Copy)`,
      status: EmailStatus.DRAFT,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0,
    }
    setTemplates((prev) => [newTemplate, ...prev])
  }

  const handleSendTest = (recipient: string) => {
    alert(`Test email would be sent to: ${recipient}`)
    // In real app, call API to send test email
  }

  // Filter templates
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || template.status === selectedStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  // Stats
  const stats = {
    total: templates.length,
    active: templates.filter((t) => t.status === EmailStatus.ACTIVE).length,
    sent: history.filter((h) => h.status === EmailSendStatus.SENT).length,
    failed: history.filter((h) => h.status === EmailSendStatus.FAILED).length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
          <p className="text-gray-500 mt-1">
            Manage email templates and automation
          </p>
        </div>
        <button
          onClick={() => {
            setEditingTemplate(undefined)
            setShowEditor(true)
          }}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>New Template</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Templates</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Emails Sent</p>
              <p className="text-2xl font-bold text-gray-900">{stats.sent}</p>
            </div>
            <Send className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Failed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.failed}</p>
            </div>
            <Clock className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('templates')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'templates'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Templates ({templates.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Send History ({history.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'templates' && (
            <>
              {/* Filters */}
              <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Category & Status Filters */}
                <div className="flex items-center space-x-3">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as EmailTemplateCategory | 'all')}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    {Object.values(EmailTemplateCategory).map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as EmailStatus | 'all')}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    {Object.values(EmailStatus).map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Template List */}
              {showEditor ? (
                <TemplateEditor
                  template={editingTemplate}
                  onSave={handleSaveTemplate}
                  onCancel={() => {
                    setShowEditor(false)
                    setEditingTemplate(undefined)
                  }}
                />
              ) : (
                <TemplateList
                  templates={filteredTemplates}
                  onEdit={handleEditTemplate}
                  onDelete={handleDeleteTemplate}
                  onDuplicate={handleDuplicateTemplate}
                  onPreview={setPreviewTemplate}
                />
              )}
            </>
          )}

          {activeTab === 'history' && <SendHistory history={history} />}
        </div>
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <TemplatePreview
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onSendTest={handleSendTest}
        />
      )}
    </div>
  )
}
