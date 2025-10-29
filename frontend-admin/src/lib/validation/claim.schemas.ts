import { z } from 'zod';
import { ClaimStatus, ClaimPriority, DamageType } from '@/types/claim';

/**
 * Create claim schema
 */
export const createClaimSchema = z.object({
  // Customer info
  customerId: z.string().uuid('Invalid customer ID'),

  // Vehicle info
  vehicleMake: z.string().max(50).optional(),
  vehicleModel: z.string().max(50).optional(),
  vehicleYear: z.string().regex(/^\d{4}$/, 'Year must be 4 digits').optional().or(z.literal('')),
  vehiclePlate: z.string().max(20).optional(),
  vehicleVin: z.string().max(17, 'VIN must be 17 characters').optional(),

  // Incident details
  incidentDate: z.string().min(1, 'Incident date is required'),
  incidentLocation: z.string().max(200).optional(),
  incidentDescription: z
    .string()
    .min(1, 'Incident description is required')
    .min(10, 'Please provide at least 10 characters')
    .max(2000, 'Description must be less than 2000 characters'),
  damageType: z.nativeEnum(DamageType, {
    required_error: 'Damage type is required',
  }),
  damageDescription: z.string().max(1000).optional(),
  policeReportNumber: z.string().max(50).optional(),

  // Financial
  estimatedAmount: z.number().min(0, 'Amount must be positive').optional(),

  // Insurance info
  insuranceCompany: z.string().max(100).optional(),
  insurancePolicyNumber: z.string().max(50).optional(),
  insuranceClaimNumber: z.string().max(50).optional(),
});

export type CreateClaimFormData = z.infer<typeof createClaimSchema>;

/**
 * Update claim schema
 */
export const updateClaimSchema = createClaimSchema.partial().extend({
  status: z.nativeEnum(ClaimStatus).optional(),
  priority: z.nativeEnum(ClaimPriority).optional(),
  assignedToId: z.string().uuid().optional(),
  approvedAmount: z.number().min(0).optional(),
  paidAmount: z.number().min(0).optional(),
  aiRiskScore: z.number().min(0).max(100).optional(),
  aiRiskNotes: z.string().optional(),
  aiFraudIndicators: z.array(z.string()).optional(),
});

export type UpdateClaimFormData = z.infer<typeof updateClaimSchema>;

/**
 * Update claim status schema
 */
export const updateClaimStatusSchema = z.object({
  status: z.nativeEnum(ClaimStatus),
  statusNote: z.string().max(500).optional(),
});

export type UpdateClaimStatusFormData = z.infer<typeof updateClaimStatusSchema>;

/**
 * Assign claim schema
 */
export const assignClaimSchema = z.object({
  assignedToId: z.string().uuid('Invalid user ID'),
});

export type AssignClaimFormData = z.infer<typeof assignClaimSchema>;

/**
 * Approve claim schema
 */
export const approveClaimSchema = z.object({
  approvedAmount: z
    .number()
    .min(0, 'Amount must be positive')
    .max(10000000, 'Amount exceeds maximum'),
  approvalNotes: z.string().max(1000).optional(),
});

export type ApproveClaimFormData = z.infer<typeof approveClaimSchema>;

/**
 * Reject claim schema
 */
export const rejectClaimSchema = z.object({
  rejectionReason: z
    .string()
    .min(1, 'Rejection reason is required')
    .min(10, 'Please provide at least 10 characters')
    .max(1000, 'Reason must be less than 1000 characters'),
});

export type RejectClaimFormData = z.infer<typeof rejectClaimSchema>;
