'use client'

import { useState } from 'react'
import { 
  Upload as UploadIcon, 
  Search, 
  Filter,
  Download,
  Trash2,
  FolderOpen,
} from 'lucide-react'
import { FileUpload, FileList } from '@/components/files'
import { 
  FileMetadata, 
  FileCategory, 
  FileStatus,
  FileUploadOptions,
} from '@/types/file'
import { downloadFile } from '@/lib/utils/fileUtils'

// Mock data for demonstration
const mockFiles: FileMetadata[] = [
  {
    id: '1',
    filename: 'contract_001.pdf',
    originalName: 'Vehicle Purchase Contract.pdf',
    mimeType: 'application/pdf',
    size: 2457600,
    category: FileCategory.CONTRACT,
    status: FileStatus.COMPLETED,
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    uploadedBy: 'John Doe',
    uploadedAt: '2024-01-15T10:30:00Z',
    description: 'Purchase agreement for BMW X5',
    tags: ['contract', 'vehicle', 'bmw'],
  },
  {
    id: '2',
    filename: 'insurance_policy.pdf',
    originalName: 'Insurance Policy Document.pdf',
    mimeType: 'application/pdf',
    size: 1842600,
    category: FileCategory.INSURANCE_DOCUMENT,
    status: FileStatus.COMPLETED,
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    uploadedBy: 'Jane Smith',
    uploadedAt: '2024-01-14T14:20:00Z',
    description: 'Comprehensive insurance policy',
    tags: ['insurance', 'policy'],
  },
  {
    id: '3',
    filename: 'vehicle_001.jpg',
    originalName: 'Vehicle Front View.jpg',
    mimeType: 'image/jpeg',
    size: 3145728,
    category: FileCategory.VEHICLE_DOCUMENT,
    status: FileStatus.COMPLETED,
    url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400',
    uploadedBy: 'Mike Johnson',
    uploadedAt: '2024-01-13T09:15:00Z',
    description: 'Front exterior photo',
    tags: ['vehicle', 'photo', 'exterior'],
  },
  {
    id: '4',
    filename: 'claim_report.pdf',
    originalName: 'Damage Claim Report.pdf',
    mimeType: 'application/pdf',
    size: 1234567,
    category: FileCategory.CLAIM_DOCUMENT,
    status: FileStatus.COMPLETED,
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    uploadedBy: 'Sarah Wilson',
    uploadedAt: '2024-01-12T16:45:00Z',
    description: 'Accident damage assessment',
    tags: ['claim', 'damage', 'accident'],
  },
  {
    id: '5',
    filename: 'customer_id.jpg',
    originalName: "Customer Driver's License.jpg",
    mimeType: 'image/jpeg',
    size: 2097152,
    category: FileCategory.CUSTOMER_DOCUMENT,
    status: FileStatus.COMPLETED,
    url: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400',
    uploadedBy: 'John Doe',
    uploadedAt: '2024-01-11T11:30:00Z',
    description: 'Customer identification document',
    tags: ['customer', 'id', 'license'],
  },
  {
    id: '6',
    filename: 'invoice_2024_001.pdf',
    originalName: 'Invoice #2024-001.pdf',
    mimeType: 'application/pdf',
    size: 524288,
    category: FileCategory.INVOICE,
    status: FileStatus.COMPLETED,
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    uploadedBy: 'Jane Smith',
    uploadedAt: '2024-01-10T13:00:00Z',
    description: 'Service invoice for maintenance',
    tags: ['invoice', 'payment', 'service'],
  },
]

export default function FilesPage() {
  const [showUpload, setShowUpload] = useState(false)
  const [files, setFiles] = useState<FileMetadata[]>(mockFiles)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<FileCategory | 'all'>('all')

  const uploadOptions: FileUploadOptions = {
    category: FileCategory.OTHER,
    maxSize: 10 * 1024 * 1024, // 10MB
  }

  const handleUpload = async (uploadedFiles: File[]) => {
    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // In real app, upload to server and get metadata back
    const newFiles: FileMetadata[] = uploadedFiles.map((file, index) => ({
      id: `new-${Date.now()}-${index}`,
      filename: file.name.replace(/\s+/g, '_').toLowerCase(),
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      category: uploadOptions.category,
      status: FileStatus.COMPLETED,
      url: URL.createObjectURL(file),
      uploadedBy: 'Current User',
      uploadedAt: new Date().toISOString(),
      description: uploadOptions.description,
      tags: uploadOptions.tags,
    }))

    setFiles((prev) => [...newFiles, ...prev])
    setShowUpload(false)
  }

  const handleDownload = async (file: FileMetadata) => {
    if (!file.url) return
    try {
      await downloadFile(file.url, file.originalName)
    } catch (error) {
      console.error('Download failed:', error)
      alert('Failed to download file')
    }
  }

  const handleDelete = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  // Filter files
  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">File Manager</h1>
          <p className="text-gray-500 mt-1">
            Manage your documents, images, and files
          </p>
        </div>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <UploadIcon className="h-5 w-5" />
          <span>Upload Files</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Files</p>
              <p className="text-2xl font-bold text-gray-900">{files.length}</p>
            </div>
            <FolderOpen className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Images</p>
              <p className="text-2xl font-bold text-gray-900">
                {files.filter(f => f.mimeType.startsWith('image/')).length}
              </p>
            </div>
            <UploadIcon className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Documents</p>
              <p className="text-2xl font-bold text-gray-900">
                {files.filter(f => f.mimeType === 'application/pdf').length}
              </p>
            </div>
            <Download className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Size</p>
              <p className="text-2xl font-bold text-gray-900">
                {(files.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024).toFixed(1)} MB
              </p>
            </div>
            <Trash2 className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Upload Area */}
      {showUpload && (
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Upload Files</h2>
          <FileUpload
            options={uploadOptions}
            onUpload={handleUpload}
            multiple={true}
          />
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as FileCategory | 'all')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {Object.values(FileCategory).map((category) => (
                <option key={category} value={category}>
                  {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* File List */}
      <FileList
        files={filteredFiles}
        onDownload={handleDownload}
        onDelete={handleDelete}
      />
    </div>
  )
}
