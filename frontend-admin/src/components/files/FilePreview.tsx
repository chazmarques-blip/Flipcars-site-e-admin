'use client'

import { useState } from 'react'
import { X, Download, ExternalLink, File, FileText, Image as ImageIcon } from 'lucide-react'
import { FileMetadata } from '@/types/file'
import { isImageFile, isPdfFile, downloadFile } from '@/lib/utils/fileUtils'

interface FilePreviewProps {
  file: FileMetadata
  onClose: () => void
}

export function FilePreview({ file, onClose }: FilePreviewProps) {
  const [isLoading, setIsLoading] = useState(true)

  const handleDownload = async () => {
    if (!file.url) return
    try {
      await downloadFile(file.url, file.originalName)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const handleOpenInNew = () => {
    if (file.url) {
      window.open(file.url, '_blank')
    }
  }

  const renderPreview = () => {
    if (!file.url) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <File className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No preview available</p>
          </div>
        </div>
      )
    }

    if (isImageFile(file.mimeType)) {
      return (
        <div className="flex items-center justify-center h-full p-4">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
          )}
          <img
            src={file.url}
            alt={file.originalName}
            className="max-w-full max-h-full object-contain"
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
          />
        </div>
      )
    }

    if (isPdfFile(file.mimeType)) {
      return (
        <div className="h-full">
          <iframe
            src={file.url}
            className="w-full h-full border-0"
            title={file.originalName}
            onLoad={() => setIsLoading(false)}
          />
        </div>
      )
    }

    // Unsupported file type
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-900 font-medium mb-2">{file.originalName}</p>
          <p className="text-gray-500 text-sm mb-4">
            Preview not available for this file type
          </p>
          <button
            onClick={handleOpenInNew}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Open in new tab
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-75"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative h-full flex flex-col">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isImageFile(file.mimeType) ? (
              <ImageIcon className="h-5 w-5 text-gray-400" />
            ) : isPdfFile(file.mimeType) ? (
              <FileText className="h-5 w-5 text-gray-400" />
            ) : (
              <File className="h-5 w-5 text-gray-400" />
            )}
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {file.originalName}
              </h2>
              {file.description && (
                <p className="text-sm text-gray-500">{file.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Download file"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={handleOpenInNew}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Open in new tab"
            >
              <ExternalLink className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close preview"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 relative bg-gray-100">
          {renderPreview()}
        </div>

        {/* Footer Info */}
        <div className="bg-white border-t px-6 py-3">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>Uploaded by {file.uploadedBy}</span>
              <span>•</span>
              <span>
                {new Date(file.uploadedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            {file.tags && file.tags.length > 0 && (
              <div className="flex items-center space-x-2">
                {file.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
