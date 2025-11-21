import { z } from 'zod';
import { INSURANCE_COMPANIES, WARRANTY_COMPANIES } from '@/types/estimate';

// Phone number validation (US format) - accepts (XXX) XXX-XXXX format
const phoneRegex = /^\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

// Step 1: Basic Information
export const step1Schema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50),
  phone: z.string().regex(phoneRegex, 'Please enter a valid phone number (e.g., (321) 960-8661)'),
  email: z.string().email('Please enter a valid email address'),
  serviceType: z.enum(['bodyshop', 'mechanic'], {
    required_error: 'Please select a service type',
  }),
});

export type Step1FormData = z.infer<typeof step1Schema>;

// Step 2A: Body Shop Service Details
export const step2BodyshopSchema = z.object({
  insuranceCompany: z.string().min(1, 'Please select who will pay for the repair'),
  claimNumber: z.string().optional(),
  hasClaimNumber: z.boolean().optional(),
  preferredDate: z.string().optional(),
});

export type Step2BodyshopFormData = z.infer<typeof step2BodyshopSchema>;

// Step 2B: Mechanic Service Details
export const step2MechanicSchema = z.object({
  warrantyCompany: z.string().min(1, 'Please select who will pay for the repair'),
  warrantyClaimNumber: z.string().optional(),
  hasWarrantyClaimNumber: z.boolean().optional(),
  preferredDate: z.string().optional(),
});

export type Step2MechanicFormData = z.infer<typeof step2MechanicSchema>;

// Step 3: Vehicle Photos (Body Shop only)
export const step3PhotosSchema = z.object({
  photos: z.object({
    // Required photos
    frontRight: z.string({ required_error: 'Front right photo is required' }).min(1),
    frontLeft: z.string({ required_error: 'Front left photo is required' }).min(1),
    rearRight: z.string({ required_error: 'Rear right photo is required' }).min(1),
    rearLeft: z.string({ required_error: 'Rear left photo is required' }).min(1),
    vinNumber: z.string({ required_error: 'VIN number photo is required' }).min(1),
    mainDamage: z.string({ required_error: 'Main damage photo is required' }).min(1),
    // Optional detail photos (up to 6)
    details: z.array(z.string()).max(6, 'Maximum 6 detail photos allowed').optional(),
  }),
});

export type Step3PhotosFormData = z.infer<typeof step3PhotosSchema>;

// Step 4: Contact Preferences
export const step4ContactSchema = z.object({
  contactPreferences: z.object({
    phoneCall: z.boolean(),
    whatsapp: z.boolean(),
    textMessage: z.boolean(),
  }).refine(
    (prefs) => prefs.phoneCall || prefs.whatsapp || prefs.textMessage,
    {
      message: 'Please select at least one contact method',
      path: ['contactPreferences'],
    }
  ),
  additionalNotes: z.string().max(500, 'Additional notes must be less than 500 characters').optional(),
});

export type Step4ContactFormData = z.infer<typeof step4ContactSchema>;

// Complete Estimate Request Schema
export const estimateRequestSchema = z.object({
  // Basic Info
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  phone: z.string().regex(phoneRegex),
  email: z.string().email(),
  serviceType: z.enum(['bodyshop', 'mechanic']),
  
  // Body Shop specific
  insuranceCompany: z.string().optional(),
  claimNumber: z.string().optional(),
  hasClaimNumber: z.boolean().optional(),
  
  // Mechanic specific
  warrantyCompany: z.string().optional(),
  warrantyClaimNumber: z.string().optional(),
  hasWarrantyClaimNumber: z.boolean().optional(),
  
  // Scheduling
  preferredDate: z.string().optional(),
  dateSkipped: z.boolean().optional(),
  
  // Photos
  photos: z.object({
    frontRight: z.string().optional(),
    frontLeft: z.string().optional(),
    rearRight: z.string().optional(),
    rearLeft: z.string().optional(),
    vinNumber: z.string().optional(),
    mainDamage: z.string().optional(),
    details: z.array(z.string()).optional(),
  }).optional(),
  
  // Contact
  contactPreferences: z.object({
    phoneCall: z.boolean(),
    whatsapp: z.boolean(),
    textMessage: z.boolean(),
  }),
  additionalNotes: z.string().optional(),
  
  // Auto-generated fields
  referenceNumber: z.string().optional(),
  status: z.literal('new').optional(),
  source: z.literal('website_form').optional(),
  createdAt: z.string().optional(),
});

export type EstimateRequestFormData = z.infer<typeof estimateRequestSchema>;
