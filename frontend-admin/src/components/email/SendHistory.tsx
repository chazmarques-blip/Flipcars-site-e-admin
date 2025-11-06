'use client'

import { 
  Mail, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
} from 'lucide-react'
import { EmailSendHistory, EmailSendStatus } from '@/types/email'

interface SendHistoryProps {
  history: EmailSendHistory[]
  loading?: boolean
}

export function SendHistory({ history, loading = false }: SendHistoryProps) {
  const getStatusIcon = (status: EmailSendStatus) => {
    switch (status) {
      case EmailSendStatus.SENT:
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case EmailSendStatus.FAILED:
        return <XCircle className="h-5 w-5 text-red-500" />
      case EmailSendStatus.BOUNCED:
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      case EmailSendStatus.SENDING:
        return <Clock className="h-5 w-5 text-blue-500 animate-spin" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: EmailSendStatus) => {
    switch (status) {
      case EmailSendStatus.SENT:
        return 'bg-green-100 text-green-800'
      case EmailSendStatus.FAILED:
        return 'bg-red-100 text-red-800'
      case EmailSendStatus.BOUNCED:
        return 'bg-orange-100 text-orange-800'
      case EmailSendStatus.SENDING:
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No email history found</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Template
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Recipient
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Subject
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {history.map((record) => (
            <tr key={record.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-2" />
                  <div className="text-sm font-medium text-gray-900">
                    {record.templateName}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{record.recipient}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 max-w-xs truncate">
                  {record.subject}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(record.status)}
                  <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${getStatusColor(record.status)}`}>
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </span>
                </div>
                {record.error && (
                  <p className="text-xs text-red-600 mt-1">{record.error}</p>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {record.sentAt
                  ? new Date(record.sentAt).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : record.failedAt
                  ? new Date(record.failedAt).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
