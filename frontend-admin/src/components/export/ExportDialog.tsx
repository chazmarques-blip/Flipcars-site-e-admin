'use client'

import { useState } from 'react'
import { X, Download, FileText, FileSpreadsheet, FileJson } from 'lucide-react'
import { 
  ExportFormat, 
  ExportColumn,
  CSVExportOptions,
  PDFExportOptions,
  ExcelExportOptions,
} from '@/types/export'
import { exportData, generateFilename } from '@/lib/utils/exportUtils'

interface ExportDialogProps<T> {
  data: T[]
  columns: ExportColumn[]
  defaultFilename: string
  title?: string
  description?: string
  onClose: () => void
}

export function ExportDialog<T>({
  data,
  columns,
  defaultFilename,
  title,
  description,
  onClose,
}: ExportDialogProps<T>) {
  const [format, setFormat] = useState<ExportFormat>(ExportFormat.CSV)
  const [filename, setFilename] = useState(defaultFilename)
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    columns.map((col) => col.key)
  )
  const [includeHeaders, setIncludeHeaders] = useState(true)
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)

    try {
      const exportColumns = columns.filter((col) =>
        selectedColumns.includes(col.key)
      )

      const fullFilename = generateFilename(filename, format, true)

      const baseOptions = {
        format,
        filename: fullFilename,
        columns: exportColumns,
        includeHeaders,
      }

      switch (format) {
        case ExportFormat.CSV:
          const csvOptions: CSVExportOptions = {
            ...baseOptions,
            delimiter: ',',
            encoding: 'utf-8',
          }
          exportData(data, format, csvOptions)
          break

        case ExportFormat.PDF:
          const pdfOptions: PDFExportOptions = {
            ...baseOptions,
            orientation,
            pageSize: 'a4',
            title: title || defaultFilename,
            description,
            fontSize: 10,
            showPageNumbers: true,
            showDate: true,
          }
          exportData(data, format, pdfOptions)
          break

        case ExportFormat.EXCEL:
          const excelOptions: ExcelExportOptions = {
            ...baseOptions,
            sheetName: 'Data',
            autoWidth: true,
            freezeHeader: true,
            applyFilters: true,
            applyFormatting: true,
          }
          exportData(data, format, excelOptions)
          break

        case ExportFormat.JSON:
          exportData(data, format, baseOptions)
          break
      }

      // Close dialog after successful export
      setTimeout(() => {
        setIsExporting(false)
        onClose()
      }, 500)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
      setIsExporting(false)
    }
  }

  const toggleColumn = (columnKey: string) => {
    setSelectedColumns((prev) =>
      prev.includes(columnKey)
        ? prev.filter((key) => key !== columnKey)
        : [...prev, columnKey]
    )
  }

  const selectAllColumns = () => {
    setSelectedColumns(columns.map((col) => col.key))
  }

  const deselectAllColumns = () => {
    setSelectedColumns([])
  }

  const formatOptions = [
    {
      value: ExportFormat.CSV,
      label: 'CSV',
      description: 'Comma-separated values',
      icon: FileText,
    },
    {
      value: ExportFormat.PDF,
      label: 'PDF',
      description: 'Portable document format',
      icon: FileText,
    },
    {
      value: ExportFormat.EXCEL,
      label: 'Excel',
      description: 'Microsoft Excel spreadsheet',
      icon: FileSpreadsheet,
    },
    {
      value: ExportFormat.JSON,
      label: 'JSON',
      description: 'JavaScript object notation',
      icon: FileJson,
    },
  ]

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative h-full flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div className="flex items-center space-x-3">
              <Download className="h-5 w-5 text-blue-600" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Export Data</h2>
                <p className="text-sm text-gray-500">
                  {data.length} record{data.length !== 1 ? 's' : ''} selected
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Format Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Export Format *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {formatOptions.map((option) => {
                  const Icon = option.icon
                  return (
                    <button
                      key={option.value}
                      onClick={() => setFormat(option.value)}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        format === option.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`h-6 w-6 ${
                          format === option.value ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium ${
                            format === option.value ? 'text-blue-900' : 'text-gray-900'
                          }`}>
                            {option.label}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Filename */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filename *
              </label>
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="export"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                File extension will be added automatically
              </p>
            </div>

            {/* PDF Orientation */}
            {format === ExportFormat.PDF && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Orientation
                </label>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setOrientation('portrait')}
                    className={`flex-1 px-4 py-2 border rounded-lg ${
                      orientation === 'portrait'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    Portrait
                  </button>
                  <button
                    onClick={() => setOrientation('landscape')}
                    className={`flex-1 px-4 py-2 border rounded-lg ${
                      orientation === 'landscape'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    Landscape
                  </button>
                </div>
              </div>
            )}

            {/* Column Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Columns to Export ({selectedColumns.length}/{columns.length})
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={selectAllColumns}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    Select All
                  </button>
                  <span className="text-xs text-gray-400">|</span>
                  <button
                    onClick={deselectAllColumns}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    Deselect All
                  </button>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-3 max-h-48 overflow-y-auto">
                <div className="space-y-2">
                  {columns.map((column) => (
                    <label
                      key={column.key}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes(column.key)}
                        onChange={() => toggleColumn(column.key)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{column.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Options */}
            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeHeaders}
                  onChange={(e) => setIncludeHeaders(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Include column headers</span>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Export will download to your device
            </p>
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                disabled={isExporting}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                disabled={isExporting || selectedColumns.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
