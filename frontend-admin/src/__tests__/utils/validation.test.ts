import { 
  validateEmail, 
  validatePhoneNumber, 
  validatePassword,
  validateZipCode,
  validateVIN,
} from '@/lib/utils/validation'

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name+tag@example.co.uk')).toBe(true)
      expect(validateEmail('test123@test-domain.com')).toBe(true)
    })

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
      expect(validateEmail('test@.com')).toBe(false)
      expect(validateEmail('')).toBe(false)
    })
  })

  describe('validatePhoneNumber', () => {
    it('should validate correct US phone numbers', () => {
      expect(validatePhoneNumber('1234567890')).toBe(true)
      expect(validatePhoneNumber('(123) 456-7890')).toBe(true)
      expect(validatePhoneNumber('123-456-7890')).toBe(true)
      expect(validatePhoneNumber('+1 (123) 456-7890')).toBe(true)
    })

    it('should reject invalid phone numbers', () => {
      expect(validatePhoneNumber('123')).toBe(false)
      expect(validatePhoneNumber('12345')).toBe(false)
      expect(validatePhoneNumber('abcdefghij')).toBe(false)
      expect(validatePhoneNumber('')).toBe(false)
    })
  })

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      expect(validatePassword('Password123!')).toBe(true)
      expect(validatePassword('MyP@ssw0rd')).toBe(true)
      expect(validatePassword('Str0ng!Pass')).toBe(true)
    })

    it('should reject weak passwords', () => {
      expect(validatePassword('short')).toBe(false) // Too short
      expect(validatePassword('alllowercase')).toBe(false) // No uppercase
      expect(validatePassword('ALLUPPERCASE')).toBe(false) // No lowercase
      expect(validatePassword('NoNumbers!')).toBe(false) // No numbers
      expect(validatePassword('NoSpecial123')).toBe(false) // No special chars
      expect(validatePassword('')).toBe(false)
    })
  })

  describe('validateZipCode', () => {
    it('should validate correct US zip codes', () => {
      expect(validateZipCode('12345')).toBe(true)
      expect(validateZipCode('12345-6789')).toBe(true)
      expect(validateZipCode('90210')).toBe(true)
    })

    it('should reject invalid zip codes', () => {
      expect(validateZipCode('1234')).toBe(false)
      expect(validateZipCode('123456')).toBe(false)
      expect(validateZipCode('abcde')).toBe(false)
      expect(validateZipCode('')).toBe(false)
    })
  })

  describe('validateVIN', () => {
    it('should validate correct VIN numbers', () => {
      expect(validateVIN('1HGBH41JXMN109186')).toBe(true)
      expect(validateVIN('2HGFG12678H542890')).toBe(true)
      expect(validateVIN('3VWFE21C04M000001')).toBe(true)
    })

    it('should reject invalid VIN numbers', () => {
      expect(validateVIN('SHORT')).toBe(false) // Too short
      expect(validateVIN('TOOLONGVIN1234567890')).toBe(false) // Too long
      expect(validateVIN('1HGBH41JXMN10918O')).toBe(false) // Contains O
      expect(validateVIN('1HGBH41JXMN10918I')).toBe(false) // Contains I
      expect(validateVIN('1HGBH41JXMN10918Q')).toBe(false) // Contains Q
      expect(validateVIN('')).toBe(false)
    })
  })
})
