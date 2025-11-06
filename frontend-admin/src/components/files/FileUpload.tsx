'use client'

import { useCallback, useState } from 'react'
import { Upload, X, File, AlertCircle } from 'lucide-react'
import { FileUploadOptions, FileUploadProgress, FileStatus } from '@/types/file'
import { validateFile, formatFileSize } from '@/lib/utils/fileUtils'

interface FileUploadProps {
  options: FileUploadOptions
  onUpload: (files: File[]) => Promise<void>
  multiple?: boolean
  disabled?: boolean
}

export function FileUpload({
  options,
  onUpload,
  multiple = true,
  disabled = false,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<FileUploadProgress[]>([])
  const [errors, setErrors] = useState<string[]>([])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFiles = (files: File[]) => {
    const newErrors: string[] = []
    const validFiles: File[] = []

    files.forEach((file) => {
      const validation = validateFile(file, {
        maxSize: options.maxSize,
        allowedTypes: options.allowedTypes,
      })

      if (validation.valid) {
        validFiles.push(file)
      } else {
        newErrors.push(`${file.name}: ${validation.error}`)
      }
    })

    setErrors(newErrors)
    setSelectedFiles((prev) => (multiple ? [...prev, ...validFiles] : validFiles))
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      if (disabled) return

      const files = Array.from(e.dataTransfer.files)
      handleFiles(files)
    },
    [disabled, options, multiple]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return
      const files = Array.from(e.target.files)
      handleFiles(files)
    },
    [options, multiple]
  )

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return

    setErrors([])
    const progress: FileUploadProgress[] = selectedFiles.map((file, index) => ({
      fileId: `${index}`,
      filename: file.name,
      progress: 0,
      status: FileStatus.UPLOADING,
    }))
    setUploadProgress(progress)

    try {
      await onUpload(selectedFiles)
      
      // Update progress to completed
      setUploadProgress((prev) =>
        prev.map((p) => ({ ...p, progress: 100, status: FileStatus.COMPLETED }))
      )

      // Clear after successful upload
      setTimeout(() => {
        setSelectedFiles([])
        setUploadProgress([])
      }, 2000)
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'Upload failed'])
      setUploadProgress((prev) =>
        prev.map((p) => ({ ...p, status: FileStatus.FAILED }))
      )
    }
  }

  const isUploading = uploadProgress.length > 0 && 
    uploadProgress.some((p) => p.status === FileStatus.UPLOADING)

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8
          transition-all duration-200 cursor-pointer
          ${isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          type="file"
          multiple={multiple}
          disabled={disabled}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept={options.allowedTypes?.join(',')}
        />
        
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm font-medium text-gray-900">
            {isDragging ? 'Drop files here' : 'Drag & drop files here'}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            or click to browse
          </p>
          {options.maxSize && (
            <p className="mt-1 text-xs text-gray-400">
              Max file size: {formatFileSize(options.maxSize)}
            </p>
          )}
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800">
                Upload Errors
              </h3>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-900">
            Selected Files ({selectedFiles.length})
          </h3>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
              >
                <div className="flex items-center space-x-3">
                  <File className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                {!isUploading && (
                  <button
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Remove file"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {uploadProgress.length > 0 && (
        <div className="space-y-2">
          {uploadProgress.map((progress) => (
            <div key={progress.fileId} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">{progress.filename}</span>
                <span className="text-gray-500">
                  {progress.status === FileStatus.COMPLETED && '✓ Complete'}
                  {progress.status === FileStatus.UPLOADING && `${progress.progress}%`}
                  {progress.status === FileStatus.FAILED && '✗ Failed'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    progress.status === FileStatus.COMPLETED
                      ? 'bg-green-500'
                      : progress.status === FileStatus.FAILED
                      ? 'bg-red-500'
                      : 'bg-blue-500'
                  }`}
                  style={{ width: `${progress.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {selectedFiles.length > 0 && uploadProgress.length === 0 && (
        <button
          onClick={handleUpload}
          disabled={disabled || isUploading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Upload {selectedFiles.length} {selectedFiles.length === 1 ? 'File' : 'Files'}
        </button>
      )}
    </div>
  )
}
