// Estimate Form Types

export type ServiceType = 'bodyshop' | 'mechanic';

export interface EstimatePhotos {
  driverFront?: string;
  passengerFront?: string;
  driverRear?: string;
  passengerRear?: string;
  vinNumber?: string;
  odometer?: string;
  details?: string[]; // Up to 6 optional detail photos
}

export interface WarrantyDocuments {
  policyDocument?: File | string;
  vinPhoto?: File | string;
  odometerPhoto?: File | string;
  selectedIssues: string[];
  symptomsDescription?: string; // CHANGED: Now optional
}

export interface VehicleInfo {
  vin: string;
  year?: string;
  make?: string;
  model?: string;
}

export interface ContactPreferences {
  phoneCall: boolean;
  whatsapp: boolean;
  textMessage: boolean;
}

export interface EstimateRequest {
  // Step 1: Basic Info
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  serviceType: ServiceType;
  
  // Step 2A: Body Shop
  insuranceCompany?: string;
  claimNumber?: string;
  hasClaimNumber?: boolean;
  
  // Step 2B: Mechanic
  warrantyCompany?: string;
  warrantyClaimNumber?: string;
  hasWarrantyClaimNumber?: boolean;
  
  // Scheduling
  preferredDate?: string; // ISO date
  dateSkipped?: boolean;
  
  // Step 2.5: Warranty Documents (Mechanic only)
  warrantyDocs?: WarrantyDocuments;
  
  // Step 3: Photos (Body Shop only)
  photos?: EstimatePhotos;
  
  // Vehicle Information (from VIN)
  vehicle?: VehicleInfo;
  preferredTimeSlot?: string; // Time slot for appointment
  
  // Step 4: Contact Preference
  contactPreferences: ContactPreferences;
  additionalNotes?: string;
  
  // Auto-generated
  referenceNumber?: string; // FL-2024-XXXX
  status?: 'new';
  source?: 'website_form';
  createdAt?: string;
}

// Form step data interfaces for multi-step form
export interface Step1Data {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  serviceType: ServiceType;
}

export interface Step2BodyshopData {
  insuranceCompany: string;
  claimNumber?: string;
  hasClaimNumber?: boolean;
  preferredDate?: string;
}

export interface Step2MechanicData {
  warrantyCompany: string;
  warrantyClaimNumber?: string;
  hasWarrantyClaimNumber?: boolean;
  preferredDate?: string;
}

export interface Step3PhotosData {
  photos: EstimatePhotos;
  vehicle?: VehicleInfo;
}

export interface Step4ContactData {
  contactPreferences: ContactPreferences;
  additionalNotes?: string;
}

// Insurance and Warranty company lists
export const INSURANCE_COMPANIES = [
  'Private (Self-Pay)',
  'Allstate',
  'American Family',
  'Erie Insurance',
  'Farmers Insurance',
  'Geico',
  'Liberty Mutual',
  'Nationwide',
  'Progressive',
  'State Farm',
  'Travelers',
  'USAA',
  'Other',
] as const;

export const WARRANTY_COMPANIES = [
  'Private (Self-Pay)',
  'CARCHEX',
  'CarShield',
  'Choice',
  'Concord',
  'Endurance',
  'Olive',
  'Protect My Car',
  'ProGuard',
  'Toco',
  'Other',
] as const;

export type InsuranceCompany = typeof INSURANCE_COMPANIES[number];
export type WarrantyCompany = typeof WARRANTY_COMPANIES[number];

// Time slots for scheduling (2-hour intervals)
export const TIME_SLOTS = [
  { value: '9:00-11:00', label: '9:00 AM - 11:00 AM' },
  { value: '11:00-13:00', label: '11:00 AM - 1:00 PM' },
  { value: '13:00-15:00', label: '1:00 PM - 3:00 PM' },
  { value: '15:00-17:00', label: '3:00 PM - 5:00 PM' },
] as const;

// Saturday-only time slots (shorter hours: 9:00 AM - 12:30 PM)
export const SATURDAY_TIME_SLOTS = [
  { value: '9:00-11:00', label: '9:00 AM - 11:00 AM' },
  { value: '11:00-12:30', label: '11:00 AM - 12:30 PM' },
] as const;

export type TimeSlot = typeof TIME_SLOTS[number]['value'];

// Business hours configuration
export interface BusinessHours {
  monday: { open: string; close: string };
  tuesday: { open: string; close: string };
  wednesday: { open: string; close: string };
  thursday: { open: string; close: string };
  friday: { open: string; close: string };
  saturday: { open: string; close: string };
  sunday: null; // Closed
}

export const BUSINESS_HOURS: BusinessHours = {
  monday: { open: '9:00', close: '18:00' },
  tuesday: { open: '9:00', close: '18:00' },
  wednesday: { open: '9:00', close: '18:00' },
  thursday: { open: '9:00', close: '18:00' },
  friday: { open: '9:00', close: '18:00' },
  saturday: { open: '9:00', close: '12:30' }, // Saturday closes at 12:30 PM
  sunday: null, // Closed on Sundays
};

// Photo upload configuration
export interface PhotoUploadConfig {
  maxSizeBytes: number; // 10MB
  acceptedFormats: string[];
  compressionQuality: number;
  maxDimension: number; // Max width/height in pixels
}

export const PHOTO_CONFIG: PhotoUploadConfig = {
  maxSizeBytes: 10 * 1024 * 1024, // 10MB
  acceptedFormats: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  compressionQuality: 0.8,
  maxDimension: 1920,
};

// FlipCars location information
export const FLIPCARS_LOCATION = {
  name: 'FlipCars Auto Repair',
  address: '5200 Old Winter Garden Rd, Suite 110, Orlando, FL 32811',
  phone: '(321) 960-8661',
  email: 'info@flipcars.us',
  coordinates: {
    lat: 28.5080,
    lng: -81.4354,
  },
  googleMapsUrl: 'https://www.google.com/maps/place/5200+Old+Winter+Garden+Rd+Suite+110,+Orlando,+FL+32811',
  embedMapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.7!2d-81.4354!3d28.5080!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88e77e6d4c7f7f7f%3A0x1234567890abcdef!2s5200%20Old%20Winter%20Garden%20Rd%20Suite%20110%2C%20Orlando%2C%20FL%2032811!5e0!3m2!1sen!2sus!4v1731147600000',
};
