import { z } from 'zod';
import { CustomerStatus, CustomerType } from '@/types/customer';

/**
 * Create customer schema
 */
export const createCustomerSchema = z.object({
  // Basic info
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  phone: z
    .string()
    .min(1, 'Phone is required')
    .regex(/^[\d\s\-\+\(\)]+$/, 'Invalid phone number format'),
  type: z.nativeEnum(CustomerType, {
    required_error: 'Customer type is required',
  }),

  // Address (optional)
  address: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(50).optional(),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format').optional().or(z.literal('')),

  // Business info (optional)
  businessName: z.string().max(100).optional(),
  taxId: z.string().max(50).optional(),

  // Preferences
  preferredContactMethod: z.enum(['email', 'phone', 'sms']).optional(),
  languagePreference: z.string().max(10).optional(),
});

export type CreateCustomerFormData = z.infer<typeof createCustomerSchema>;

/**
 * Update customer schema
 */
export const updateCustomerSchema = createCustomerSchema.partial().extend({
  status: z.nativeEnum(CustomerStatus).optional(),
  assignedToId: z.string().uuid().optional(),
});

export type UpdateCustomerFormData = z.infer<typeof updateCustomerSchema>;

/**
 * Update customer status schema
 */
export const updateCustomerStatusSchema = z.object({
  status: z.nativeEnum(CustomerStatus),
  statusNote: z.string().max(500).optional(),
});

export type UpdateCustomerStatusFormData = z.infer<typeof updateCustomerStatusSchema>;

/**
 * Assign customer schema
 */
export const assignCustomerSchema = z.object({
  assignedToId: z.string().uuid('Invalid user ID'),
});

export type AssignCustomerFormData = z.infer<typeof assignCustomerSchema>;
