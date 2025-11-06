import Papa from 'papaparse'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import {
  ExportFormat,
  ExportColumn,
  CSVExportOptions,
  PDFExportOptions,
  ExcelExportOptions,
} from '@/types/export'

// Helper to format data based on column configuration
function formatValue(value: unknown, column: ExportColumn): string {
  if (column.format) {
    return column.format(value)
  }
  
  if (value === null || value === undefined) {
    return ''
  }
  
  return String(value)
}

// Helper to prepare data for export
function prepareData<T>(
  data: T[],
  columns?: ExportColumn[]
): Array<Record<string, unknown>> {
  if (!columns) {
    return data as Array<Record<string, unknown>>
  }

  return data.map((item) => {
    const row: Record<string, unknown> = {}
    columns.forEach((column) => {
      const value = (item as Record<string, unknown>)[column.key]
      row[column.label] = formatValue(value, column)
    })
    return row
  })
}

// CSV Export
export function exportToCSV<T>(
  data: T[],
  options: CSVExportOptions
): void {
  const preparedData = prepareData(data, options.columns)
  
  const csv = Papa.unparse(preparedData, {
    delimiter: options.delimiter || ',',
    header: options.includeHeaders !== false,
    newline: options.lineTerminator || '\n',
  })

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  downloadBlob(blob, options.filename)
}

// PDF Export
export function exportToPDF<T>(
  data: T[],
  options: PDFExportOptions
): void {
  const doc = new jsPDF({
    orientation: options.orientation || 'portrait',
    unit: 'mm',
    format: options.pageSize || 'a4',
  })

  // Add title
  if (options.title) {
    doc.setFontSize(16)
    doc.text(options.title, 14, 15)
  }

  // Add description
  if (options.description) {
    doc.setFontSize(10)
    doc.text(options.description, 14, options.title ? 22 : 15)
  }

  // Prepare table data
  const columns = options.columns || []
  const headers = columns.map((col) => col.label)
  const rows = data.map((item) =>
    columns.map((col) => {
      const value = (item as Record<string, unknown>)[col.key]
      return formatValue(value, col)
    })
  )

  // Add table
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: options.title || options.description ? 30 : 15,
    styles: {
      fontSize: options.fontSize || 10,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [59, 130, 246], // blue-600
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251], // gray-50
    },
    margin: {
      top: options.marginTop || 10,
      bottom: options.marginBottom || 10,
      left: options.marginLeft || 10,
      right: options.marginRight || 10,
    },
    columnStyles: columns.reduce((acc, col, index) => {
      acc[index] = {
        cellWidth: col.width,
        halign: col.align || 'left',
      }
      return acc
    }, {} as Record<number, { cellWidth?: number; halign: 'left' | 'center' | 'right' }>),
  })

  // Add page numbers
  if (options.showPageNumbers !== false) {
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      )
    }
  }

  // Add date
  if (options.showDate !== false) {
    const date = new Date().toLocaleDateString()
    doc.setFontSize(8)
    doc.text(date, 14, doc.internal.pageSize.height - 10)
  }

  // Save PDF
  doc.save(options.filename)
}

// Excel Export
export function exportToExcel<T>(
  data: T[],
  options: ExcelExportOptions
): void {
  const preparedData = prepareData(data, options.columns)

  // Create workbook
  const wb = XLSX.utils.book_new()
  
  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(preparedData)

  // Auto-size columns
  if (options.autoWidth !== false) {
    const columns = options.columns || []
    const maxWidth = 50
    const wscols = columns.map((col) => ({
      wch: Math.min(Math.max(col.label.length, 10), maxWidth),
    }))
    ws['!cols'] = wscols
  }

  // Freeze header row
  if (options.freezeHeader !== false) {
    ws['!freeze'] = { xSplit: 0, ySplit: 1 }
  }

  // Apply filters
  if (options.applyFilters !== false && preparedData.length > 0) {
    const ref = XLSX.utils.encode_range({
      s: { c: 0, r: 0 },
      e: { c: Object.keys(preparedData[0]).length - 1, r: preparedData.length },
    })
    ws['!autofilter'] = { ref }
  }

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, options.sheetName || 'Sheet1')

  // Write file
  XLSX.writeFile(wb, options.filename)
}

// JSON Export
export function exportToJSON<T>(
  data: T[],
  filename: string,
  pretty = true
): void {
  const json = JSON.stringify(data, null, pretty ? 2 : 0)
  const blob = new Blob([json], { type: 'application/json' })
  downloadBlob(blob, filename)
}

// Generic export function
export function exportData<T>(
  data: T[],
  format: ExportFormat,
  options: CSVExportOptions | PDFExportOptions | ExcelExportOptions
): void {
  switch (format) {
    case ExportFormat.CSV:
      exportToCSV(data, options as CSVExportOptions)
      break
    case ExportFormat.PDF:
      exportToPDF(data, options as PDFExportOptions)
      break
    case ExportFormat.EXCEL:
      exportToExcel(data, options as ExcelExportOptions)
      break
    case ExportFormat.JSON:
      exportToJSON(data, options.filename)
      break
    default:
      throw new Error(`Unsupported export format: ${format}`)
  }
}

// Helper to download blob
function downloadBlob(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

// Helper to get file extension
export function getFileExtension(format: ExportFormat): string {
  switch (format) {
    case ExportFormat.CSV:
      return '.csv'
    case ExportFormat.PDF:
      return '.pdf'
    case ExportFormat.EXCEL:
      return '.xlsx'
    case ExportFormat.JSON:
      return '.json'
    default:
      return '.txt'
  }
}

// Helper to generate filename
export function generateFilename(
  prefix: string,
  format: ExportFormat,
  timestamp = true
): string {
  const ext = getFileExtension(format)
  const date = timestamp ? `_${new Date().toISOString().split('T')[0]}` : ''
  return `${prefix}${date}${ext}`
}
