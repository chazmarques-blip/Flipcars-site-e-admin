/**
 * Validate an email address
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate a US phone number
 * Accepts formats: 1234567890, (123) 456-7890, 123-456-7890, +1 (123) 456-7890
 */
export function validatePhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  
  // Must be 10 digits, or 11 digits starting with 1
  if (cleaned.length === 10) return true
  if (cleaned.length === 11 && cleaned.startsWith('1')) return true
  
  return false
}

/**
 * Validate a password
 * Requirements: At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
 */
export function validatePassword(password: string): boolean {
  if (password.length < 8) return false
  
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
  
  return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar
}

/**
 * Validate a US zip code
 * Accepts formats: 12345, 12345-6789
 */
export function validateZipCode(zipCode: string): boolean {
  const zipRegex = /^\d{5}(-\d{4})?$/
  return zipRegex.test(zipCode)
}

/**
 * Validate a VIN (Vehicle Identification Number)
 * Must be exactly 17 characters, alphanumeric, excluding I, O, Q
 */
export function validateVIN(vin: string): boolean {
  if (vin.length !== 17) return false
  
  const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/
  return vinRegex.test(vin.toUpperCase())
}

/**
 * Validate a URL
 */
export function validateURL(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Validate a credit card number using Luhn algorithm
 */
export function validateCreditCard(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\D/g, '')
  
  if (cleaned.length < 13 || cleaned.length > 19) return false
  
  let sum = 0
  let isEven = false
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10)
    
    if (isEven) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    
    sum += digit
    isEven = !isEven
  }
  
  return sum % 10 === 0
}
