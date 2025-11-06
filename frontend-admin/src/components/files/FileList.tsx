'use client'

import { useState } from 'react'
import { 
  Grid, 
  List, 
  Download, 
  Trash2, 
  Eye,
  File,
  FileText,
  Image as ImageIcon,
  MoreVertical,
} from 'lucide-react'
import { FileMetadata, FileCategory } from '@/types/file'
import { formatFileSize, isImageFile } from '@/lib/utils/fileUtils'
import { FilePreview } from './FilePreview'

interface FileListProps {
  files: FileMetadata[]
  onDownload?: (file: FileMetadata) => void
  onDelete?: (fileId: string) => void
  loading?: boolean
}

type ViewMode = 'grid' | 'list'

export function FileList({ files, onDownload, onDelete, loading = false }: FileListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [previewFile, setPreviewFile] = useState<FileMetadata | null>(null)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  const getFileIcon = (file: FileMetadata) => {
    if (isImageFile(file.mimeType)) {
      return <ImageIcon className="h-5 w-5" />
    }
    if (file.mimeType === 'application/pdf') {
      return <FileText className="h-5 w-5" />
    }
    return <File className="h-5 w-5" />
  }

  const getCategoryColor = (category: FileCategory) => {
    const colors: Record<FileCategory, string> = {
      [FileCategory.LEAD_DOCUMENT]: 'bg-blue-100 text-blue-800',
      [FileCategory.CUSTOMER_DOCUMENT]: 'bg-green-100 text-green-800',
      [FileCategory.CLAIM_DOCUMENT]: 'bg-red-100 text-red-800',
      [FileCategory.VEHICLE_DOCUMENT]: 'bg-purple-100 text-purple-800',
      [FileCategory.INSURANCE_DOCUMENT]: 'bg-orange-100 text-orange-800',
      [FileCategory.CONTRACT]: 'bg-indigo-100 text-indigo-800',
      [FileCategory.INVOICE]: 'bg-yellow-100 text-yellow-800',
      [FileCategory.OTHER]: 'bg-gray-100 text-gray-800',
    }
    return colors[category] || colors[FileCategory.OTHER]
  }

  const handlePreview = (file: FileMetadata) => {
    setPreviewFile(file)
    setActiveMenu(null)
  }

  const handleDownload = (file: FileMetadata) => {
    onDownload?.(file)
    setActiveMenu(null)
  }

  const handleDelete = (fileId: string) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      onDelete?.(fileId)
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

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <File className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No files found</p>
      </div>
    )
  }

  return (
    <>
      {/* View Mode Toggle */}
      <div className="flex items-center justify-end mb-4">
        <div className="inline-flex rounded-lg border border-gray-200 p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${
              viewMode === 'grid'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            aria-label="Grid view"
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${
              viewMode === 'list'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Thumbnail */}
              <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
                {file.thumbnailUrl ? (
                  <img
                    src={file.thumbnailUrl}
                    alt={file.originalName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400">
                    {getFileIcon(file)}
                  </div>
                )}
                <button
                  onClick={() => handlePreview(file)}
                  className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-all"
                >
                  <Eye className="h-8 w-8 text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900 truncate flex-1">
                    {file.originalName}
                  </h3>
                  <div className="relative">
                    <button
                      onClick={() => setActiveMenu(activeMenu === file.id ? null : file.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    {activeMenu === file.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-10">
                        <button
                          onClick={() => handlePreview(file)}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </button>
                        {onDownload && (
                          <button
                            onClick={() => handleDownload(file)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => handleDelete(file.id)}
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

                <p className="text-xs text-gray-500 mb-2">
                  {formatFileSize(file.size)}
                </p>

                <span className={`inline-block px-2 py-1 text-xs rounded-full ${getCategoryColor(file.category)}`}>
                  {file.category.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploaded
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {files.map((file) => (
                <tr key={file.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-gray-400 mr-3">
                        {getFileIcon(file)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {file.originalName}
                        </div>
                        {file.description && (
                          <div className="text-xs text-gray-500">
                            {file.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${getCategoryColor(file.category)}`}>
                      {file.category.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatFileSize(file.size)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(file.uploadedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handlePreview(file)}
                        className="text-blue-600 hover:text-blue-900"
                        aria-label="Preview"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {onDownload && (
                        <button
                          onClick={() => handleDownload(file)}
                          className="text-gray-600 hover:text-gray-900"
                          aria-label="Download"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => handleDelete(file.id)}
                          className="text-red-600 hover:text-red-900"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Preview Modal */}
      {previewFile && (
        <FilePreview
          file={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </>
  )
}
