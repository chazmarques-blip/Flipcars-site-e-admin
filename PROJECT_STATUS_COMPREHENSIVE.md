# FlipCars Project - Comprehensive Status Document

**Last Updated:** November 5, 2024  
**Project Phase:** 2 (Public Website) & 3 (Admin Dashboard) - In Progress  
**Overall Completion:** ~50%

---

## Executive Summary

FlipCars is a complete auto body shop management system consisting of:
1. **Public Website** (Phase 2) - Lead acquisition and customer engagement - ~60% complete
2. **Admin Dashboard** (Phase 3) - Internal management and operations - ~40% complete
3. **Backend API** (Phase 4) - Database and business logic - 0% (not started)

**Current Focus:** Finishing Phase 2 public website core features (hero carousel, branding, insurance carousel DONE; lead form, service pages PENDING)

---

## Detailed Component Status

### Phase 2: Public Website (`/home/user/webapp/frontend-public/`)

#### ✅ COMPLETED Components

**1. Hero Carousel (`src/components/features/Hero.tsx`)**
- 6 conversion-optimized slides with distinct messaging
- Auto-rotation every 5 seconds with manual override
- Navigation: Chevron arrows + dot indicators
- Animations: Smooth fade-in transitions
- Responsive: Mobile and desktop layouts
- Features:
  - Urgency badges on each slide
  - Trust indicators (4.8/5 rating, lifetime warranty)
  - Dual CTAs (Get Estimate + Phone Number)
  - Transparent logo watermark overlay
  - 30% height reduction for better conversions

**Slide Breakdown:**
1. "Crashed Your Car?" - Insurance repairs focus
2. "Collision Repair Experts" - Real frame machine photo
3. "Insurance Claims Specialists" - Direct billing emphasis
4. "Paint & Body Services" - Real paint booth photo
5. "Fast Turnaround Time" - 3-5 day promise
6. "500+ Happy Customers" - Car mosaic background

**2. Insurance Partners Carousel (`src/components/features/InsuranceCarousel.tsx`)**
- 8 major insurance companies displayed
- All logos converted to brand gold (#D4A259) using CSS filters
- Desktop: Infinite horizontal scroll (30s cycle, pause on hover)
- Mobile: Auto-rotating carousel (3s intervals, dot navigation)
- Trust badge: "Certified and Approved by All Major Insurers"
- Positioned strategically after Services section

**Insurance Companies:**
1. American Family Insurance
2. Progressive
3. Safeco Insurance (Liberty Mutual)
4. Kemper
5. Nationwide
6. Allstate
7. USAA
8. State Farm

**3. Design System**
- **Colors:**
  - Primary Gold: #D4A259 (rich, warm metallic)
  - Primary Hover: #C89533
  - Primary Light: #E6B96D
  - Primary Dark: #A67C2E
  - Secondary Black: #000000
  - Secondary Light: #1A1A1A
- **Typography:**
  - Headings: Poppins (Google Fonts, 700 weight)
  - Body: Inter (Google Fonts, 400 weight)
- **Spacing:** Optimized vertical rhythm, compact layout

**4. Layout Components**
- **Header** (`src/components/layout/Header.tsx`):
  - Height: h-28 with py-3 padding
  - FlipCars logo properly spaced
  - Navigation links prepared (currently minimal)
  - Sticky positioning
- **Footer** (`src/components/layout/Footer.tsx`):
  - Business info (phone, address)
  - Social media placeholders
  - Copyright information
  - Logo display

**5. Feature Sections**
- **Services** (`src/components/features/Services.tsx`):
  - 4 service cards (Collision Repair, Paint Services, Insurance Claims, Body Shop)
  - Icons from Lucide React
  - 50% padding reduction (py-10) for tighter layout
- **Why Choose Us** (`src/components/features/WhyChooseUs.tsx`):
  - 6 benefit cards (Experience, Quality, Speed, Warranty, Insurance, Equipment)
  - Icon + title + description format
- **Equipment Showcase** (`src/components/features/BeforeAfter.tsx`):
  - Renamed from "Before/After"
  - Showcases state-of-the-art equipment
  - Real equipment photography
- **Testimonials** (`src/components/features/Testimonials.tsx`):
  - Customer review carousel
  - Star ratings
  - Customer photos/avatars
- **CTA Section** (`src/components/features/CTASection.tsx`):
  - Final call-to-action before footer
  - Dual CTAs (Estimate + Call)

**6. Assets**
- **Images (13 total, ~630KB):**
  - `flipcars-logo.jpg` (12KB) - Official logo
  - `frame-machine.jpg` (77KB) - Red Camaro on frame platform
  - `paint-booth.jpg` (81KB) - Professional paint booth interior
  - `painter-working.jpg` (67KB) - Painter with spray gun (reserve)
  - `car-mosaic.jpg` (160KB) - Grid of 30-40 vehicles
  - `insurance-american-family.png` (34KB)
  - `insurance-progressive.png` (25KB)
  - `insurance-safeco.png` (31KB)
  - `insurance-kemper.png` (17KB)
  - `insurance-nationwide.png` (24KB)
  - `insurance-allstate.png` (41KB)
  - `insurance-usaa.png` (34KB)
  - `insurance-statefarm.png` (22KB)

**7. Configuration**
- **Tailwind Config** (`tailwind.config.ts`):
  - Custom gold/black color palette
  - Extended theme with brand colors
  - Container utilities
  - Custom font families
- **Next.js Config** (`next.config.js`):
  - Static export: `output: 'export'`
  - Image optimization disabled for static export
  - No API routes (frontend only)
- **Global Styles** (`src/styles/globals.css`):
  - Tailwind directives
  - Custom fade-in animation
  - Font imports (Poppins, Inter)

#### ⏳ PENDING Components (Phase 2)

**1. Multi-step Lead Form** `/estimate` route [HIGH PRIORITY]
**Purpose:** Primary lead acquisition mechanism
**Requirements:**
- 5-step wizard interface
- Step 1: Vehicle Information
  - Fields: Year (dropdown 2000-2025), Make, Model, VIN (optional)
  - Validation: Required fields, VIN format check
- Step 2: Damage Details
  - Fields: Damage description (textarea), Damage type (checkboxes), Severity (radio)
  - Options: Minor, Moderate, Severe
  - Types: Front-end, Rear-end, Side, Roof, Multiple areas
- Step 3: Insurance Information
  - Fields: Insurance company (dropdown with 8 carriers), Claim number, Adjuster name, Adjuster phone
  - Option: "No insurance" checkbox
- Step 4: Photos Upload
  - Fields: File upload (drag-and-drop or click)
  - Support: Up to 10 images, max 5MB each
  - Formats: JPG, PNG, HEIC
  - Preview thumbnails
- Step 5: Contact Information
  - Fields: Full name, Email, Phone, Preferred contact method (email/phone/text)
  - Additional: Best time to contact, Any questions/comments (textarea)
- **Features:**
  - Progress indicator at top showing 5 steps
  - Previous/Next navigation buttons
  - Data persistence in localStorage (save on each step)
  - Form validation with Zod schemas
  - Success page with confirmation message
  - Email notification to FlipCars (backend integration point)
- **Files to Create:**
  - `src/app/estimate/page.tsx` - Main container
  - `src/components/estimate/StepIndicator.tsx` - Progress bar
  - `src/components/estimate/Step1Vehicle.tsx`
  - `src/components/estimate/Step2Damage.tsx`
  - `src/components/estimate/Step3Insurance.tsx`
  - `src/components/estimate/Step4Photos.tsx`
  - `src/components/estimate/Step5Contact.tsx`
  - `src/components/estimate/SuccessPage.tsx`
  - `src/lib/validations/estimateSchema.ts` - Zod schemas
  - `src/lib/utils/localStorage.ts` - Persistence helpers
  - `src/types/estimate.ts` - TypeScript types

**2. Service Pages** (4 pages) [MEDIUM PRIORITY]
**Purpose:** Detailed service information and SEO

**A. Collision Repair** `/services/collision-repair`
- Hero section with service-specific image
- Service description
- What we repair: Frame straightening, structural damage, unibody repair
- Equipment: Computer-assisted measuring systems, frame machines
- Process: Assessment → Disassembly → Repair → Reassembly → QA
- Before/after examples
- FAQ section
- CTA to estimate form

**B. Paint Services** `/services/paint-services`
- Hero section
- Service description
- What we offer: Color matching, full paint jobs, spot repairs, clear coat
- Equipment: Computerized color matching, spray booths, infrared curing
- Process: Prep → Prime → Paint → Clear coat → Cure → Polish
- Color matching guarantee
- Before/after examples
- FAQ
- CTA

**C. Insurance Claims** `/services/insurance-claims`
- Hero section
- Service description
- What we handle: Claims processing, adjuster communication, direct billing
- Insurance partners: Display 8 logos
- Process: File claim → Assessment → Approval → Repair → Payment
- No upfront payment guarantee
- FAQ
- CTA

**D. Body Shop** `/services/body-shop`
- Hero section
- Service description
- What we repair: Dent removal, panel replacement, bumper repair, trim work
- Equipment: PDR tools, welding equipment, diagnostic tools
- Process varies by service
- Before/after examples
- FAQ
- CTA

**Files to Create:**
- `src/app/services/collision-repair/page.tsx`
- `src/app/services/paint-services/page.tsx`
- `src/app/services/insurance-claims/page.tsx`
- `src/app/services/body-shop/page.tsx`
- `src/components/services/ServiceHero.tsx` (reusable)
- `src/components/services/ServiceProcess.tsx` (reusable)
- `src/components/services/ServiceFAQ.tsx` (reusable)

**3. Gallery Page** `/gallery` [LOW PRIORITY]
**Purpose:** Showcase before/after work

**Requirements:**
- Grid layout (3-4 columns desktop, 1-2 mobile)
- Before/after image pairs
- Lightbox for full-screen view
- Filter by: All, Collision, Paint, Body Work
- Pagination or infinite scroll
- Image lazy loading

**Files to Create:**
- `src/app/gallery/page.tsx`
- `src/components/gallery/PhotoGrid.tsx`
- `src/components/gallery/Lightbox.tsx`
- `src/components/gallery/Filters.tsx`
- `src/components/gallery/BeforeAfterCard.tsx`

**4. Contact Page** `/contact` [LOW PRIORITY]
**Purpose:** Direct contact and location information

**Requirements:**
- Contact form (name, email, phone, message)
- Business information:
  - Address: (to be provided by client)
  - Phone: 321-960-8661
  - Email: (to be provided)
  - Hours: Monday-Friday 8am-6pm, Saturday 9am-2pm (example)
- Google Maps embed
- Social media links (Facebook, Instagram, etc.)
- Alternative contact methods

**Files to Create:**
- `src/app/contact/page.tsx`
- `src/components/contact/ContactForm.tsx`
- `src/components/contact/MapEmbed.tsx`
- `src/components/contact/BusinessInfo.tsx`

**5. Multilingual Support** (EN, ES, PT) [MEDIUM PRIORITY]
**Purpose:** Serve Hispanic and Brazilian communities

**Requirements:**
- Install next-intl package
- Create translation files for all content
- Language detection from browser
- Language switcher in header
- URL structure: `/:locale/...` (e.g., `/en`, `/es`, `/pt`)
- Translate all static content including:
  - Hero slides
  - Service descriptions
  - Form labels
  - Button text
  - Footer content

**Files to Create:**
- `messages/en.json` - English translations
- `messages/es.json` - Spanish translations
- `messages/pt.json` - Portuguese translations
- `src/middleware.ts` - Locale detection
- `src/components/layout/LanguageSwitcher.tsx`
- Update `next.config.js` with i18n config

**6. AI Chat Widget** [OPTIONAL]
**Purpose:** Real-time customer engagement

**Options:**
- Intercom ($$$ - most features)
- Drift ($$ - good for lead qualification)
- Tidio ($ - affordable, good features)
- Custom with OpenAI API (development time)

**Requirements:**
- Install widget script in layout
- Configure widget appearance (gold/black theme)
- Set up automated responses
- Configure lead capture
- Environment-based loading (only on production)

---

### Phase 3: Admin Dashboard (`/home/user/webapp/frontend-admin/`)

#### ✅ COMPLETED Components

**1. Activity Log System** (`src/app/dashboard/activity/` & `src/components/activity/`)
- Activity timeline view with filtering
- Activity types: Lead created, Estimate sent, Status changed, Payment received, etc.
- Filter by: Type, Date range, User
- Activity details modal for full information
- Export to CSV/Excel functionality
- Components:
  - `ActivityTimeline.tsx` - Main timeline display
  - `ActivityFilters.tsx` - Filter controls
  - `ActivityStats.tsx` - Activity statistics
  - `ActivityDetailsModal.tsx` - Detail popup

**2. Analytics Dashboard** (`src/app/dashboard/analytics/` & `src/components/analytics/`)
- KPI cards: Total revenue, Leads, Conversion rate, Avg repair time
- Charts (Recharts library):
  - Line chart: Revenue over time
  - Bar chart: Leads by source
  - Area chart: Services breakdown
  - Pie chart: Insurance company distribution
- Date range picker for filtering
- Export functionality
- Components:
  - `KPICard.tsx` - Metric display
  - `LineChart.tsx` - Time series data
  - `BarChart.tsx` - Categorical comparisons
  - `AreaChart.tsx` - Cumulative data
  - `PieChart.tsx` - Distribution data
  - `DateRangePicker.tsx` - Date selection

**3. Email Template System** (`src/app/dashboard/emails/` & `src/components/email/`)
- Template list with preview
- Rich text template editor
- Variable insertion ({{customerName}}, {{estimateAmount}}, etc.)
- Template categories: Welcome, Estimate, Reminder, Thank you, Follow-up
- Send history tracking
- Components:
  - `TemplateList.tsx` - All templates
  - `TemplateEditor.tsx` - Edit/create
  - `TemplatePreview.tsx` - Preview rendering
  - `SendHistory.tsx` - Email log

**4. File Management** (`src/app/dashboard/files/` & `src/components/files/`)
- File upload with drag-and-drop
- File list with preview thumbnails
- File types: Images, PDFs, Documents
- Filter by type and date
- Storage quota display
- Delete and download actions
- Components:
  - `FileUpload.tsx` - Upload interface
  - `FileList.tsx` - File browser
  - `FilePreview.tsx` - Preview modal

**5. Global Search** (`src/app/dashboard/search/` & `src/components/search/`)
- Search across: Leads, Customers, Estimates, Invoices
- Advanced filter builder
- Saved searches functionality
- Export search results
- Components:
  - `GlobalSearch.tsx` - Search input
  - `FilterBuilder.tsx` - Advanced filters
  - `SavedSearches.tsx` - Saved queries

**6. Settings Pages** (`src/app/dashboard/settings/` & `src/components/settings/`)
- Profile settings: Name, email, photo, bio
- Security settings: Password change, 2FA, sessions
- Appearance settings: Theme, color scheme, sidebar
- Notification preferences: Email, push, SMS
- Privacy settings: Data sharing, visibility
- Language settings: Interface language
- Components:
  - `ProfileSettings.tsx`
  - `SecuritySettings.tsx`
  - `AppearanceSettings.tsx`
  - `NotificationSettings.tsx`
  - `PrivacySettings.tsx`
  - `LanguageSettings.tsx`

**7. Notification System** (`src/components/notifications/`)
- Real-time notification bell icon
- Unread count badge
- Notification list with categories
- Mark as read functionality
- WebSocket integration prepared
- Components:
  - `NotificationBell.tsx` - Header icon
  - `NotificationList.tsx` - Dropdown list
  - `NotificationItem.tsx` - Single notification

#### ⏳ PENDING Components (Phase 3)

**1. Lead Management** (`src/app/dashboard/leads/`) [HIGH PRIORITY]
**Purpose:** Core lead tracking and conversion

**Requirements:**
- Lead list table with:
  - Columns: ID, Name, Vehicle, Status, Source, Date, Assigned to, Actions
  - Sorting by any column
  - Filtering: Status, Source, Date range, Assigned user
  - Pagination (25/50/100 per page)
  - Bulk actions (assign, delete, export)
- Lead detail view:
  - Full lead information from estimate form
  - Vehicle details
  - Damage photos gallery
  - Insurance information
  - Contact details
  - Status timeline
  - Notes section (add/edit/delete)
  - Activity log
  - Related estimate (if created)
- Status workflow:
  - New → Contacted → Qualified → Estimate Sent → Approved → In Progress → Completed → Closed
  - Alternate: Lost (with reason)
- Assignment:
  - Assign lead to staff member
  - Reassignment history
- Follow-up reminders:
  - Set reminder date/time
  - Notification when due
- Import/Export:
  - Import leads from CSV
  - Export leads to CSV/Excel

**Files to Create:**
- `src/app/dashboard/leads/page.tsx` - List view
- `src/app/dashboard/leads/[id]/page.tsx` - Detail view
- `src/components/leads/LeadList.tsx` - Table component
- `src/components/leads/LeadDetail.tsx` - Detail display
- `src/components/leads/LeadForm.tsx` - Create/edit form
- `src/components/leads/LeadStatusBadge.tsx` - Status indicator
- `src/components/leads/LeadNotes.tsx` - Notes section
- `src/components/leads/LeadTimeline.tsx` - Status history
- `src/components/leads/LeadAssignment.tsx` - Assignment UI
- `src/components/leads/LeadFilters.tsx` - Filter controls
- `src/stores/leadStore.ts` - Zustand state management
- `src/types/lead.ts` - TypeScript definitions

**2. Estimate Management** [HIGH PRIORITY]
**Purpose:** Create and manage repair estimates

**Requirements:**
- Estimate list:
  - Columns: Estimate #, Customer, Vehicle, Amount, Status, Date, Actions
  - Filtering and sorting
  - Quick actions: View, Edit, Email, PDF, Convert to Invoice
- Estimate creation/editing:
  - Customer selection (from leads or new)
  - Vehicle information
  - Line items table:
    - Description, Quantity, Unit price, Total
    - Add/remove rows
    - Part number lookup
  - Labor items:
    - Description, Hours, Rate, Total
  - Subtotal, Tax, Discount, Grand total calculations
  - Notes/Terms section
  - Save as draft or finalize
- Estimate templates:
  - Pre-built templates for common repairs
  - Quick fill from template
- PDF generation:
  - Professional estimate format
  - Company logo and info
  - Line items table
  - Terms and conditions
  - Download or email to customer
- Email to customer:
  - Select email template
  - Attach PDF
  - Track when opened
- Convert to invoice:
  - One-click conversion
  - Adjust items if needed
  - Generate invoice number

**Files to Create:**
- `src/app/dashboard/estimates/page.tsx` - List view
- `src/app/dashboard/estimates/new/page.tsx` - Create estimate
- `src/app/dashboard/estimates/[id]/page.tsx` - View/edit
- `src/components/estimates/EstimateList.tsx` - Table
- `src/components/estimates/EstimateDetail.tsx` - View
- `src/components/estimates/EstimateForm.tsx` - Create/edit
- `src/components/estimates/LineItemTable.tsx` - Items editor
- `src/components/estimates/EstimatePDF.tsx` - PDF generator
- `src/components/estimates/EstimateTemplate.tsx` - Template selector
- `src/components/estimates/EmailEstimate.tsx` - Email dialog
- `src/stores/estimateStore.ts` - State management
- `src/types/estimate.ts` - TypeScript types
- `src/lib/pdf/estimatePDF.ts` - PDF generation logic

**3. Calendar/Scheduling** [MEDIUM PRIORITY]
**Purpose:** Appointment and scheduling management

**Requirements:**
- Calendar views:
  - Month view
  - Week view
  - Day view
  - Agenda view
- Appointment types:
  - Estimate appointment
  - Drop-off
  - Pick-up
  - Consultation
- Appointment creation:
  - Customer selection
  - Vehicle selection
  - Date and time picker
  - Duration
  - Type
  - Assigned staff
  - Notes
- Drag-and-drop rescheduling
- Color coding by type or staff
- Conflict detection (double-booking)
- Customer notifications:
  - Appointment confirmation
  - Reminder (24 hours before)
  - SMS and email options
- Staff assignment and availability
- Appointment history

**Library:** FullCalendar React

**Files to Create:**
- `src/app/dashboard/calendar/page.tsx` - Calendar view
- `src/components/calendar/CalendarView.tsx` - Main calendar
- `src/components/calendar/AppointmentModal.tsx` - Create/edit
- `src/components/calendar/AppointmentDetail.tsx` - View
- `src/components/calendar/StaffAvailability.tsx` - Staff schedule
- `src/stores/calendarStore.ts` - State
- `src/types/appointment.ts` - Types

**4. Customer Database** [MEDIUM PRIORITY]
**Purpose:** Customer relationship management

**Requirements:**
- Customer list:
  - Search by name, phone, email, vehicle
  - Filter by date range, status
  - Sort by various fields
- Customer profile:
  - Contact information
  - Multiple vehicles
  - Lead history
  - Estimate history
  - Invoice history
  - Payment history
  - Appointment history
  - Notes
  - Files/documents
- Quick actions:
  - Call customer
  - Email customer
  - Create estimate
  - Schedule appointment
- Customer stats:
  - Total spent
  - Number of visits
  - Average repair cost
  - Last visit date

**Files to Create:**
- `src/app/dashboard/customers/page.tsx` - List
- `src/app/dashboard/customers/[id]/page.tsx` - Profile
- `src/components/customers/CustomerList.tsx`
- `src/components/customers/CustomerProfile.tsx`
- `src/components/customers/CustomerVehicles.tsx`
- `src/components/customers/CustomerHistory.tsx`
- `src/stores/customerStore.ts`
- `src/types/customer.ts`

**5. Inventory Management** [LOW PRIORITY]
**Purpose:** Parts and supplies tracking

**Requirements:**
- Parts list:
  - Part number, Name, Description, Quantity, Location, Supplier
  - Low stock alerts
  - Filter by category
- Add/edit/delete parts
- Stock adjustment (in/out)
- Purchase orders:
  - Create PO to supplier
  - Receive PO (update stock)
  - Track PO status
- Usage tracking:
  - Link parts to estimates/invoices
  - Deduct from stock automatically
- Supplier management:
  - Supplier list
  - Contact information
  - Order history

**Files to Create:**
- `src/app/dashboard/inventory/page.tsx`
- `src/app/dashboard/inventory/purchase-orders/page.tsx`
- `src/components/inventory/PartsList.tsx`
- `src/components/inventory/PartForm.tsx`
- `src/components/inventory/PurchaseOrderForm.tsx`
- `src/components/inventory/StockAlert.tsx`
- `src/stores/inventoryStore.ts`
- `src/types/inventory.ts`

**6. Invoice/Billing** [HIGH PRIORITY]
**Purpose:** Payment tracking and receipts

**Requirements:**
- Invoice list:
  - Similar to estimates
  - Status: Draft, Sent, Paid, Overdue, Cancelled
- Invoice creation:
  - Convert from estimate or create new
  - Line items like estimates
  - Payment terms
  - Due date
- Payment recording:
  - Payment method (cash, card, check, insurance)
  - Amount paid
  - Date paid
  - Receipt generation
- Outstanding balance tracking
- Payment reminders
- Partial payments
- Refunds

**Files to Create:**
- `src/app/dashboard/invoices/page.tsx`
- `src/app/dashboard/invoices/[id]/page.tsx`
- `src/components/invoices/InvoiceList.tsx`
- `src/components/invoices/InvoiceDetail.tsx`
- `src/components/invoices/PaymentForm.tsx`
- `src/components/invoices/Receipt.tsx`
- `src/stores/invoiceStore.ts`
- `src/types/invoice.ts`

**7. Reporting System** [MEDIUM PRIORITY]
**Purpose:** Business intelligence and insights

**Requirements:**
- Revenue reports:
  - Daily, weekly, monthly, yearly
  - Line chart over time
  - Breakdown by service type
  - Comparison to previous period
- Lead reports:
  - Lead sources
  - Conversion rates
  - Time to conversion
  - Lost lead reasons
- Service reports:
  - Most popular services
  - Revenue by service
  - Average service cost
- Insurance reports:
  - Revenue by insurance company
  - Most common insurance partners
  - Insurance vs. cash customers
- Staff reports:
  - Leads per staff
  - Estimates per staff
  - Revenue per staff
  - Customer satisfaction by staff
- Custom report builder:
  - Select metrics
  - Select dimensions
  - Date range
  - Export to CSV/Excel/PDF

**Files to Create:**
- `src/app/dashboard/reports/page.tsx`
- `src/app/dashboard/reports/revenue/page.tsx`
- `src/app/dashboard/reports/leads/page.tsx`
- `src/app/dashboard/reports/services/page.tsx`
- `src/app/dashboard/reports/custom/page.tsx`
- `src/components/reports/ReportChart.tsx`
- `src/components/reports/ReportFilters.tsx`
- `src/components/reports/CustomReportBuilder.tsx`
- `src/types/report.ts`

---

### Phase 4: Backend API (`/home/user/webapp/backend/` - NOT STARTED)

#### Technology Stack Decision Required

**Option A: Node.js + Express + PostgreSQL + Prisma**
- **Pros:** Same language as frontend (TypeScript), large ecosystem, good performance
- **Cons:** Callback hell (mitigated with async/await), less structured than NestJS
- **Best For:** Fast development, smaller teams, flexibility

**Option B: Python + FastAPI + PostgreSQL + SQLAlchemy**
- **Pros:** Clean syntax, excellent type hints, auto-generated API docs, fast performance
- **Cons:** Different language from frontend, smaller ecosystem than Node
- **Best For:** Data-heavy applications, machine learning integration, clean code

**Option C: Node.js + NestJS + PostgreSQL + TypeORM**
- **Pros:** Highly structured (Angular-like), built-in dependency injection, scalable
- **Cons:** Steeper learning curve, more boilerplate
- **Best For:** Large applications, enterprise needs, team development

**Recommendation:** Option A (Node.js + Express + Prisma) for fastest development with TypeScript consistency.

#### Database Schema (Preliminary Design)

**Core Tables:**

1. **users**
   - id (UUID, primary key)
   - email (unique)
   - password_hash
   - first_name
   - last_name
   - role (enum: admin, manager, staff)
   - avatar_url
   - created_at
   - updated_at
   - last_login_at

2. **customers**
   - id (UUID)
   - first_name
   - last_name
   - email
   - phone
   - address
   - city
   - state
   - zip
   - notes
   - created_at
   - updated_at

3. **vehicles**
   - id (UUID)
   - customer_id (FK)
   - year
   - make
   - model
   - vin
   - color
   - license_plate
   - created_at
   - updated_at

4. **leads**
   - id (UUID)
   - customer_id (FK, nullable initially)
   - vehicle_id (FK, nullable)
   - source (enum: website, phone, referral, walk-in)
   - status (enum: new, contacted, qualified, estimate_sent, approved, in_progress, completed, lost)
   - assigned_to (FK to users)
   - damage_description
   - damage_type (array: front, rear, side, etc.)
   - damage_severity (enum: minor, moderate, severe)
   - insurance_company
   - claim_number
   - adjuster_name
   - adjuster_phone
   - has_insurance (boolean)
   - preferred_contact (enum: email, phone, text)
   - best_time_to_contact
   - notes
   - created_at
   - updated_at

5. **files**
   - id (UUID)
   - lead_id (FK, nullable)
   - estimate_id (FK, nullable)
   - invoice_id (FK, nullable)
   - customer_id (FK, nullable)
   - file_name
   - file_path (S3 or local)
   - file_type (enum: image, pdf, document)
   - file_size
   - mime_type
   - uploaded_by (FK to users)
   - created_at

6. **estimates**
   - id (UUID)
   - estimate_number (unique, auto-increment formatted)
   - lead_id (FK)
   - customer_id (FK)
   - vehicle_id (FK)
   - status (enum: draft, sent, approved, declined, expired)
   - subtotal
   - tax_rate
   - tax_amount
   - discount_amount
   - total_amount
   - notes
   - terms
   - valid_until
   - created_by (FK to users)
   - created_at
   - updated_at
   - sent_at
   - approved_at

7. **estimate_items**
   - id (UUID)
   - estimate_id (FK)
   - type (enum: part, labor, misc)
   - description
   - part_number (nullable)
   - quantity
   - unit_price
   - line_total
   - sort_order
   - created_at
   - updated_at

8. **invoices**
   - id (UUID)
   - invoice_number (unique)
   - estimate_id (FK, nullable)
   - customer_id (FK)
   - vehicle_id (FK)
   - status (enum: draft, sent, paid, overdue, cancelled)
   - subtotal
   - tax_rate
   - tax_amount
   - discount_amount
   - total_amount
   - amount_paid
   - balance_due
   - payment_terms
   - due_date
   - notes
   - created_by (FK to users)
   - created_at
   - updated_at
   - sent_at
   - paid_at

9. **invoice_items**
   - (same structure as estimate_items)

10. **payments**
    - id (UUID)
    - invoice_id (FK)
    - amount
    - payment_method (enum: cash, card, check, insurance_direct)
    - payment_date
    - reference_number
    - notes
    - recorded_by (FK to users)
    - created_at

11. **appointments**
    - id (UUID)
    - customer_id (FK)
    - vehicle_id (FK)
    - lead_id (FK, nullable)
    - type (enum: estimate, drop_off, pick_up, consultation)
    - start_time
    - end_time
    - duration_minutes
    - assigned_to (FK to users)
    - status (enum: scheduled, confirmed, in_progress, completed, cancelled, no_show)
    - notes
    - created_by (FK to users)
    - created_at
    - updated_at
    - cancelled_at
    - cancellation_reason

12. **activities**
    - id (UUID)
    - user_id (FK)
    - entity_type (enum: lead, estimate, invoice, customer, appointment)
    - entity_id (UUID)
    - action (enum: created, updated, deleted, status_changed, sent, paid, etc.)
    - description (auto-generated human-readable)
    - metadata (JSON)
    - created_at

13. **notes**
    - id (UUID)
    - user_id (FK)
    - entity_type
    - entity_id
    - content (text)
    - is_internal (boolean)
    - created_at
    - updated_at

14. **email_templates**
    - id (UUID)
    - name
    - category (enum: welcome, estimate, invoice, reminder, thank_you, follow_up)
    - subject
    - body_html
    - body_text
    - variables (JSON array: ["customerName", "estimateAmount", etc.])
    - is_active
    - created_at
    - updated_at

15. **email_logs**
    - id (UUID)
    - template_id (FK, nullable)
    - to_email
    - from_email
    - subject
    - body_html
    - entity_type
    - entity_id
    - status (enum: queued, sent, delivered, opened, clicked, bounced, failed)
    - sent_at
    - delivered_at
    - opened_at
    - clicked_at
    - error_message (nullable)
    - created_at

16. **settings**
    - id (UUID)
    - key (unique)
    - value (JSON)
    - type (enum: business, email, notification, integration)
    - description
    - updated_at

17. **parts_inventory** (if inventory module needed)
    - id (UUID)
    - part_number (unique)
    - name
    - description
    - category
    - quantity_on_hand
    - minimum_quantity (for alerts)
    - unit_cost
    - supplier_id (FK)
    - location
    - created_at
    - updated_at

18. **suppliers**
    - id (UUID)
    - name
    - contact_name
    - email
    - phone
    - address
    - city
    - state
    - zip
    - website
    - notes
    - created_at
    - updated_at

#### API Endpoints (RESTful Design)

**Authentication:**
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login
- POST /api/auth/logout - Logout
- POST /api/auth/refresh - Refresh JWT token
- POST /api/auth/forgot-password - Request password reset
- POST /api/auth/reset-password - Reset password with token
- GET /api/auth/me - Get current user

**Leads:**
- POST /api/leads - Create lead (from public form)
- GET /api/leads - List leads (paginated, filtered, sorted)
- GET /api/leads/:id - Get lead details
- PUT /api/leads/:id - Update lead
- DELETE /api/leads/:id - Delete lead
- PATCH /api/leads/:id/status - Update lead status
- POST /api/leads/:id/notes - Add note to lead
- GET /api/leads/:id/notes - Get lead notes
- POST /api/leads/:id/assign - Assign lead to user
- GET /api/leads/stats - Get lead statistics

**Customers:**
- POST /api/customers - Create customer
- GET /api/customers - List customers
- GET /api/customers/:id - Get customer details
- PUT /api/customers/:id - Update customer
- DELETE /api/customers/:id - Delete customer
- GET /api/customers/:id/vehicles - Get customer vehicles
- GET /api/customers/:id/history - Get full history (leads, estimates, invoices)
- GET /api/customers/:id/stats - Get customer statistics

**Vehicles:**
- POST /api/vehicles - Create vehicle
- GET /api/vehicles/:id - Get vehicle details
- PUT /api/vehicles/:id - Update vehicle
- DELETE /api/vehicles/:id - Delete vehicle

**Estimates:**
- POST /api/estimates - Create estimate
- GET /api/estimates - List estimates
- GET /api/estimates/:id - Get estimate details
- PUT /api/estimates/:id - Update estimate
- DELETE /api/estimates/:id - Delete estimate
- PATCH /api/estimates/:id/status - Update status
- POST /api/estimates/:id/items - Add line item
- PUT /api/estimates/:id/items/:itemId - Update line item
- DELETE /api/estimates/:id/items/:itemId - Delete line item
- GET /api/estimates/:id/pdf - Generate PDF
- POST /api/estimates/:id/email - Email estimate
- POST /api/estimates/:id/convert-to-invoice - Convert to invoice

**Invoices:**
- POST /api/invoices - Create invoice
- GET /api/invoices - List invoices
- GET /api/invoices/:id - Get invoice details
- PUT /api/invoices/:id - Update invoice
- DELETE /api/invoices/:id - Delete invoice
- POST /api/invoices/:id/payments - Record payment
- GET /api/invoices/:id/payments - Get payment history
- GET /api/invoices/:id/pdf - Generate PDF
- POST /api/invoices/:id/email - Email invoice

**Appointments:**
- POST /api/appointments - Create appointment
- GET /api/appointments - List appointments (with date range filter)
- GET /api/appointments/:id - Get appointment details
- PUT /api/appointments/:id - Update appointment
- DELETE /api/appointments/:id - Cancel appointment
- PATCH /api/appointments/:id/status - Update status
- GET /api/appointments/availability - Check staff availability

**Files:**
- POST /api/files - Upload file(s)
- GET /api/files/:id - Get file (download)
- DELETE /api/files/:id - Delete file
- GET /api/files - List files (filtered by entity)

**Analytics:**
- GET /api/analytics/kpis - Get key performance indicators
- GET /api/analytics/revenue - Revenue data (time series)
- GET /api/analytics/leads - Lead metrics
- GET /api/analytics/services - Service breakdown
- GET /api/analytics/insurance - Insurance company breakdown

**Activities:**
- GET /api/activities - Get activity log (filtered, paginated)
- GET /api/activities/stats - Get activity statistics

**Email Templates:**
- GET /api/email-templates - List templates
- GET /api/email-templates/:id - Get template
- POST /api/email-templates - Create template
- PUT /api/email-templates/:id - Update template
- DELETE /api/email-templates/:id - Delete template

**Settings:**
- GET /api/settings - Get all settings
- GET /api/settings/:key - Get specific setting
- PUT /api/settings/:key - Update setting

**Reports:**
- GET /api/reports/revenue - Revenue report
- GET /api/reports/leads - Lead report
- GET /api/reports/services - Service report
- GET /api/reports/custom - Custom report (with query parameters)

#### Backend Development Setup

**Step 1: Initialize Project**
```bash
cd /home/user/webapp
mkdir backend
cd backend
npm init -y
```

**Step 2: Install Dependencies**
```bash
# Core
npm install express cors helmet morgan dotenv
npm install @prisma/client bcryptjs jsonwebtoken

# Dev dependencies
npm install -D typescript @types/node @types/express @types/bcryptjs @types/jsonwebtoken
npm install -D ts-node nodemon prisma

# Initialize TypeScript
npx tsc --init

# Initialize Prisma
npx prisma init
```

**Step 3: Configure Prisma**
Edit `prisma/schema.prisma` with database schema

**Step 4: Environment Variables**
Create `.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/flipcars"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
PORT=4000
NODE_ENV="development"
```

**Step 5: Project Structure**
```
backend/
├── src/
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── leadController.ts
│   │   ├── customerController.ts
│   │   ├── estimateController.ts
│   │   ├── invoiceController.ts
│   │   └── ...
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── leadRoutes.ts
│   │   └── ...
│   ├── middleware/
│   │   ├── authMiddleware.ts
│   │   ├── errorHandler.ts
│   │   └── validators.ts
│   ├── services/
│   │   ├── emailService.ts
│   │   ├── pdfService.ts
│   │   └── ...
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── jwt.ts
│   │   └── bcrypt.ts
│   └── app.ts
├── prisma/
│   └── schema.prisma
├── package.json
├── tsconfig.json
└── .env
```

---

## Current Development Environment

### Server Status
- **Port 9000:** Python HTTP server
  - Serving: `frontend-public/out/` (static Next.js build)
  - URL: https://9000-i0s90jm77mc76ydqc5fpz-dfc00ec5.sandbox.novita.ai
  - Status: Running
  - PID: 28610

### Git Status
- **Repository:** https://github.com/chazmarques-blip/Flipcars-site-e-admin
- **Current Branch:** genspark_ai_developer
- **Active PR:** #1 - https://github.com/chazmarques-blip/Flipcars-site-e-admin/pull/1
- **Last Commit:** "feat(phase2): FlipCars public website - hero carousel, branding, and insurance partners"
- **Commits Ahead of Main:** 1 (squashed)
- **Working Directory:** Clean (all changes committed)

---

## Development Workflow

### Git Workflow (STRICTLY ENFORCED)

**MANDATORY RULES:**
1. **Commit after EVERY code change** - No exceptions
2. **Create/update PR after every commit** - Mandatory
3. **Squash commits before pushing** - Use non-interactive method
4. **Resolve conflicts favoring remote** - When possible
5. **Test after every significant change**

**Step-by-Step Process:**

```bash
# 1. Make code changes
# ... edit files ...

# 2. Stage changes
cd /home/user/webapp/frontend-public  # or frontend-admin
git add .

# 3. Commit immediately with descriptive message
git commit -m "type(scope): brief description

- Detailed change 1
- Detailed change 2
- Detailed change 3"

# Commit types: feat, fix, docs, style, refactor, test, chore

# 4. Fetch latest from remote
git fetch origin main

# 5. Check if remote has new commits
git rev-list --count HEAD..origin/main
# If output is 0, no remote changes
# If output > 0, need to sync

# 6. If remote has changes, rebase
git rebase origin/main
# Or merge if preferred:
# git merge origin/main

# 7. Resolve conflicts if any
# Edit conflicted files, preferring remote code when logical
git add <resolved-files>
git rebase --continue
# Or for merge:
# git commit

# 8. Count local commits to squash
git rev-list --count origin/main..HEAD
# Note the number (N)

# 9. Squash all local commits (non-interactive method)
git reset --soft HEAD~N  # N from step 8
git commit -m "feat(scope): comprehensive commit message

Detailed description of all changes:
- Feature 1 with explanation
- Feature 2 with explanation
- Files modified: file1.tsx, file2.tsx
- etc."

# 10. Force push (required after squash/rebase)
git push -f origin genspark_ai_developer

# 11. Update pull request description
gh pr edit 1 --body "Updated PR description with all changes..."

# 12. Verify PR was updated
gh pr view 1 --json url
```

### Development Process

**For Frontend Public (Phase 2):**
```bash
cd /home/user/webapp/frontend-public

# Make changes
# ... edit components ...

# Test locally (optional)
npm run dev

# Build for production
npm run build

# Serve static site
cd out && python3 -m http.server 9000 &

# Get public URL
# Use GetServiceUrl tool with port 9000

# Follow git workflow above
```

**For Frontend Admin (Phase 3):**
```bash
cd /home/user/webapp/frontend-admin

# Make changes
# ... edit components ...

# Test locally
npm run dev

# Build
npm run build

# Follow git workflow
```

---

## Useful Commands Reference

### Navigation
```bash
cd /home/user/webapp
pwd
ls -la
cat CONTINUATION_COMMAND.md
cat PROJECT_STATUS_COMPREHENSIVE.md
```

### Git
```bash
git status
git log --oneline -10
git branch
git diff
gh pr list
gh pr view 1
```

### NPM
```bash
npm install
npm run dev
npm run build
npm run lint
```

### File Operations
```bash
find . -name "*.tsx" | head -20
grep -r "SEARCH_TERM" src/
ls -lh public/images/
```

### Process Management
```bash
ps aux | grep "http.server"
ps aux | grep "node"
kill PID
```

---

## Next Steps Summary

### Immediate (Next Session):
1. **Multi-step Lead Form** - Critical for lead acquisition
   - OR -
2. **Service Pages** - If client wants more content first

### Short Term (This Week):
3. **Gallery Page** - Visual showcase
4. **Contact Page** - Direct contact
5. **Lead Management** (Admin) - Core functionality

### Medium Term (Next Week):
6. **Multilingual Support** - EN/ES/PT
7. **Estimate Management** (Admin)
8. **Backend Project Setup**

### Long Term (Following Weeks):
9. **Calendar/Scheduling**
10. **Customer Database**
11. **Invoice/Billing**
12. **Reporting System**
13. **AI Chat Widget** (optional)

---

**Document Status:** Complete and ready for new session
**Last Verified:** November 5, 2024
**Maintainer:** AI Assistant (Claude/GPT)
