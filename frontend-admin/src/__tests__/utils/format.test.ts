import { formatCurrency, formatDate, formatPhoneNumber } from '@/lib/utils/format'

describe('Format Utilities', () => {
  describe('formatCurrency', () => {
    it('should format positive numbers correctly', () => {
      expect(formatCurrency(1000)).toBe('$1,000.00')
      expect(formatCurrency(1234.56)).toBe('$1,234.56')
      expect(formatCurrency(0)).toBe('$0.00')
    })

    it('should format negative numbers correctly', () => {
      expect(formatCurrency(-1000)).toBe('-$1,000.00')
      expect(formatCurrency(-1234.56)).toBe('-$1,234.56')
    })

    it('should handle decimal precision', () => {
      expect(formatCurrency(1234.567)).toBe('$1,234.57')
      expect(formatCurrency(1234.5)).toBe('$1,234.50')
    })

    it('should handle large numbers', () => {
      expect(formatCurrency(1000000)).toBe('$1,000,000.00')
      expect(formatCurrency(1234567.89)).toBe('$1,234,567.89')
    })
  })

  describe('formatDate', () => {
    it('should format date strings correctly', () => {
      const date = '2024-01-15T10:30:00Z'
      const result = formatDate(date)
      expect(result).toMatch(/Jan 15, 2024/)
    })

    it('should format date objects correctly', () => {
      const date = new Date('2024-01-15T10:30:00Z')
      const result = formatDate(date)
      expect(result).toMatch(/Jan 15, 2024/)
    })

    it('should handle custom format strings', () => {
      const date = '2024-01-15T10:30:00Z'
      const result = formatDate(date, 'yyyy-MM-dd')
      expect(result).toBe('2024-01-15')
    })

    it('should handle invalid dates', () => {
      const result = formatDate('invalid-date')
      expect(result).toBe('Invalid Date')
    })
  })

  describe('formatPhoneNumber', () => {
    it('should format 10-digit phone numbers', () => {
      expect(formatPhoneNumber('1234567890')).toBe('(123) 456-7890')
      expect(formatPhoneNumber('5551234567')).toBe('(555) 123-4567')
    })

    it('should handle already formatted phone numbers', () => {
      expect(formatPhoneNumber('(123) 456-7890')).toBe('(123) 456-7890')
    })

    it('should handle phone numbers with country code', () => {
      expect(formatPhoneNumber('+11234567890')).toBe('+1 (123) 456-7890')
    })

    it('should handle invalid phone numbers', () => {
      expect(formatPhoneNumber('123')).toBe('123')
      expect(formatPhoneNumber('abc')).toBe('abc')
      expect(formatPhoneNumber('')).toBe('')
    })

    it('should strip non-numeric characters', () => {
      expect(formatPhoneNumber('123-456-7890')).toBe('(123) 456-7890')
      expect(formatPhoneNumber('123.456.7890')).toBe('(123) 456-7890')
    })
  })
})
