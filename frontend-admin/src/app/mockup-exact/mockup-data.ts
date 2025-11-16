/**
 * MOCKUP EVENT DATA
 * Exact data structure from mockup (lines 8-548)
 * Preserves all fields from the production lead creation system
 */

export interface EventData {
  type: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  serviceType: string;
  insuranceCompany?: string;
  warrantyCompany?: string;
  claimNumber?: string | null;
  warrantyClaimNumber?: string | null;
  preferredDate: string;
  preferredTimeSlot: string;
  vin: string;
  vehicle: {
    year: string;
    make: string;
    model: string;
  };
  contactPreferences: {
    phoneCall: boolean;
    whatsapp: boolean;
    textMessage: boolean;
  };
  additionalNotes: string;
  leadReference: string;
  leadCreatedAt: string;
  leadSource: string;
  status: string;
  appointmentStatus?: string;
  confirmedAt?: string | null;
  confirmedBy?: string;
  paymentSchedule?: {
    totalAmount: string;
    numberOfInstallments: number;
    installmentAmount: string;
    currentInstallment: number;
    paidAmount: string;
    remainingAmount: string;
  };
  paymentMethod?: string;
  dueDate?: string;
  overdueDays?: string | null;
  paymentStatus?: string;
  adminNotes: string;
  warrantyDocs?: {
    selectedIssues: string[];
    symptomsDescription: string;
  };
}

export const mockEventData: Record<string, EventData> = {
  payment1: {
    type: 'Payment Overdue',
    firstName: 'John',
    lastName: 'Doe',
    phone: '(689) 221-3162',
    email: 'john.doe@email.com',
    serviceType: 'Body Shop',
    insuranceCompany: 'State Farm',
    claimNumber: 'SF-2025-98765',
    preferredDate: 'Oct 15, 2025',
    preferredTimeSlot: '9:00-11:00',
    vin: 'JA4J3VA85MZ041362',
    vehicle: {
      year: '2021',
      make: 'Mitsubishi',
      model: 'Outlander'
    },
    contactPreferences: {
      phoneCall: true,
      whatsapp: true,
      textMessage: false
    },
    additionalNotes: 'Prefer morning appointments',
    leadReference: '2025-1010-0001',
    leadCreatedAt: 'Oct 10, 2025',
    leadSource: 'Website Estimate Form',
    status: 'converted_to_customer',
    paymentSchedule: {
      totalAmount: '$1,101.24',
      numberOfInstallments: 6,
      installmentAmount: '$183.54',
      currentInstallment: 2,
      paidAmount: '$183.54',
      remainingAmount: '$734.16'
    },
    paymentMethod: 'Credit Card ending in 4532',
    dueDate: 'Nov 8, 2025',
    overdueDays: '7 days',
    paymentStatus: 'Overdue',
    adminNotes: 'Customer called on Nov 11. Will pay by Friday. Payment plan set up after approval.',
  },
  payment2: {
    type: 'Payment Overdue',
    firstName: 'Maria',
    lastName: 'Silva',
    phone: '(654) 945-0938',
    email: 'maria.silva@email.com',
    serviceType: 'Body Shop',
    insuranceCompany: 'Private (Self-Pay)',
    claimNumber: null,
    preferredDate: 'Oct 20, 2025',
    preferredTimeSlot: '13:00-15:00',
    vin: '5NPEB4AC1LH123456',
    vehicle: {
      year: '2020',
      make: 'Ford',
      model: 'EcoSport'
    },
    contactPreferences: {
      phoneCall: false,
      whatsapp: true,
      textMessage: true
    },
    additionalNotes: 'Prefer WhatsApp for quick communication',
    leadReference: '2025-1015-0001',
    leadCreatedAt: 'Oct 15, 2025',
    leadSource: 'Website Estimate Form',
    status: 'converted_to_customer',
    paymentSchedule: {
      totalAmount: '$292.60',
      numberOfInstallments: 2,
      installmentAmount: '$146.30',
      currentInstallment: 1,
      paidAmount: '$0.00',
      remainingAmount: '$292.60'
    },
    paymentMethod: 'Bank Transfer',
    dueDate: 'Nov 12, 2025',
    overdueDays: '3 days',
    paymentStatus: 'Overdue',
    adminNotes: 'First payment. Customer requested reminder. Private pay - no insurance.',
  },
  appt1: {
    type: 'Appointment',
    firstName: 'Bob',
    lastName: 'Johnson',
    phone: '(555) 123-4567',
    email: 'bob.johnson@email.com',
    serviceType: 'Body Shop',
    insuranceCompany: 'Progressive',
    claimNumber: 'PRG-2025-12345',
    preferredDate: 'Nov 15, 2025',
    preferredTimeSlot: '9:00-11:00',
    vin: '2HGFC2F59KH123456',
    vehicle: {
      year: '2019',
      make: 'Honda',
      model: 'Civic'
    },
    contactPreferences: {
      phoneCall: true,
      whatsapp: true,
      textMessage: false
    },
    additionalNotes: 'Please call 1 day before to confirm. Front bumper replacement and paint needed.',
    leadReference: '2025-1110-0001',
    leadCreatedAt: 'Nov 10, 2025',
    leadSource: 'Website Estimate Form',
    status: 'new',
    appointmentStatus: 'Scheduled',
    confirmedAt: null,
    adminNotes: 'Customer requested early morning slot. Waiting for parts. Need to follow up.',
  },
  appt2: {
    type: 'Appointment',
    firstName: 'Alice',
    lastName: 'Smith',
    phone: '(813) 786-5844',
    email: 'alice.smith@email.com',
    serviceType: 'Mechanic',
    warrantyCompany: 'Private (Self-Pay)',
    warrantyClaimNumber: null,
    preferredDate: 'Nov 14, 2025',
    preferredTimeSlot: '13:00-15:00',
    vin: '19XFC2F59KE123456',
    vehicle: {
      year: '2019',
      make: 'Honda',
      model: 'Civic'
    },
    contactPreferences: {
      phoneCall: false,
      whatsapp: false,
      textMessage: true
    },
    additionalNotes: 'Will bring coffee for the team :)',
    leadReference: '2025-1108-0001',
    leadCreatedAt: 'Nov 8, 2025',
    leadSource: 'Website Estimate Form',
    status: 'confirmed',
    appointmentStatus: 'Confirmed',
    confirmedAt: 'Nov 12, 2025 at 10:30 AM',
    confirmedBy: 'Admin User',
    adminNotes: 'Regular customer. VIP service. Confirmed by phone on Nov 12.',
    warrantyDocs: {
      selectedIssues: ['Oil Change', 'Safety Inspection'],
      symptomsDescription: 'Regular maintenance and safety inspection needed'
    },
  },
  payment3: {
    type: 'Payment Due',
    firstName: 'Sarah',
    lastName: 'Martinez',
    phone: '(689) 345-3214',
    email: 'sarah.martinez@email.com',
    serviceType: 'Body Shop',
    insuranceCompany: 'Allstate',
    claimNumber: 'ALL-2025-78901',
    preferredDate: 'Oct 25, 2025',
    preferredTimeSlot: '11:00-13:00',
    vin: '1C6RR7FT8LS123456',
    vehicle: {
      year: '2020',
      make: 'RAM',
      model: '2500'
    },
    contactPreferences: {
      phoneCall: true,
      whatsapp: false,
      textMessage: true
    },
    additionalNotes: 'Will pay in person at shop',
    leadReference: '2025-1020-0001',
    leadCreatedAt: 'Oct 20, 2025',
    leadSource: 'Website Estimate Form',
    status: 'converted_to_customer',
    paymentSchedule: {
      totalAmount: '$1,467.41',
      numberOfInstallments: 7,
      installmentAmount: '$209.63',
      currentInstallment: 1,
      paidAmount: '$0.00',
      remainingAmount: '$1,467.41'
    },
    paymentMethod: 'Cash',
    dueDate: 'Nov 15, 2025',
    overdueDays: null,
    paymentStatus: 'Pending',
    adminNotes: 'Customer prefers cash payments. First payment due tomorrow. Insurance approved the claim.',
  },
  payment_nov15_maria: {
    type: 'Payment Due',
    firstName: 'Maria',
    lastName: 'Garcia',
    phone: '(321) 456-7890',
    email: 'maria.garcia@email.com',
    serviceType: 'Body Shop',
    insuranceCompany: 'Private (Self-Pay)',
    claimNumber: null,
    preferredDate: 'Oct 18, 2025',
    preferredTimeSlot: '10:00-12:00',
    vin: '1HGCV1F39KA123456',
    vehicle: {
      year: '2019',
      make: 'Honda',
      model: 'Accord'
    },
    contactPreferences: {
      phoneCall: true,
      whatsapp: false,
      textMessage: true
    },
    additionalNotes: 'Prefer payment reminders via text message',
    leadReference: '2025-1010-0002',
    leadCreatedAt: 'Oct 10, 2025',
    leadSource: 'Website Estimate Form',
    status: 'converted_to_customer',
    paymentSchedule: {
      totalAmount: '$750.00',
      numberOfInstallments: 5,
      installmentAmount: '$150.00',
      currentInstallment: 3,
      paidAmount: '$450.00',
      remainingAmount: '$300.00'
    },
    paymentMethod: 'Cash',
    dueDate: 'Nov 15, 2025',
    overdueDays: null,
    paymentStatus: 'Pending',
    adminNotes: 'Regular customer. Always pays on time. This is payment 3 of 5.',
  },
  appt_nov15_robert: {
    type: 'Appointment',
    firstName: 'Robert',
    lastName: 'Williams',
    phone: '(407) 789-0123',
    email: 'robert.w@email.com',
    serviceType: 'Mechanic',
    warrantyCompany: 'Private (Self-Pay)',
    warrantyClaimNumber: null,
    preferredDate: 'Nov 15, 2025',
    preferredTimeSlot: '14:00-16:00',
    vin: '1FTFW1E84MFA12345',
    vehicle: {
      year: '2021',
      make: 'Ford',
      model: 'F-150'
    },
    contactPreferences: {
      phoneCall: true,
      whatsapp: false,
      textMessage: false
    },
    additionalNotes: 'Routine maintenance - oil change and safety inspection',
    leadReference: '2025-1115-0003',
    leadCreatedAt: 'Nov 14, 2025',
    leadSource: 'Website Estimate Form',
    status: 'confirmed',
    appointmentStatus: 'Confirmed',
    confirmedAt: 'Nov 14, 2025 at 2:30 PM',
    confirmedBy: 'Admin User',
    adminNotes: 'Regular customer. Quick service - oil change + inspection. Estimated $120.',
    warrantyDocs: {
      selectedIssues: ['Oil Change', 'Safety Inspection'],
      symptomsDescription: 'Routine maintenance - 5K miles since last service'
    },
  },
  mechanic_warranty1: {
    type: 'Appointment',
    firstName: 'Jennifer',
    lastName: 'Martinez',
    phone: '(407) 892-3451',
    email: 'jennifer.martinez@email.com',
    serviceType: 'Mechanic',
    warrantyCompany: 'CarShield',
    warrantyClaimNumber: 'CS-2025-45678',
    preferredDate: 'Nov 18, 2025',
    preferredTimeSlot: '10:00-12:00',
    vin: '1HGCV1F39LA123456',
    vehicle: {
      year: '2021',
      make: 'Honda',
      model: 'Accord'
    },
    contactPreferences: {
      phoneCall: true,
      whatsapp: true,
      textMessage: false
    },
    additionalNotes: 'Check engine light on. CarShield warranty active. Need diagnosis first.',
    leadReference: '2025-1116-0001',
    leadCreatedAt: 'Nov 16, 2025',
    leadSource: 'Website Estimate Form',
    status: 'new',
    appointmentStatus: 'Scheduled',
    confirmedAt: null,
    adminNotes: 'Warranty covered. Need to contact CarShield for approval before repairs. Diagnostic covered.',
    warrantyDocs: {
      selectedIssues: ['Engine Issue', 'Check Engine Light'],
      symptomsDescription: 'Check engine light came on 2 days ago. Engine sounds normal but light is steady on.'
    },
  },
  mechanic_private1: {
    type: 'Appointment',
    firstName: 'Michael',
    lastName: 'Chen',
    phone: '(321) 567-8901',
    email: 'michael.chen@email.com',
    serviceType: 'Mechanic',
    warrantyCompany: 'Private (Self-Pay)',
    warrantyClaimNumber: null,
    preferredDate: 'Nov 19, 2025',
    preferredTimeSlot: '14:00-16:00',
    vin: '3VWD17AJ9KM123456',
    vehicle: {
      year: '2019',
      make: 'Volkswagen',
      model: 'Jetta'
    },
    contactPreferences: {
      phoneCall: false,
      whatsapp: false,
      textMessage: true
    },
    additionalNotes: '30,000-mile service needed. Oil change, tire rotation, filter replacement.',
    leadReference: '2025-1117-0001',
    leadCreatedAt: 'Nov 17, 2025',
    leadSource: 'Website Estimate Form',
    status: 'confirmed',
    appointmentStatus: 'Confirmed',
    confirmedAt: 'Nov 17, 2025 at 4:15 PM',
    confirmedBy: 'Admin User',
    adminNotes: 'Regular customer. 30k service package. Quoted $280. Customer confirmed and paid deposit.',
    warrantyDocs: {
      selectedIssues: ['30k Service', 'Oil Change', 'Tire Rotation', 'Air Filter'],
      symptomsDescription: 'Scheduled maintenance - 30,000 miles. Follow manufacturer service schedule.'
    },
  },
  bodyshop_insurance1: {
    type: 'Appointment',
    firstName: 'David',
    lastName: 'Thompson',
    phone: '(863) 234-5678',
    email: 'david.thompson@email.com',
    serviceType: 'Body Shop',
    insuranceCompany: 'Allstate',
    claimNumber: 'ALLST-2025-56789',
    preferredDate: 'Nov 20, 2025',
    preferredTimeSlot: '9:00-11:00',
    vin: '5YJSA1E14HF123456',
    vehicle: {
      year: '2017',
      make: 'Tesla',
      model: 'Model S'
    },
    contactPreferences: {
      phoneCall: true,
      whatsapp: false,
      textMessage: true
    },
    additionalNotes: 'Need rental car. Insurance approved $4,500 estimate. Left side damage from parking lot accident.',
    leadReference: '2025-1118-0001',
    leadCreatedAt: 'Nov 18, 2025',
    leadSource: 'Website Estimate Form',
    status: 'new',
    appointmentStatus: 'Scheduled',
    confirmedAt: null,
    adminNotes: 'Insurance already approved $4,500 estimate. Customer needs loaner vehicle. 3-5 day repair expected.',
  },
  bodyshop_private1: {
    type: 'Appointment',
    firstName: 'Amanda',
    lastName: 'Rodriguez',
    phone: '(407) 345-6789',
    email: 'amanda.rodriguez@email.com',
    serviceType: 'Body Shop',
    insuranceCompany: 'Private (Self-Pay)',
    claimNumber: null,
    preferredDate: 'Nov 21, 2025',
    preferredTimeSlot: '13:00-15:00',
    vin: '1G1ZD5ST8LF123456',
    vehicle: {
      year: '2020',
      make: 'Chevrolet',
      model: 'Malibu'
    },
    contactPreferences: {
      phoneCall: true,
      whatsapp: true,
      textMessage: true
    },
    additionalNotes: 'Small dent and scratch on driver door. Needs paint matching. Would like estimate before starting work.',
    leadReference: '2025-1119-0001',
    leadCreatedAt: 'Nov 19, 2025',
    leadSource: 'Website Estimate Form',
    status: 'new',
    appointmentStatus: 'Scheduled',
    confirmedAt: null,
    adminNotes: 'Customer paying cash. Minor cosmetic work - door dent and paint. Quoted $850. Waiting for customer approval.',
  }
};
