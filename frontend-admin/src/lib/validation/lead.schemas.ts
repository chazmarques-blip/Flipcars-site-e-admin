import { z } from 'zod';
import { LeadStatus, LeadPriority } from '@/types/lead';

/**
 * Create lead schema
 */
export const createLeadSchema = z.object({
  // Customer info
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

  // Vehicle info (optional)
  vehicleMake: z.string().max(50).optional(),
  vehicleModel: z.string().max(50).optional(),
  vehicleYear: z.string().regex(/^\d{4}$/, 'Year must be 4 digits').optional().or(z.literal('')),
  vehiclePlate: z.string().max(20).optional(),

  // Accident info
  accidentDate: z.string().optional(),
  accidentDescription: z.string().max(1000).optional(),
  hasInsurance: z.boolean().default(false),
  insuranceCompany: z.string().max(100).optional(),
  insurancePolicyNumber: z.string().max(50).optional(),

  // Lead source
  source: z.string().max(50).optional(),
});

export type CreateLeadFormData = z.infer<typeof createLeadSchema>;

/**
 * Update lead schema
 */
export const updateLeadSchema = createLeadSchema.partial().extend({
  status: z.nativeEnum(LeadStatus).optional(),
  priority: z.nativeEnum(LeadPriority).optional(),
  assignedToId: z.string().uuid().optional(),
  aiQualificationScore: z.number().min(0).max(100).optional(),
  aiQualificationNotes: z.string().optional(),
});

export type UpdateLeadFormData = z.infer<typeof updateLeadSchema>;

/**
 * Update lead status schema
 */
export const updateLeadStatusSchema = z.object({
  status: z.nativeEnum(LeadStatus),
  statusNote: z.string().max(500).optional(),
});

export type UpdateLeadStatusFormData = z.infer<typeof updateLeadStatusSchema>;

/**
 * Assign lead schema
 */
export const assignLeadSchema = z.object({
  assignedToId: z.string().uuid('Invalid user ID'),
});

export type AssignLeadFormData = z.infer<typeof assignLeadSchema>;

/**
 * Qualify lead schema
 */
export const qualifyLeadSchema = z.object({
  aiQualificationScore: z
    .number()
    .min(0, 'Score must be between 0 and 100')
    .max(100, 'Score must be between 0 and 100'),
  aiQualificationNotes: z.string().max(1000).optional(),
});

export type QualifyLeadFormData = z.infer<typeof qualifyLeadSchema>;
