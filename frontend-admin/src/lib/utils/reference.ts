/**
 * Generate a unique reference number for estimate requests
 * Format: FL-YYYY-XXXX (e.g., FL-2024-1234)
 */
export function generateReferenceNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  return `FL-${year}-${random}`;
}

/**
 * Validate reference number format
 */
export function isValidReferenceNumber(ref: string): boolean {
  const pattern = /^FL-\d{4}-\d{4}$/;
  return pattern.test(ref);
}

/**
 * Format phone number to standard format: (XXX) XXX-XXXX
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  
  return phone; // Return original if not 10 digits
}

/**
 * Parse formatted phone number to digits only
 */
export function parsePhoneNumber(phone: string): string {
  return phone.replace(/\D/g, '');
}
